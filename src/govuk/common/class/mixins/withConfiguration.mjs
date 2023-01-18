import Config from '../../config.mjs'

/**
 * Creates a mixin enabling a component to receive a configuration
 * merged between:
 *
 * - a `defaultConfiguration` provided at mixin creation
 * - a `javascriptConfiguration` received at instanciation
 * - a `datasetConfiguration` based on the element's dataset
 *
 * @param {Object<string,any>} defaultConfiguration -- The default configuration that'll be received
 * @returns Function
 */
export function withConfiguration (defaultConfiguration) {
  return function (SuperClass) {
    /**
     * A class mixing the SuperClass with features for receiving the configuration
     */
    return class extends SuperClass {
      /**
       * @type Object<string,string>
       */
      get datasetConfiguration () {
        if (this._normalisedDataset) {
          this._normalisedDataset = Config.normaliseDataset(this.$element.dataset)
        }
        return this._normalisedDataset
      }

      /**
       * @param {HTMLElement} $element
       * @param {Object<string,any>} javascriptConfiguration
       */
      constructor ($element, javascriptConfiguration) {
        super($element)

        this.config = new Config(this.gatherConfigurations(javascriptConfiguration))
      }

      /**
       * @param {Object<string,any>} javascriptConfiguration
       * @returns {Array<Object<string,any>>} A list of the configurations to be merged
       */
      gatherConfigurations (javascriptConfiguration) {
        return [
          defaultConfiguration,
          javascriptConfiguration,
          this.datasetConfiguration
        ]
      }
    }
  }
}
