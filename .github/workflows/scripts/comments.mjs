import { readFile } from 'node:fs/promises'
import { basename, parse } from 'path'

import { getReadableFileSizes } from '@govuk-frontend/lib/files'
import { outdent } from 'outdent'

/**
 * Posts the content of multiple diffs in parallel on the given GitHub issue
 *
 * @param {GithubActionContext} githubActionContext
 * @param {number} issueNumber
 * @param {DiffComment[]} diffs
 */
export async function commentDiffs(githubActionContext, issueNumber, diffs) {
  const errors = []

  // Run comments in order, but prevent errors stopping other comments
  for (const diff of diffs) {
    try {
      await commentDiff(githubActionContext, issueNumber, diff)
    } catch (error) {
      const filename = basename(diff.path)

      // Defer errors until all comments are attempted
      errors.push(
        new Error(`Failed to post GitHub comment for ${filename}`, {
          cause: error
        })
      )
    }
  }

  // Throw on any deferred errors above
  if (errors.length) {
    throw new Error('Failed to post GitHub comments', {
      cause: errors
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
 * @param {FileSize[]} fileSizeData
 * @param {FileSize[]} modulesData
 * @param {GithubActionContext} githubActionContext
 * @param {number} issueNumber
 * @param {DiffComment} statComment
 */
export async function commentStats(
  fileSizeData,
  modulesData,
  githubActionContext,
  issueNumber,
  { titleText, markerText }
) {
  const reviewAppURL = getReviewAppUrl(issueNumber)
  let bodyText = ''
  let fileSizeText = ''
  let modulesText = ''

  if (!fileSizeData.length && !modulesData.length) {
    bodyText = 'No changes to any file sizes!'
  } else {
    if (fileSizeData.length) {
      // File sizes
      const fileSizeTitle = '### File sizes'
      const fileSizeRows = (await getReadableFileSizes(fileSizeData)).map(
        (fileSize) => Object.values(fileSize)
      )

      const fileSizeHeaders = ['File', 'Size', 'Percentage change']
      const fileSizeTable = renderTable(fileSizeHeaders, fileSizeRows)
      fileSizeText = [fileSizeTitle, fileSizeTable].join('\n')
    } else {
      fileSizeText = 'No changes to asset file sizes.'
    }

    if (modulesData.length) {
      // Module sizes
      const modulesTitle = '### Modules'
      // Create an empty array to pass to the reducer so that jsdoc doesn't thing
      // that the default accumulator value is `never[]`
      /** @type {Array<Array<string|number>>} */
      const modulesRowsEmpty = []
      const modulesRows = (await getReadableFileSizes(modulesData)).reduce(
        (accumulator, module) => {
          const { base, dir, name } = parse(module.path)
          const statsPath = `docs/stats/${dir}/${name}.html`
          const statsURL = new URL(statsPath, reviewAppURL)
          const moduleLink = `[${base}](${statsURL})`
          const rowAlreadyExists = accumulator?.find(
            (row) => row[0] === moduleLink
          )

          if (rowAlreadyExists) {
            const existingRowIndex = accumulator.findIndex(
              (row) => row === rowAlreadyExists
            )

            if (module.type === 'bundled') {
              accumulator[existingRowIndex].splice(1, 0, module.size)
              accumulator[existingRowIndex].splice(2, 0, module.percentage)
            } else {
              accumulator[existingRowIndex].push(module.size)
              accumulator[existingRowIndex].push(module.percentage)
            }
          } else {
            accumulator.push([moduleLink, module.size, module.percentage])
          }

          return accumulator
        },
        modulesRowsEmpty
      )

      const modulesHeaders = [
        'File',
        'Size (bundled)',
        'Percentage change (bundled)',
        'Size (minified)',
        'Percentage change (bundled)'
      ]
      const modulesTable = renderTable(modulesHeaders, modulesRows)
      const modulesFooter = `[View stats and visualisations on the review app](${reviewAppURL})`
      modulesText = [modulesTitle, modulesTable, modulesFooter].join('\n')
    } else {
      modulesText = 'No changes to module sizes.'
    }

    bodyText = [fileSizeText, modulesText].join('\n')
  }

  await comment(githubActionContext, issueNumber, {
    markerText,
    titleText,
    bodyText
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
    <!-- ${markerText} -->
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
 * @import {RestEndpointMethodTypes} from '@octokit/plugin-rest-endpoint-methods'
 * @typedef {RestEndpointMethodTypes["issues"]} IssuesEndpoint
 * @typedef {IssuesEndpoint["listComments"]["parameters"]} IssueCommentsListParams
 * @typedef {IssuesEndpoint["getComment"]["response"]["data"]} IssueCommentData
 */

/**
 * @import {FileSize} from '@govuk-frontend/stats'
 */
