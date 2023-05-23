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
  // Read diff from previous step
  const diffText = await readFile(path, 'utf8')

  // Add or update comment on PR
  try {
    await comment(
      githubActionContext,
      issueNumber,
      markerText,
      `## ${title}\n` +
        '```diff\n' +
        `${diffText}\n` +
        '```\n\n' +
        `SHA: ${githubActionContext.commit}\n`
    )
  } catch {
    await comment(
      githubActionContext,
      issueNumber,
      markerText,
      `## ${title}\n` +
        `The diff could not be posted as a comment. You can download it from the [workflow artifacts](${githubActionArtifactsUrl(
          githubActionContext.context.runId
        )}).` +
        '\n\n' +
        `SHA: ${githubActionContext.commit}\n`
    )
  }
}

/**
 * @param {GithubActionContext} githubContext - Github Action context
 * @param {number} issueNumber - The number of the issue/PR on which to post the comment
 * @param {string} markerText - A unique marker used to identify the correct comment
 * @param {string} bodyText - The body of the comment
 */
export async function comment ({ github, context }, issueNumber, markerText, bodyText) {
  const marker = `<!-- ${markerText} -->\n`
  const body = `${marker}${bodyText}`

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
 * Generates a URL to the "Artifacts" section of a Github action run
 *
 * Unfortunately the best we can do here is a link to the "Artifacts" section as
 * [the upload-artifact action doesn't provide
 * the public URL](https://github.com/actions/upload-artifact/issues/50) :'(
 *
 * @param {number} runId - - The ID of the Github action run
 * @returns {string} The URL to the "Artifacts" section of the given run
 */
function githubActionArtifactsUrl (runId) {
  return `https://github.com/alphagov/govuk-frontend/actions/runs/${runId}/#artifacts`
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
