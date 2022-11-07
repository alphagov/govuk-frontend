// Implementation of common function is gathered in the `common` folder
// as some are split in their own modules to limit impacts of the polyfills
// they require.
// This module exports the non polyfilled methods as they used to be
// to avoid breaking changes
export * from './common/index.mjs'
