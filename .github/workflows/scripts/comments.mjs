import { readFile } from 'node:fs/promises'

/**
 * Posts the content of multiple diffs in parallel on the given Github issue
 *
 * @param {GithubActionContext} githubActionContext
 * @param {number} issueNumber
 * @param {DiffComment[]} diffs
 */
export async function commentDiffs (
  githubActionContext,
  issueNumber,
  diffs
) {
  // Run the comments in parallel to avoid that an early one failing prevents the others
  // and use `allSettled` to avoid the promise rejecting on the first failure but wait
  // for everything to complete
  const results = await Promise.allSettled(
    diffs.map((diff) =>
      commentDiff(githubActionContext, issueNumber, diff)
    )
  )

  if (results.some(result => result.status === 'rejected')) {
    throw new Error('Posting diff comment failed', {
      cause: results
    })
  }
}

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
      {
        markerText,
        title,
        bodyText: '```diff\n' +
          `${diffText}\n` +
          '```'
      }
    )
  } catch {
    await comment(
      githubActionContext,
      issueNumber,
      {
        markerText,
        title,
        // Unfortunately the best we can do here is a link to the "Artifacts"
        // section as [the upload-artifact action doesn't provide the public
        // URL](https://github.com/actions/upload-artifact/issues/50) :'(
        bodyText: `The diff could not be posted as a comment. You can download it from the [workflow artifacts](${githubActionRunUrl(
          githubActionContext.context
        )}#artifacts).`
      }
    )
  }
}

/**
 * @param {GithubActionContext} githubContext - Github Action context
 * @param {number} issueNumber - The number of the issue/PR on which to post the comment
 * @param {object} comment
 * @param {string} comment.markerText - A unique marker used to identify the correct comment
 * @param {string} comment.title - The title of the comment
 * @param {string} comment.bodyText - The body of the comment
 */
export async function comment ({ github, context, commit }, issueNumber, { title, markerText, bodyText }) {
  const marker = `<!-- ${markerText} -->`
  const body = [
    marker,
    `## ${title}`,
    bodyText,
    '\n---', // <hr> for a little extra separation from content
    renderCommentFooter({ context, commit })
  ].join('\n')

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
