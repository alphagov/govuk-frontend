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

    if (!this.$root.id.length) {
      throw new ElementError(
        formatErrorMessage(FileUpload, 'Form field must specify an `id`.')
      )
    }

    this.id = this.$root.id

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
    $button.classList.add('govuk-file-upload__button')
    $button.type = 'button'

    const buttonSpan = document.createElement('span')
    buttonSpan.className =
      'govuk-button govuk-button--secondary govuk-file-upload__pseudo-button'
    buttonSpan.innerText = this.i18n.t('selectFilesButton')

    $button.appendChild(buttonSpan)
    $button.addEventListener('click', this.onClick.bind(this))

    // Create status element that shows what/how many files are selected
    const $status = document.createElement('span')
    $status.className = 'govuk-body govuk-file-upload__status'
    $status.innerText = this.i18n.t('filesSelectedDefault')
    // $status.setAttribute('aria-hidden', 'true')

    $button.appendChild($status)

    // Assemble these all together
    $wrapper.insertAdjacentElement('beforeend', $button)
    // $wrapper.insertAdjacentElement('beforeend', $status)

    // Inject all this *after* the native file input
    this.$root.insertAdjacentElement('afterend', $wrapper)

    this.$root.setAttribute('tabindex', '-1')
    this.$root.setAttribute('aria-hidden', 'true')

    // Move the native file input to inside of the wrapper
    $wrapper.insertAdjacentElement('afterbegin', this.$root)

    // Make all these new variables available to the module
    this.$wrapper = $wrapper
    this.$button = $button
    this.$status = $status

    // Bind change event to the underlying input
    this.$root.addEventListener('change', this.onChange.bind(this))

    // Syncronise the `disabled` state between the button and underlying input
    this.updateDisabledState()
    this.observeDisabledState()

    // Bind change event to the underlying input
    this.$root.addEventListener('change', this.onChange.bind(this))

    // Handle drop zone visibility
    // A live region to announce when users enter or leave the drop zone
    this.$announcements = document.createElement('span')
    this.$announcements.classList.add('govuk-file-upload-announcements')
    this.$announcements.classList.add('govuk-visually-hidden')
    this.$announcements.setAttribute('aria-live', 'assertive')
    this.$wrapper.insertAdjacentElement('afterend', this.$announcements)

    // The easy bit, when dropping hide the dropzone
    //
    // Note: the component relies on the native behaviour to get the files
    // being dragged set as value of the `<input>`. This allows a `change`
    // event to be automatically fired from the element and saves us from having
    // to do anything more than hiding the dropzone on drop.
    this.$wrapper.addEventListener('drop', this.hideDropZone.bind(this))

    // While user is dragging, it gets a little more complex because of Safari.
    // Safari doesn't fill `relatedTarget` on `dragleave` (nor `dragenter`).
    // This means we can't use `relatedTarget` to:
    // - check if the user is still within the wrapper
    //   (`relatedTarget` being a descendant of the wrapper)
    // - check if the user is still over the viewport
    //   (`relatedTarget` being null if outside)

    // Thanks to `dragenter` bubbling, we can listen on the `document` with a
    // single function and update the visibility based on whether we entered a
    // node inside or outside the wrapper.
    document.addEventListener(
      'dragenter',
      this.updateDropzoneVisibility.bind(this)
    )

    // To detect if we're outside the document, we can track if there was a
    // `dragenter` event preceding a `dragleave`. If there wasn't, this means
    // we're outside the document.
    //
    // The order of events is guaranteed by the HTML specs:
    // https://html.spec.whatwg.org/multipage/dnd.html#drag-and-drop-processing-model
    document.addEventListener('dragenter', () => {
      this.enteredAnotherElement = true
    })

    document.addEventListener('dragleave', () => {
      if (!this.enteredAnotherElement) {
        this.hideDropZone()
      }

      this.enteredAnotherElement = false
    })
  }

  /**
   * Updates the visibility of the dropzone as users enters the various elements on the page
   *
   * @param {DragEvent} event - The `dragenter` event
   */
  updateDropzoneVisibility(event) {
    // DOM interfaces only type `event.target` as `EventTarget`
    // so we first need to make sure it's a `Node`
    if (event.target instanceof Node) {
      if (this.$wrapper.contains(event.target)) {
        if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
          // Only update the class and make the announcement if not already visible
          // to avoid repeated announcements on NVDA (2024.4) + Firefox (133)
          if (
            !this.$wrapper.classList.contains(
              'govuk-file-upload-wrapper--show-dropzone'
            )
          ) {
            this.$wrapper.classList.add(
              'govuk-file-upload-wrapper--show-dropzone'
            )
            this.$announcements.innerText = this.i18n.t('dropZoneEntered')
          }
        }
      } else {
        // Only hide the dropzone if it is visible to prevent announcing user
        // left the drop zone when they enter the page but haven't reached yet
        // the file upload component
        if (
          this.$wrapper.classList.contains(
            'govuk-file-upload-wrapper--show-dropzone'
          )
        ) {
          this.hideDropZone()
        }
      }
    }
  }

  /**
   * Hides the dropzone once user has dropped files on the `<input>`
   */
  hideDropZone() {
    this.$wrapper.classList.remove('govuk-file-upload-wrapper--show-dropzone')
    this.$announcements.innerText = this.i18n.t('dropZoneLeft')
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
      },
      dropZoneEntered: 'Entered drop zone',
      dropZoneLeft: 'Left drop zone'
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
 * @property {string} [dropZoneEntered] - Text announced to assistive technology
 *   when users entered the drop zone while dragging
 * @property {string} [dropZoneLeft] - Text announced to assistive technology
 *   when users left the drop zone while dragging
 */

/**
 * @typedef {import('../../common/configuration.mjs').Schema} Schema
 * @typedef {import('../../i18n.mjs').TranslationPluralForms} TranslationPluralForms
 */
