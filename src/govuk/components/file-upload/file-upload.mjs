import { closestAttributeValue } from '../../common/closest-attribute-value.mjs'
import { ConfigurableComponent } from '../../common/configuration.mjs'
import { formatErrorMessage } from '../../common/index.mjs'
import { ElementError } from '../../errors/index.mjs'
import { I18n } from '../../i18n.mjs'

/**
 * File upload component
 *
 * @preserve
 * @augments ConfigurableComponent<FileUploadConfig,HTMLFileInputElement>
 */
export class FileUpload extends ConfigurableComponent {
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

  /** @private */
  i18n

  /**
   * @param {Element | null} $root - File input element
   * @param {FileUploadConfig} [config] - File Upload config
   */
  constructor($root, config = {}) {
    super($root, config)

    if (this.$root.type !== 'file') {
      throw new ElementError(
        formatErrorMessage(
          FileUpload,
          'Form field must be an input of type `file`.'
        )
      )
    }

    this.i18n = new I18n(this.config.i18n, {
      // Read the fallback if necessary rather than have it set in the defaults
      locale: closestAttributeValue(this.$root, 'lang')
    })

    this.$label = this.findLabel()

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

    // Handle drag'n'drop events
    this.$wrapper.addEventListener('drop', this.onDrop.bind(this))

    this.$wrapper.addEventListener('dragenter', this.onDragEnter.bind(this))
    this.$wrapper.addEventListener('dragleave', this.onDragLeave.bind(this))
  }

  /**
   * Handles the users entering the area where they can drop their files
   *
   * Reveals the drop zone if the user components accepts what the user
   * is dragging
   *
   * @param {DragEvent} event - The `dragenter` event
   */
  onDragEnter(event) {
    // TypeScript anticipates that `event.dataTransfer` may be `null`
    // so we need to check for falsiness first
    if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
      this.$wrapper.classList.add('govuk-file-upload-wrapper--show-dropzone')
    }
  }

  /**
   * Hides the drop zone visually when users mouse leave it
   *
   * `dragleave` events will fire for each element that the user moves
   * their move out of. We only want to remove the styling when
   * they either leave the wrapper or the window altogether
   *
   * @param {DragEvent} event - The `dragleave` event
   */
  onDragLeave(event) {
    // `relatedTarget` is only an `EventTarget` so we need to check if it's :
    // - it's a `Node` in which case we'd still be on the page
    // - something else in which case user has left the page
    const relatedTarget =
      event.relatedTarget instanceof Node ? event.relatedTarget : null

    const leavesWindow = !relatedTarget
    const leavesDropZone = !this.$wrapper.contains(relatedTarget)
    if (leavesWindow || leavesDropZone) {
      this.$wrapper.classList.remove('govuk-file-upload-wrapper--show-dropzone')
    }
  }

  /**
   * Hides the dropzone once user has dropped files on the `<input>`
   *
   * Note: the component relies on the native behaviour to get the files
   * being dragged set as value of the `<input>`. This allows a `change`
   * event to be automatically fired from the element.
   */
  onDrop() {
    this.$wrapper.classList.remove('govuk-file-upload-wrapper--show-dropzone')
  }

  /**
   * Check if the value of the underlying input has changed
   */
  onChange() {
    const fileCount = this.$root.files.length

    if (fileCount === 0) {
      // If there are no files, show the default selection text
      this.$status.innerText = this.i18n.t('filesSelectedDefault')
    } else if (
      // If there is 1 file, just show the file name
      fileCount === 1
    ) {
      this.$status.innerText = this.$root.files[0].name
    } else {
      // Otherwise, tell the user how many files are selected
      this.$status.innerText = this.i18n.t('filesSelected', {
        count: fileCount
      })
    }
  }

  /**
   * Looks up the `<label>` element associated to the field
   *
   * @private
   * @returns {HTMLElement} The `<label>` element associated to the field
   * @throws {ElementError} If the `<label>` cannot be found
   */
  findLabel() {
    // Use `label` in the selector so TypeScript knows the type fo `HTMLElement`
    const $label = document.querySelector(`label[for="${this.$root.id}"]`)

    if (!$label) {
      throw new ElementError({
        component: FileUpload,
        identifier: 'No label'
      })
    }

    return $label
  }

  /**
   * When the button is clicked, emulate clicking the actual, hidden file input
   */
  onClick() {
    this.$label.click()
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
        // the 'one' string isn't used as the component displays the filename
        // instead, however it's here for coverage's sake
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
 * Checks if the given `DataTransfer` contains files
 *
 * @internal
 * @param {DataTransfer} dataTransfer - The `DataTransfer` to check
 * @returns {boolean} - `true` if it contains files or we can't infer it, `false` otherwise
 */
function isContainingFiles(dataTransfer) {
  // Safari sometimes does not provide info about types :'(
  // In which case best not to assume anything and try to set the files
  const hasNoTypesInfo = dataTransfer.types.length === 0

  // When dragging images, there's a mix of mime types + Files
  // which we can't assign to the native input
  const isDraggingFiles = dataTransfer.types.some((type) => type === 'Files')

  return hasNoTypesInfo || isDraggingFiles
}

/**
 * @typedef {HTMLInputElement & {files: FileList}} HTMLFileInputElement
 */

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
