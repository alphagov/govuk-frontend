/**
 * File upload (drag and drop) component
 *
 * This is currently only initialised if the dropzone option has been activated.
 */
export class FileUpload {
  /**
   * @param {Element} $module - HTML element to use for the dropzone
   */
  constructor ($module) {
    if (!$module) {
      return
    }

    /** @private */
    this.$module = $module

    /** @private */
    this.$input = $module.querySelector('.govuk-file-upload')

    /** @private */
    this.dropzoneVisibleClass = 'govuk-file-upload-dropzone--visible'

    /** @private */
    this.dropzoneTimeoutId = null
  }

  /** Initialise component */
  init () {
    this.build()
  }

  /**
   * Perform all the steps necessary to get the component activated. At the
   * moment, this is just binding a bunch of events.
   *
   * @private
   */
  build () {
    // Bind event listeners
    document.addEventListener('dragover', this.handleDragOver.bind(this))
    document.addEventListener('dragleave', this.handleDragLeave.bind(this))
    this.$input.addEventListener('drop', this.handleDragLeave.bind(this))
  }

  /**
   * Utility function to 'undo' everything this module sets up, just in case
   * it's needed in future or for testing and the like.
   *
   * @private
   */
  destroy () {
    // Remove event listeners
    document.removeEventListener('dragover', this.handleDragOver.bind(this))
    document.removeEventListener('dragleave', this.handleDragLeave.bind(this))
    this.$input.removeEventListener('drop', this.handleDragLeave.bind(this))

    // Ensure the active class is removed in case this is called mid-drag
    this.$module.classList.remove(this.dropzoneVisibleClass)
  }

  /**
   * Show the dropzone if the user drags a file over any part of the webpage.
   *
   * @private
   * @param {DragEvent} event - Dragging event
   */
  handleDragOver (event) {
    // Back out if the things we need to check don't exist
    if (!event || !event.dataTransfer || !event.dataTransfer.types) {
      return
    }

    // Determine whether the thing being dragged is a file, without regard for
    // what kind of file it is. If it's not a file, just stop, we don't care.
    if (event.dataTransfer.types.indexOf('Files') === -1) {
      return
    }

    // Add the class so that the drop area styles become visible
    this.$module.classList.add(this.dropzoneVisibleClass)
  }

  /**
   * Hide the dropzone if the user stops dragging a file over the webpage, or
   * has dropped the file. Chrome and Safari fire the dragleave event constantly
   * so we set a timeout on actually hiding the interface to avoid flickering.
   *
   * @private
   */
  handleDragLeave () {
    // Clear the timeout if one is already running
    clearTimeout(this.dropzoneTimeoutId)

    // Wait 250 ms before actually removing the class. This is annoyingly a
    // magic number. No real basis other than it works, usually.
    this.dropzoneTimeoutId = setTimeout(() => {
      this.$module.classList.remove(this.dropzoneVisibleClass)
    }, 250)
  }
}
