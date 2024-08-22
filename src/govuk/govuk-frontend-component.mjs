import { isSupported } from './common/index.mjs'
import { SupportError } from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @internal
 * @virtual
 */
export class GOVUKFrontendComponent {
  /**
   * Constructs a new component, validating that GOV.UK Frontend is supported
   *
   * @internal
   */
  constructor() {
    this.checkSupport()
  }

  /**
   * Validates whether GOV.UK Frontend is supported
   *
   * @private
   * @throws {SupportError} when GOV.UK Frontend is not supported
   */
  checkSupport() {
    if (!isSupported()) {
      throw new SupportError()
    }
  }
}
