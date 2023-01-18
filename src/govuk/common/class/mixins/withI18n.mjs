import { I18n } from '../../../i18n.mjs'
import { closestAttributeValue } from '../../closest-attribute-value.mjs'

/**
 * Creates a class with I18n support
 */
export function withI18n (SuperClass) {
  /**
   * A class with i18n support
   */
  return class extends SuperClass {
    constructor (...args) {
      super(...args)

      this.i18n = new I18n(this.config.byNamespace('i18n'), {
      // Read the fallback if necessary rather than have it set in the defaults
        locale: closestAttributeValue(this.$module, 'lang')
      })
    }
  }
}
