import { closestAttributeValue } from '../../common/closest-attribute-value.mjs'
import { ConfigurableComponent } from '../../common/configuration.mjs'
import { formatErrorMessage } from '../../common/index.mjs'
import { ElementError } from '../../errors/index.mjs'
import { I18n } from '../../i18n.mjs'

/**
 * File upload component
 *
 * @preserve
 * @augments ConfigurableComponent<FileUploadConfig>
 */
export class FileUpload extends ConfigurableComponent {
  /**
   * @private
   * @type {HTMLFileInputElement}
   */
  $input

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

    const $input = this.$root.querySelector('input')

    if ($input === null) {
      throw new ElementError({
        component: FileUpload,
        identifier: 'File inputs (`<input type="file">`)'
      })
    }

    if ($input.type !== 'file') {
      throw new ElementError(
        formatErrorMessage(
          FileUpload,
          'File input (`<input type="file">`) attribute (`type`) is not `file`'
        )
      )
    }

    this.$input = /** @type {HTMLFileInputElement} */ ($input)
    this.$input.setAttribute('hidden', 'true')

    const fieldId = this.$input.id
    if (!fieldId) {
      throw new ElementError({
        component: FileUpload,
        identifier: 'File input (`<input type="file">`) attribute (`id`)'
      })
    }

    this.i18n = new I18n(this.config.i18n, {
      // Read the fallback if necessary rather than have it set in the defaults
      locale: closestAttributeValue(this.$root, 'lang')
    })

    const $label = this.findLabel(fieldId)
    // Add an ID to the label if it doesn't have one already
    // so it can be referenced by `aria-labelledby`
    if (!$label.id) {
      $label.id = `${fieldId}-label`
    }

    // we need to copy the 'id' of the root element
    // to the new button replacement element
    // so that focus will work in the error summary
    this.$input.id = `${fieldId}-input`

    // Create the file selection button
    const $button = document.createElement('button')
    $button.classList.add('govuk-file-upload-button')
    $button.type = 'button'
    $button.id = fieldId
    $button.classList.add('govuk-file-upload-button--empty')

    // Copy `aria-describedby` if present so hints and errors
    // are associated to the `<button>`
    const ariaDescribedBy = this.$input.getAttribute('aria-describedby')
    if (ariaDescribedBy) {
      $button.setAttribute('aria-describedby', ariaDescribedBy)
    }

    // Create status element that shows what/how many files are selected
    const $status = document.createElement('span')
    $status.className = 'govuk-body govuk-file-upload-button__status'
    $status.setAttribute('aria-live', 'polite')
    $status.innerText = this.i18n.t('noFileChosen')

    $button.appendChild($status)

    const commaSpan = document.createElement('span')
    commaSpan.className = 'govuk-visually-hidden'
    commaSpan.innerText = ', '
    commaSpan.id = `${fieldId}-comma`

    $button.appendChild(commaSpan)

    const containerSpan = document.createElement('span')
    containerSpan.className =
      'govuk-file-upload-button__pseudo-button-container'

    const buttonSpan = document.createElement('span')
    buttonSpan.className =
      'govuk-button govuk-button--secondary govuk-file-upload-button__pseudo-button'
    buttonSpan.innerText = this.i18n.t('chooseFilesButton')

    containerSpan.appendChild(buttonSpan)

    // Add a space so the button and instruction read correctly
    // when CSS is disabled
    containerSpan.insertAdjacentText('beforeend', ' ')

    const instructionSpan = document.createElement('span')
    instructionSpan.className =
      'govuk-body govuk-file-upload-button__instruction'
    instructionSpan.innerText = this.i18n.t('dropInstruction')

    containerSpan.appendChild(instructionSpan)

    $button.appendChild(containerSpan)
    $button.setAttribute(
      'aria-labelledby',
      `${$label.id} ${commaSpan.id} ${$button.id}`
    )
    $button.addEventListener('click', this.onClick.bind(this))
    $button.addEventListener('dragover', (event) => {
      // prevent default to allow drop
      event.preventDefault()
    })

    // Assemble these all together
    this.$root.insertAdjacentElement('afterbegin', $button)

    // Make all these new variables available to the module
    this.$button = $button
    this.$status = $status

    // Bind change event to the underlying input
    this.$input.addEventListener('change', this.onChange.bind(this))

    // Synchronise the `disabled` state between the button and underlying input
    this.updateDisabledState()
    this.observeDisabledState()

    // Handle drop zone visibility
    // A live region to announce when users enter or leave the drop zone
    this.$announcements = document.createElement('span')
    this.$announcements.classList.add('govuk-file-upload-announcements')
    this.$announcements.classList.add('govuk-visually-hidden')
    this.$announcements.setAttribute('aria-live', 'assertive')
    this.$root.insertAdjacentElement('afterend', this.$announcements)

    // if there is no CSS and input is hidden
    // button will need to handle drop event
    this.$button.addEventListener('drop', this.onDrop.bind(this))

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
      if (!this.enteredAnotherElement && !this.$button.disabled) {
        this.onDropZoneLeave()
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
    if (this.$button.disabled) return

    // DOM interfaces only type `event.target` as `EventTarget`
    // so we first need to make sure it's a `Node`
    if (event.target instanceof Node) {
      if (this.$root.contains(event.target)) {
        this.onDropZoneEnter(event)
      } else {
        this.onDropZoneLeave()
      }
    }
  }

  /**
   * @returns {boolean} Whether the user is dragging
   */
  get dragging() {
    return this.$button.classList.contains('govuk-file-upload-button--dragging')
  }

  /**
   * @param {boolean} value - Whether the user is dragging
   */
  set dragging(value) {
    this.$button.classList.toggle('govuk-file-upload-button--dragging', value)
  }

  /**
   * Shows the dropzone if user is not already dragging
   *
   * @param {DragEvent} event - The `dragenter` event
   */
  onDropZoneEnter(event) {
    if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
      // Only update the class and make the announcement if not already visible
      // to avoid repeated announcements on NVDA (2024.4) + Firefox (133)
      if (!this.dragging) {
        this.dragging = true
        this.$announcements.innerText = this.i18n.t('enteredDropZone')
      }
    }
  }

  /**
   * Hides the dropzone if the user is already dragging
   */
  onDropZoneLeave() {
    // Only hide the dropzone if it is visible to prevent announcing user
    // left the drop zone when they enter the page but haven't reached yet
    // the file upload component
    if (this.dragging) {
      this.dragging = false
      this.$announcements.innerText = this.i18n.t('leftDropZone')
    }
  }

  /**
   * Handles user dropping on the component
   *
   * @param {DragEvent} event - The `dragenter` event
   */
  onDrop(event) {
    event.preventDefault()

    if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
      this.$input.files = event.dataTransfer.files

      // Dispatch a `change` event so external code that would rely on the `<input>`
      // dispatching an event when files are dropped still work.
      // Use a `CustomEvent` so our events are distinguishable from browser's native events
      this.$input.dispatchEvent(new CustomEvent('change'))

      this.dragging = false
    }
  }

  /**
   * Check if the value of the underlying input has changed
   */
  onChange() {
    const fileCount = this.$input.files.length

    if (fileCount === 0) {
      // If there are no files, show the default selection text
      this.$status.innerText = this.i18n.t('noFileChosen')
      this.$button.classList.add('govuk-file-upload-button--empty')
    } else {
      if (
        // If there is 1 file, just show the file name
        fileCount === 1
      ) {
        this.$status.innerText = this.$input.files[0].name
      } else {
        // Otherwise, tell the user how many files are selected
        this.$status.innerText = this.i18n.t('multipleFilesChosen', {
          count: fileCount
        })
      }

      this.$button.classList.remove('govuk-file-upload-button--empty')
    }
  }

  /**
   * Looks up the `<label>` element associated to the field
   *
   * @private
   * @param {string} fieldId - The `id` of the field
   * @returns {HTMLElement} The `<label>` element associated to the field
   * @throws {ElementError} If the `<label>` cannot be found
   */
  findLabel(fieldId) {
    // Use `label` in the selector so TypeScript knows the type fo `HTMLElement`
    const $label = document.querySelector(`label[for="${fieldId}"]`)

    if (!$label) {
      throw new ElementError({
        component: FileUpload,
        identifier: `Field label (\`<label for=${fieldId}>\`)`
      })
    }

    return $label
  }

  /**
   * When the button is clicked, emulate clicking the actual, hidden file input
   */
  onClick() {
    this.$input.click()
  }

  /**
   * Create a mutation observer to check if the input's attributes altered.
   */
  observeDisabledState() {
    const observer = new MutationObserver((mutationList) => {
      for (const mutation of mutationList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'disabled'
        ) {
          this.updateDisabledState()
        }
      }
    })

    observer.observe(this.$input, {
      attributes: true
    })
  }

  /**
   * Synchronise the `disabled` state between the input and replacement button.
   */
  updateDisabledState() {
    this.$button.disabled = this.$input.disabled

    this.$root.classList.toggle(
      'govuk-drop-zone--disabled',
      this.$button.disabled
    )
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
      chooseFilesButton: 'Choose file',
      dropInstruction: 'or drop file',
      noFileChosen: 'No file chosen',
      multipleFilesChosen: {
        // the 'one' string isn't used as the component displays the filename
        // instead, however it's here for coverage's sake
        one: '%{count} file chosen',
        other: '%{count} files chosen'
      },
      enteredDropZone: 'Entered drop zone',
      leftDropZone: 'Left drop zone'
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
 * @property {string} [chooseFile] - The text of the button that opens the file picker
 * @property {string} [dropInstruction] - The text informing users they can drop files
 * @property {TranslationPluralForms} [multipleFilesChosen] - The text displayed when multiple files
 *   have been chosen by the user
 * @property {string} [noFileChosen] - The text to displayed when no file has been chosen by the user
 * @property {string} [enteredDropZone] - The text announced by assistive technology
 *   when user drags files and enters the drop zone
 * @property {string} [leftDropZone] - The text announced by assistive technology
 *   when user drags files and leaves the drop zone without dropping
 */

/**
 * @import { Schema } from '../../common/configuration.mjs'
 * @import { TranslationPluralForms } from '../../i18n.mjs'
 */
