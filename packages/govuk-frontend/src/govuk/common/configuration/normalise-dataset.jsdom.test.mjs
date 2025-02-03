import {
  ConfigurableComponent,
  normaliseDataset
} from '../../common/configuration.mjs'

describe('normaliseDataset', () => {
  it('normalises the entire dataset', () => {
    expect(
      normaliseDataset(
        /**
         * @augments ConfigurableComponent<Config>
         */
        class Component extends ConfigurableComponent {
          static moduleName = 'Component'

          /**
           * @satisfies {Schema<Config>}
           */
          static schema = {
            properties: {
              aNumber: { type: 'number' },
              aDecimalNumber: { type: 'number' },
              aBoolean: { type: 'boolean' },
              aString: { type: 'string' },
              aStringBoolean: { type: 'string' },
              aStringNumber: { type: 'string' },
              anOptionalString: { type: 'string' },
              anObject: { type: 'object' }
            }
          }
        },
        {
          aNumber: '1000',
          aDecimalNumber: '100.50',
          aBoolean: 'true',
          aString: 'Hello!',
          aStringBoolean: 'false',
          aStringNumber: '2024',
          anOptionalString: '',
          'anObject.one': '111',
          'anObject.two': '222',
          'anObject.three': '333'
        }
      )
    ).toEqual({
      aNumber: 1000,
      aDecimalNumber: 100.5,
      aBoolean: true,
      aString: 'Hello!',
      aStringBoolean: 'false',
      aStringNumber: '2024',
      anOptionalString: '',
      anObject: {
        one: 111,
        two: 222,
        three: 333
      }
    })
  })
})

/**
 * @typedef {object} Config
 * @property {number} aNumber - A number
 * @property {number} aDecimalNumber - A decimal number
 * @property {boolean} aBoolean - A boolean
 * @property {string} aString - A string
 * @property {'true' | 'false'} aStringBoolean - A string boolean
 * @property {string} aStringNumber - A string number
 * @property {string} [anOptionalString] - An optional string
 * @property {{ one: string, two: string, three: string }} anObject - An object
 */

/**
 * @import { Schema } from '../configuration.mjs'
 */
