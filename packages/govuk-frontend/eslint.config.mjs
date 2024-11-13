import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { commonConfig, govukFrontendConfig } from '@govuk-frontend/eslint-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...commonConfig,
  ...govukFrontendConfig(__dirname),
]
