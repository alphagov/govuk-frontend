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
   */
  $wrapper

  /**
   * @private
   */
  $button

  /**
   * @private
   */
  $status

  /**
   * @private
   * @type {FileUploadConfig}
   */
  // eslint-disable-next-line
  // @ts-ignore
  config

  /** @private */
  i18n

  /**
   * @param {Element | null} $root - File input element
   * @param {FileUploadConfig} [config] - File Upload config
   */
  constructor($root, config = {}) {
    super($root)

    if (!(this.$root instanceof HTMLInputElement)) {
      return
    }

    if (this.$root.type !== 'file') {
      throw new ElementError(
        'File upload: Form field must be an input of type `file`.'
      )
    }

    this.config = mergeConfigs(
      FileUpload.defaults,
      config,
      normaliseDataset(FileUpload, this.$root.dataset)
    )

    this.i18n = new I18n(this.config.i18n, {
      // Read the fallback if necessary rather than have it set in the defaults
      locale: closestAttributeValue(this.$root, 'lang')
    })

    this.$label = document.querySelector(`[for="${this.$root.id}"]`)

    if (!this.$label) {
      throw new ElementError({
        component: FileUpload,
        identifier: 'No label'
      })
    }

    // Wrapping element. This defines the boundaries of our drag and drop area.
    const $wrapper = document.createElement('div')
    $wrapper.className = 'govuk-file-upload-wrapper'

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
    this.$root.insertAdjacentElement('afterend', $wrapper)

    // Move the native file input to inside of the wrapper
    $wrapper.insertAdjacentElement('afterbegin', this.$root)

    // Make all these new variables available to the module
    this.$wrapper = $wrapper
    this.$button = $button
    this.$status = $status

    // Prevent the hidden input being tabbed to by keyboard users
    this.$root.setAttribute('tabindex', '-1')

    // Syncronise the `disabled` state between the button and underlying input
    this.updateDisabledState()
    this.observeDisabledState()

    // Bind change event to the underlying input
    this.$root.addEventListener('change', this.onChange.bind(this))
    this.$wrapper.addEventListener('dragover', this.onDragOver.bind(this))
    this.$wrapper.addEventListener(
      'dragleave',
      this.onDragLeaveOrDrop.bind(this)
    )
    this.$wrapper.addEventListener('drop', this.onDragLeaveOrDrop.bind(this))
  }

  /**
   * Check if the value of the underlying input has changed
   */
  onChange() {
    if (!('files' in this.$root)) {
      return
    }

    if (!this.$root.files) {
      return
    }

    // eslint-disable-next-line
    // @ts-ignore
    const fileCount = this.$root.files.length // eslint-disable-line

    // trying to appease typescript
    if (!this.$status || !this.i18n) {
      return
    }

    if (fileCount === 0) {
      // If there are no files, show the default selection text
      this.$status.innerText = this.i18n.t('filesSelectedDefault')
    } else if (
      // If there is 1 file, just show the file name
      fileCount === 1
    ) {
      // eslint-disable-next-line
      // @ts-ignore
      this.$status.innerText = this.$root.files[0].name // eslint-disable-line
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
    // eslint-disable-next-line
    // @ts-ignore
    this.$wrapper.classList.add('govuk-file-upload-wrapper--show-dropzone')
  }

  /**
   * When a dragged file leaves the container, or the file is dropped,
   * remove the visual indicator.
   */
  onDragLeaveOrDrop() {
    // eslint-disable-next-line
    // @ts-ignore
    this.$wrapper.classList.remove('govuk-file-upload-wrapper--show-dropzone')
  }

  /**
   * Create a mutation observer to check if the input's attributes altered.
   */
  observeDisabledState() {
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        console.log('mutation', mutation)
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'disabled'
        ) {
          this.updateDisabledState()
        }
      }
    })

    observer.observe(this.$root, {
      attributes: true
    })
  }

  /**
   * Synchronise the `disabled` state between the input and replacement button.
   */
  updateDisabledState() {
    if (
      !(this.$root instanceof HTMLInputElement) ||
      !(this.$button instanceof HTMLButtonElement)
    ) {
      return
    }

    this.$button.disabled = this.$root.disabled
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
   * @satisfies {Schema}
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
 * @typedef {import('../../common/configuration.mjs').Schema} Schema
 * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
 */
