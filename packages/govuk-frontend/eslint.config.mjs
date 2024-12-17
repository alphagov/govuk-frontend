import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { rootConfig, govukFrontendConfig } from '@govuk-frontend/eslint-config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  ...rootConfig,
  ...govukFrontendConfig(__dirname),
]
