import { compileSassStringLikeUsers } from './helpers/sass.js'

it('exposes the expected API', async () => {
  const sass = await compileSassStringLikeUsers(`
    @use "sass:map";
    @use "sass:meta";
    @use "node_modules/govuk-frontend/src/govuk" as govuk-frontend;

    /* START API */

    :root {
      --functions: #{map.keys(meta.module-functions("govuk-frontend"))};
      --mixins: #{map.keys(meta.module-mixins("govuk-frontend"))};
      --variables: #{map.keys(meta.module-variables("govuk-frontend"))};
    }
    `)

  const api = sass.split('/* START API */')[1]
  expect(api).toMatchSnapshot()
})
