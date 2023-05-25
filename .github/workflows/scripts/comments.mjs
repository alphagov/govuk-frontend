import { readFile } from 'node:fs/promises'

/**
 * Posts the content of a diff as a comment on a Github issue
 *
 * @param {GithubActionContext} githubActionContext
 * @param {number} issueNumber
 * @param {DiffComment} diffComment
 */
export async function commentDiff (
  githubActionContext,
  issueNumber,
  { path, title, markerText }
) {
  // Read diff from previous step, defaulting to a little note if the diff is empty
  // Using `||` and not `??` as `readFile` will return `''` (so not `null` nor `undefined` that `??` handles)
  const diffText = await readFile(path, 'utf8') || 'No changes found.'

  // Add or update comment on PR
  try {
    await comment(
      githubActionContext,
      issueNumber,
      markerText,
      `## ${title}\n` +
        '```diff\n' +
        `${diffText}\n` +
        '```'
    )
  } catch {
    await comment(
      githubActionContext,
      issueNumber,
      markerText,
      // Unfortunately the best we can do here is a link to the "Artifacts"
      // section as [the upload-artifact action doesn't provide the public
      // URL](https://github.com/actions/upload-artifact/issues/50) :'(
      `## ${title}\n` +
        `The diff could not be posted as a comment. You can download it from the [workflow artifacts](${githubActionRunUrl(
          githubActionContext.context
        )}#artifacts).`
    )
  }
}

/**
 * @param {GithubActionContext} githubContext - Github Action context
 * @param {number} issueNumber - The number of the issue/PR on which to post the comment
 * @param {string} markerText - A unique marker used to identify the correct comment
 * @param {string} bodyText - The body of the comment
 */
export async function comment ({ github, context, commit }, issueNumber, markerText, bodyText) {
  const marker = `<!-- ${markerText} -->\n`
  const footer = renderCommentFooter({ context, commit })
  const body = `${marker}${bodyText}\n\n${footer}`

  let commentId

  /**
   * @satisfies {IssueCommentsListParams}
   */
  const issueParameters = {
    issue_number: issueNumber,
    owner: context.repo.owner,
    repo: context.repo.repo
  }

  /**
   * Finds the first issue comment for which the `matcher` function returns `true`
   *
   * {@link https://github.com/peter-evans/find-comment/blob/main/src/find.ts}
   */
  for await (const { data: comments } of github.paginate.iterator(
    github.rest.issues.listComments,
    issueParameters
  )) {
    const comment = comments.find((comment) => !!comment.body?.includes(marker))

    if (comment) {
      commentId = comment.id
    }
  }

  /**
   * Create GitHub issue comment
   *
   * Updates existing comment by ID if available
   */
  await (!commentId
    ? github.rest.issues.createComment({ ...issueParameters, body })
    : github.rest.issues.updateComment({ ...issueParameters, body, comment_id: commentId }))
}

/**
 * @param {Pick<GithubActionContext, "context" | "commit">} githubActionContext
 * @returns {string} - The content for the footer
 */
function renderCommentFooter ({ context, commit }) {
  return `[Action run](${githubActionRunUrl(context)}) for ${commit}`
}

/**
 * Generates a URL to the Github action run
 *
 * @param {import('@actions/github').context} context - The context of the github action
 * @returns {string} The URL to the "Artifacts" section of the given run
 */
function githubActionRunUrl (context) {
  const { runId, repo } = context

  return `https://github.com/${repo.owner}/${repo.repo}/actions/runs/${runId}/attempts/${process.env.GITHUB_RUN_ATTEMPT}`
}

/**
 * @typedef {object} GithubActionContext
 * @property {import('@octokit/rest').Octokit} github - The pre-authenticated Octokit provided by Github actions
 * @property {import('@actions/github').context} context - The context of the Github action
 * @property {string} commit - The SHA of the commit that triggered the action
 */

/**
 * @typedef {object} DiffComment
 * @property {string} path - The path of the file to post as a comment
 * @property {string} title - The title of the comment
 * @property {string} markerText - The marker to identify the comment
 */

/**
 * @typedef {import('@octokit/plugin-rest-endpoint-methods').RestEndpointMethodTypes["issues"]} IssuesEndpoint
 * @typedef {IssuesEndpoint["updateComment"]["parameters"]} IssueCommentUpdateParams
 * @typedef {IssuesEndpoint["listComments"]["parameters"]} IssueCommentsListParams
 */
