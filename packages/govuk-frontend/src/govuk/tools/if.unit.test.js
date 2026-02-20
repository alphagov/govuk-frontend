const { compileSassString } = require('@govuk-frontend/helpers/tests')
const { outdent } = require('outdent')

describe('@function govuk-if', () => {
  it('returns `$if-value` if the condition is met', async () => {
    const sass = `
      @import "tools/if";
      :root {
        value: govuk-if(true, 'if-value', 'else-value')
      }
    `
    const { css } = await compileSassString(sass)

    expect(css).toContain(outdent`
      :root {
        value: "if-value";
      }
    `)
  })

  it('returns `$else-value` if the condition is not met', async () => {
    const sass = `
      @import "tools/if";
      :root {
        value: govuk-if(false, 'if-value', 'else-value')
      }
    `
    const { css } = await compileSassString(sass)

    expect(css).toContain(outdent`
      :root {
        value: "else-value";
      }
    `)
  })

  it('defaults `$else-value` to `null`', async () => {
    const sass = `
      @import "tools/if";
      :root {
        value: govuk-if(false, 'if-value')
      }
    `
    const { css } = await compileSassString(sass)

    // `null` will make `:root` empty of any declarations
    // so Sass will not output it
    expect(css).toBe('')
  })
})
