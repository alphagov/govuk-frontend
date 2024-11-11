import { dirname } from 'path';
import { fileURLToPath } from 'url';

import commonConfig from './shared/config/eslint/common.mjs'
import govukFrontendConfig from './shared/config/eslint/govuk-frontend-config.mjs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...commonConfig,
  ...govukFrontendConfig(__dirname),
]