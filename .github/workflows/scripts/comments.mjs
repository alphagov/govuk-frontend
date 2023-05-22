import { readFile } from 'node:fs/promises'

const DIST_DIFFS = [
  {
    file: 'dist-js.diff',
    title: 'JavaScript changes to `dist`',
    marker: 'dist-diff-js'
  },
  {
    file: 'dist-css.diff',
    title: 'CSS changes to `dist`',
    marker: 'dist-diff-css'
  },
  {
    file: 'dist-other.diff',
    title: 'Other changes to `dist`',
    marker: 'dist-diff-other'
  }
]

/**
 * @param {object} githubContext - Github Action context
 * @param {import('@octokit/rest').Octokit} githubContext.github
 * @param {import('@actions/github').context} githubContext.context
 * @param {string} githubContext.workspacePath
 * @param {number} githubContext.issueNumber
 * @param {string} githubContext.commit
 */
export async function commentDistDiffs (
  { github, context, workspacePath, issueNumber, commit }
) {
  for (const { file, title, marker } of DIST_DIFFS) {
    // Read diff from previous step
    const diffText = await readFile(`${workspacePath}/${file}`, 'utf8')

    // Add or update comment on PR
    try {
      await comment({ github, context, issueNumber }, marker, `## ${title}\n` +
        '```diff\n' +
        `${diffText}\n` +
        '```\n\n' +
        `SHA: ${commit}\n`
      )
    } catch {
      await comment({ github, context, issueNumber }, marker, `## ${title}\n` +
        `The diff could not be posted as a comment. You can download it from the [workflow artifacts](${githubActionArtifactsUrl(context.runId)}).` +
        '\n\n' +
        `SHA: ${commit}\n`
      )
    }
  }
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
 * @param {object} githubContext - Github Action context
 * @param {import('@octokit/rest').Octokit} githubContext.github
 * @param {import('@actions/github').context} githubContext.context
 * @param {number} githubContext.issueNumber - GitHub issue or PR number
 * @param {string} markerText - A unique marker used to identify the correct comment
 * @param {string} bodyText - The body of the comment
 */
export async function comment ({ github, context, issueNumber }, markerText, bodyText) {
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
   * Updates existing commentby ID if available
   */
  await (!commentId
    ? github.rest.issues.createComment({ ...issueParameters, body })
    : github.rest.issues.updateComment({ ...issueParameters, body, comment_id: commentId }))
}

/**
 * @typedef {import('@octokit/plugin-rest-endpoint-methods').RestEndpointMethodTypes["issues"]} IssuesEndpoint
 * @typedef {IssuesEndpoint["updateComment"]["parameters"]} IssueCommentUpdateParams
 * @typedef {IssuesEndpoint["listComments"]["parameters"]} IssueCommentsListParams
 */
