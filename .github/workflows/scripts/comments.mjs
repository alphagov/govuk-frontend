/**
 * @param {object} githubContext - Github Action context
 * @param {import('@octokit/rest').Octokit} githubContext.github
 * @param {import('@actions/github').context} githubContext.context
 * @param {number} issueNumber - GitHub issue or PR number
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
