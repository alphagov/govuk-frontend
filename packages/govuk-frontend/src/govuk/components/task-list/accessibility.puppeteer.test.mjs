import { axe, render } from '@govuk-frontend/helpers/puppeteer'
import { getExamples } from '@govuk-frontend/lib/components'

describe('/components/task-list', () => {
  describe('component examples', () => {
    it('passes accessibility tests', async () => {
      const examples = await getExamples('task-list')

      for (const exampleName in examples) {
        await render(page, 'task-list', examples[exampleName])
        await expect(axe(page)).resolves.toHaveNoViolations()
      }
    }, 60000)
  })
})
