import { readFile } from 'node:fs/promises'
import { basename, join } from 'path'

import { getFileSizes } from '@govuk-frontend/lib/files'
import { getStats, modulePaths } from '@govuk-frontend/stats'
import { outdent } from 'outdent'

/**
 * Posts the content of multiple diffs in parallel on the given GitHub issue
 *
 * @param {GithubActionContext} githubActionContext
 * @param {number} issueNumber
 * @param {DiffComment[]} diffs
 */
export async function commentDiffs(githubActionContext, issueNumber, diffs) {
  // Run the comments in parallel to avoid that an early one failing prevents the others
  // and use `allSettled` to avoid the promise rejecting on the first failure but wait
  // for everything to complete
  const results = await Promise.allSettled(
    diffs.map((diff) => commentDiff(githubActionContext, issueNumber, diff))
  )

  if (results.some((result) => result.status === 'rejected')) {
    throw new Error('Posting diff comment failed', {
      cause: results
    })
  }
}

/**
 * Posts the content of a diff as a comment on a GitHub issue
 *
 * @param {GithubActionContext} githubActionContext
 * @param {number} issueNumber
 * @param {DiffComment} diffComment
 */
export async function commentDiff(
  githubActionContext,
  issueNumber,
  { path, titleText, markerText, skipEmpty }
) {
  // Read diff from previous step
  const diffText = await readFile(path, 'utf8')

  // Skip or delete comment for empty diff
  if (!diffText && skipEmpty) {
    console.log(`Skipping GitHub comment for ${basename(path)}`)
    await deleteComment(githubActionContext, issueNumber, markerText)
    return
  }

  // Add or update comment on PR
  try {
    await comment(githubActionContext, issueNumber, {
      markerText,
      titleText,

      // Add a little note if the diff is empty
      bodyText: diffText
        ? `\`\`\`diff\n${diffText}\n\`\`\``
        : 'No diff changes found.'
    })
  } catch {
    await comment(githubActionContext, issueNumber, {
      markerText,
      titleText,

      // Unfortunately the best we can do here is a link to the "Artifacts"
      // section as [the upload-artifact action doesn't provide the public
      // URL](https://github.com/actions/upload-artifact/issues/50) :'(
      bodyText: `The diff could not be posted as a comment. You can download it from the [workflow artifacts](${githubActionRunUrl(
        githubActionContext.context
      )}#artifacts).`
    })
  }
}

/**
 * Generates comment for stats
 *
 * @param {GithubActionContext} githubActionContext
 * @param {number} issueNumber
 * @param {DiffComment} statComment
 */
export async function commentStats(
  githubActionContext,
  issueNumber,
  { path, titleText, markerText }
) {
  const reviewAppURL = getReviewAppUrl(issueNumber)

  const distPath = join(path, 'dist')
  const packagePath = join(path, 'packages/govuk-frontend/dist/govuk')

  // File sizes
  const fileSizeTitle = '### File sizes'
  const fileSizeRows = [
    ...(await getFileSizes(join(distPath, '**/*.{css,js,mjs}'))),
    ...(await getFileSizes(join(packagePath, '*.{css,js,mjs}')))
  ]

  const fileSizeHeaders = ['File', 'Size']
  const fileSizeTable = renderTable(fileSizeHeaders, fileSizeRows)
  const fileSizeText = [fileSizeTitle, fileSizeTable].join('\n')

  // Module sizes
  const modulesTitle = '### Modules'
  const modulesRows = (await Promise.all(modulePaths.map(getStats))).map(
    ([modulePath, moduleSize]) => {
      const statsPath = `docs/stats/${modulePath.replace('mjs', 'html')}`
      const statsURL = new URL(statsPath, reviewAppURL)

      return [`[${modulePath}](${statsURL})`, moduleSize]
    }
  )

  const modulesHeaders = ['File', 'Size']
  const modulesTable = renderTable(modulesHeaders, modulesRows)
  const modulesFooter = `[View stats and visualisations on the review app](${reviewAppURL})`
  const modulesText = [modulesTitle, modulesTable, modulesFooter].join('\n')

  await comment(githubActionContext, issueNumber, {
    markerText,
    titleText,
    bodyText: [fileSizeText, modulesText].join('\n')
  })
}

/**
 * @param {GithubActionContext} githubActionContext - GitHub Action context
 * @param {number} issueNumber - The number of the issue/PR on which to post the comment
 * @param {Comment} comment
 */
export async function comment(
  { github, context, commit },
  issueNumber,
  { titleText, markerText, bodyText }
) {
  const { issues } = github.rest

  /**
   * GitHub issue REST API parameters
   *
   * @satisfies {IssueCommentsListParams}
   */
  const parameters = {
    issue_number: issueNumber,
    owner: context.repo.owner,
    repo: context.repo.repo
  }

  /**
   * GitHub issue comment body
   */
  const body = outdent`
    ${markerText}
    ## ${titleText}

    ${bodyText}

    ---
    ${renderCommentFooter({ context, commit })}
  `

  /**
   * Find GitHub issue comment with marker `<!-- Example -->`
   */
  const comment = await getComment({ github, context }, issueNumber, markerText)

  /**
   * Update GitHub issue comment (or create new)
   */
  await (comment?.id
    ? issues.updateComment({ ...parameters, body, comment_id: comment.id })
    : issues.createComment({ ...parameters, body }))
}

/**
 * @param {Pick<GithubActionContext, "context" | "commit">} githubActionContext
 * @returns {string} - The content for the footer
 */
function renderCommentFooter({ context, commit }) {
  return `[Action run](${githubActionRunUrl(context)}) for ${commit}`
}

/**
 * Renders a GitHub Markdown table.
 *
 * @param {string[]} headers - An array containing the table headers.
 * @param {string[][]} rows - An array of arrays containing the row data for the table.
 * @returns {string} The GitHub Markdown table as a string.
 */
function renderTable(headers, rows) {
  if (!rows.every((row) => row.length === headers.length)) {
    throw new Error(
      'All rows must have the same number of elements as the headers.'
    )
  }

  /**
   * @example
   * ```md
   * | File | Size |
   * ```
   */
  const headerRow = `| ${headers.join(' | ')} |`

  /**
   * @example
   * ```md
   * | --- | --- |
   * ```
   */
  const headerSeparator = `| ${Array(headers.length).fill('---').join(' | ')} |`

  /**
   * @example
   * ```md
   * | packages/govuk-frontend/dist/example.mjs | 100 KiB |
   * ```
   */
  const rowStrings = rows.map((row) => `| ${row.join(' | ')} |`)

  // Combine headers, header separator, and rows to form the table
  return `${[headerRow, headerSeparator, ...rowStrings].join('\n')}\n`
}

/**
 * Generates a URL to the GitHub action run
 *
 * @param {import('@actions/github').context} context - The context of the GitHub action
 * @returns {string} The URL to the "Artifacts" section of the given run
 */
function githubActionRunUrl(context) {
  const { runId, repo } = context

  return `https://github.com/${repo.owner}/${repo.repo}/actions/runs/${runId}/attempts/${process.env.GITHUB_RUN_ATTEMPT}`
}

/**
 * Delete GitHub issue comment with marker `<!-- Example -->`
 *
 * @param {Pick<GithubActionContext, "github" | "context">} githubActionContext
 * @param {number} issueNumber
 * @param {Comment["markerText"]} markerText
 */
export async function deleteComment(
  { github, context },
  issueNumber,
  markerText
) {
  const { issues } = github.rest

  // Find first match for marker
  const comment = await getComment({ github, context }, issueNumber, markerText)

  // Delete comment
  if (comment) {
    await issues.deleteComment({
      issue_number: issueNumber,
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: comment.id
    })
  }
}

/**
 * Find GitHub issue comment with marker `<!-- Example -->`
 *
 * @param {Pick<GithubActionContext, "github" | "context">} githubActionContext
 * @param {number} issueNumber
 * @param {Comment["markerText"]} markerText
 * @returns {Promise<IssueCommentData | undefined>} GitHub comment
 */
export async function getComment({ github, context }, issueNumber, markerText) {
  const { issues } = github.rest

  // Find all GitHub issue comments
  const comments = await github.paginate(issues.listComments, {
    issue_number: issueNumber,
    owner: context.repo.owner,
    repo: context.repo.repo
  })

  // Find first match for marker
  return comments.find(({ body }) => !!body?.includes(markerText))
}

/**
 * @param {number} prNumber - The PR number
 * @param {string} path - URL path
 * @returns {URL} - The Review App preview URL
 */
function getReviewAppUrl(prNumber, path = '/') {
  return new URL(path, `https://govuk-frontend-pr-${prNumber}.herokuapp.com`)
}

/**
 * @typedef {object} GithubActionContext
 * @property {import('@octokit/rest').Octokit} github - The pre-authenticated Octokit provided by GitHub actions
 * @property {import('@actions/github').context} context - The context of the GitHub action
 * @property {string} commit - The SHA of the commit that triggered the action
 */

/**
 * @typedef {object} Comment
 * @property {string} markerText - The marker to identify the comment
 * @property {string} titleText - The title of the comment
 * @property {string} bodyText - The body of the comment
 */

/**
 * @typedef {object} DiffComment
 * @property {string} markerText - The marker to identify the comment
 * @property {string} titleText - The title of the comment
 * @property {string} path - The path of the file to post as a comment
 * @property {boolean} [skipEmpty] - Whether to skip PR comments for empty diffs
 */

/**
 * @typedef {import('@octokit/plugin-rest-endpoint-methods').RestEndpointMethodTypes["issues"]} IssuesEndpoint
 * @typedef {IssuesEndpoint["listComments"]["parameters"]} IssueCommentsListParams
 * @typedef {IssuesEndpoint["getComment"]["response"]["data"]} IssueCommentData
 */
