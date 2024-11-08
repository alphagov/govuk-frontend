import commonConfig from './../../shared/config/eslint/common.mjs';
import govukFrontendConfig from './../../shared/config/eslint/govuk-frontend-config.mjs';

export default [
  ...commonConfig,
  ...govukFrontendConfig,
]