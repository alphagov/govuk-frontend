import { closestAttributeValue } from '../../common/closest-attribute-value.mjs'
import { mergeConfigs, normaliseDataset } from '../../common/configuration.mjs'
import { ElementError } from '../../errors/index.mjs'
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs'
import { I18n } from '../../i18n.mjs'

/**
 * File upload component
 *
 * @preserve
 */
export class FileUpload extends GOVUKFrontendComponent {
  /**
   * @private
   * @type {HTMLInputElement}
   */
  $input

  /**
   * @private
   * @type {HTMLElement}
   */
  $wrapper

  /**
   * @private
   * @type {HTMLButtonElement}
   */
  $button

  /**
   * @private
   * @type {HTMLElement}
   */
  $status

  /**
   * @private
   * @type {FileUploadConfig}
   */
  config

  /** @private */
  i18n

  /**
   * @param {Element | null} $input - File input element
   * @param {FileUploadConfig} [config] - File Upload config
   */
  constructor($input, config = {}) {
    super($input)

    if (!($input instanceof HTMLInputElement)) {
      throw new ElementError({
        component: FileUpload,
        element: $input,
        expectedType: 'HTMLInputElement',
        identifier: 'Root element (`$module`)'
      })
    }

    if ($input.type !== 'file') {
      throw new ElementError('File upload: Form field must be of type `file`.')
    }

    this.config = mergeConfigs(
      FileUpload.defaults,
      config,
      normaliseDataset(FileUpload, $input.dataset)
    )

    this.i18n = new I18n(this.config.i18n, {
      // Read the fallback if necessary rather than have it set in the defaults
      locale: closestAttributeValue($input, 'lang')
    })

    this.$label = document.querySelector(`[for="${$input.id}"]`)

    if (!this.$label) {
      throw new ElementError({
        componentName: 'File upload',
        identifier: 'No label'
      })
    }

    $input.addEventListener('change', this.onChange.bind(this))
    this.$input = $input

    // Wrapping element. This defines the boundaries of our drag and drop area.
    const $wrapper = document.createElement('div')
    $wrapper.className = 'govuk-file-upload-wrapper'
    $wrapper.addEventListener('dragover', this.onDragOver.bind(this))
    $wrapper.addEventListener('dragleave', this.onDragLeaveOrDrop.bind(this))
    $wrapper.addEventListener('drop', this.onDragLeaveOrDrop.bind(this))

    // Create the file selection button
    const $button = document.createElement('button')
    $button.className =
      'govuk-button govuk-button--secondary govuk-file-upload__button'
    $button.type = 'button'
    $button.innerText = this.i18n.t('selectFilesButton')
    $button.addEventListener('click', this.onClick.bind(this))

    // Create status element that shows what/how many files are selected
    const $status = document.createElement('span')
    $status.className = 'govuk-body govuk-file-upload__status'
    $status.innerText = this.i18n.t('filesSelectedDefault')
    $status.setAttribute('role', 'status')

    // Assemble these all together
    $wrapper.insertAdjacentElement('beforeend', $button)
    $wrapper.insertAdjacentElement('beforeend', $status)

    // Inject all this *after* the native file input
    this.$input.insertAdjacentElement('afterend', $wrapper)

    // Move the native file input to inside of the wrapper
    $wrapper.insertAdjacentElement('afterbegin', this.$input)

    // Make all these new variables available to the module
    this.$wrapper = $wrapper
    this.$button = $button
    this.$status = $status

    // Bind change event to the underlying input
    this.$input.addEventListener('change', this.onChange.bind(this))
  }

  /**
   * Check if the value of the underlying input has changed
   */
  onChange() {
    if (!this.$input.files) {
      return
    }

    const fileCount = this.$input.files.length

    if (fileCount === 0) {
      // If there are no files, show the default selection text
      this.$status.innerText = this.i18n.t('filesSelectedDefault')
    } else if (
      // If there is 1 file, just show the file name
      fileCount === 1
    ) {
      this.$status.innerText = this.$input.files[0].name
    } else {
      // Otherwise, tell the user how many files are selected
      this.$status.innerText = this.i18n.t('filesSelected', {
        count: fileCount
      })
    }
  }

  /**
   * When the button is clicked, emulate clicking the actual, hidden file input
   */
  onClick() {
    if (this.$label instanceof HTMLElement) {
      this.$label.click()
    }
  }

  /**
   * When a file is dragged over the container, show a visual indicator that a
   * file can be dropped here.
   */
  onDragOver() {
    this.$wrapper.classList.add('govuk-file-upload-wrapper--show-dropzone')
  }

  /**
   * When a dragged file leaves the container, or the file is dropped,
   * remove the visual indicator.
   */
  onDragLeaveOrDrop() {
    this.$wrapper.classList.remove('govuk-file-upload-wrapper--show-dropzone')
  }

  /**
   * Name for the component used when initialising using data-module attributes.
   */
  static moduleName = 'govuk-file-upload'

  /**
   * File upload default config
   *
   * @see {@link FileUploadConfig}
   * @constant
   * @type {FileUploadConfig}
   */
  static defaults = Object.freeze({
    i18n: {
      selectFilesButton: 'Choose file',
      filesSelectedDefault: 'No file chosen',
      filesSelected: {
        one: '%{count} file chosen',
        other: '%{count} files chosen'
      }
    }
  })

  /**
   * File upload config schema
   *
   * @constant
   * @satisfies {Schema<FileUploadConfig>}
   */
  static schema = Object.freeze({
    properties: {
      i18n: { type: 'object' }
    }
  })
}

/**
 * File upload config
 *
 * @see {@link FileUpload.defaults}
 * @typedef {object} FileUploadConfig
 * @property {FileUploadTranslations} [i18n=FileUpload.defaults.i18n] - File upload translations
 */

/**
 * File upload translations
 *
 * @see {@link FileUpload.defaults.i18n}
 * @typedef {object} FileUploadTranslations
 *
 * Messages used by the component
 * @property {string} [selectFiles] - Text of button that opens file browser
 * @property {TranslationPluralForms} [filesSelected] - Text indicating how
 *   many files have been selected
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 * @import { TranslationPluralForms } from '../../i18n.mjs'
 */
