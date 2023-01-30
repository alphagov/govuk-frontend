const generateStatsMessage = require('./generate-stats-message.js')

const DOWNLOAD_LINK_TEXT =
  "Interactive visualisation can be downloaded from the build's artifacts"

const COMMENT_MARKER = `[${DOWNLOAD_LINK_TEXT}]`

module.exports = async function ({ github, context }) {
  const issueParameters = {
    issue_number: context.payload.pull_request.number,
    owner: context.repo.owner,
    repo: context.repo.repo
  }

  const body = `${generateStatsMessage()}

[View stats on the review app](${reviewAppUrl(
    context.payload.pull_request.number
  )})

[${DOWNLOAD_LINK_TEXT}](${githubActionArtifactsUrl(context.runId)})`

  const comment = await findFirstIssueCommentMatching(
    (comment) => comment.body.includes(COMMENT_MARKER),
    {
      github,
      issueParameters
    }
  )

  if (comment) {
    return github.rest.issues.updateComment({
      ...issueParameters,
      comment_id: comment.id,
      body
    })
  } else {
    return github.rest.issues.createComment({
      ...issueParameters,
      body
    })
  }
}

function reviewAppUrl (prNumber) {
  return `https://govuk-frontend-pr-${prNumber}.herokuapp.com/stats/`
}

/**
 * Generates a URL to the "Artifacts" section of a Github action run
 *
 * Unfortunately the best we can do here is a link to the "Artifacts" section as
 * [the upload-artifact action doesn't provide
 * the public URL](https://github.com/actions/upload-artifact/issues/50) :'(
 *
 *
 * @param {string|number} runId -- The ID of the Github action run
 * @returns {string} The URL to the "Artifacts" section of the given run
 */
function githubActionArtifactsUrl (runId) {
  return `https://github.com/alphagov/govuk-frontend/actions/runs/${runId}/#artifacts`
}

/**
 * Finds the first issue comment for with the `matcher` function returns `true`
 *
 * @param {function(object):boolean} matcher -- Function evaluated on each comment
 * @param {object} options
 * @param {*} options.github -- Instance of the Github rest API available in script
 * @param {object} options.issueParameters -- REST parameters identifying the issue to find the comment in
 * @returns {object | undefined} -- Found comment or underfined if no comment satisfying the matcher is found
 */
// Based on https://github.com/peter-evans/find-comment/blob/main/src/find.ts
async function findFirstIssueCommentMatching (
  matcher,
  { github, issueParameters }
) {
  for await (const { data: comments } of github.paginate.iterator(
    github.rest.issues.listComments,
    issueParameters
  )) {
    const comment = comments.find(matcher)

    if (comment) return comment
  }
}
