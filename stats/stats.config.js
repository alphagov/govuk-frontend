/**
 * Lists the files to analyse in a `name` => `options` map,
 * where `options` is an array that contains:
 *
 * 1. the path to import (mandatory)
 * 2. the name of the import (optional, if missing will consider that you're trying to import `default`)
 *
 * @type {Object<string,Array<string>>}
 */
module.exports = {
  all: ['all.mjs', '*'],
  'all-accordion': ['all.mjs', '{Accordion}'],
  'component-accordion': ['components/accordion/accordion.mjs']
}
