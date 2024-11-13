import { dirname } from 'path';
import { fileURLToPath } from 'url';

import commonConfig from './common.mjs'
import govukFrontendConfig from './govuk-frontend-config.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...commonConfig,
  ...govukFrontendConfig(__dirname),
]
