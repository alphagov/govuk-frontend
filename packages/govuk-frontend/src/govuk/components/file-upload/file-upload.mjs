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
    if (!($module instanceof HTMLElement)) {
      return this
    }

    /** @private */
    this.$module = $module

    /** @private */
    this.$input = $module.querySelector('.govuk-file-upload')

    /** @private */
    this.dropzoneVisibleClass = 'govuk-file-upload-dropzone--visible'
    /** @private */
    this.dropzoneHoveredClass = 'govuk-file-upload-dropzone--hovered'

    /** @private */
    this.viewportTimeoutId = null
    /** @private */
    this.inputTimeoutId = null
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
   * @returns {this|void} - Will return `this` if not all elements are defined
   */
  build () {
    if (!(this.$input instanceof HTMLElement)) {
      return this
    }

    // Bind event listeners
    document.addEventListener('dragover', this.handleViewportDragOver.bind(this))
    document.addEventListener('dragleave', this.handleViewportDragLeave.bind(this))
    this.$input.addEventListener('dragover', this.handleInputDragOver.bind(this))
    this.$input.addEventListener('dragleave', this.handleInputDragLeave.bind(this))
    this.$input.addEventListener('drop', this.handleDrop.bind(this))
  }

  /**
   * Utility function to 'undo' everything this module sets up, just in case
   * it's needed in future or for testing and the like.
   *
   * @private
   * @returns {this|void} - Will return `this` if not all elements are defined
   */
  destroy () {
    if (!(this.$input instanceof HTMLElement)) {
      return this
    }

    // Remove event listeners
    document.removeEventListener('dragover', this.handleViewportDragOver.bind(this))
    document.removeEventListener('dragleave', this.handleViewportDragLeave.bind(this))
    this.$input.removeEventListener('dragover', this.handleInputDragOver.bind(this))
    this.$input.removeEventListener('dragleave', this.handleInputDragLeave.bind(this))
    this.$input.removeEventListener('drop', this.handleDrop.bind(this))

    // Ensure the active class is removed in case this is called mid-drag
    this.$module.classList.remove(this.dropzoneVisibleClass)
  }

  /**
   * Helper function to determine if the thing being dragged is a file or not.
   *
   * @private
   * @param {DragEvent} event - Dragging event
   * @returns {boolean} - Whether it's a file or not
   */
  draggableIsFile (event) {
    // Back out if the things we need to check don't exist
    if (!event || !event.dataTransfer || !event.dataTransfer.types) {
      return false
    }

    // Determine whether the thing being dragged is a file, without regard for
    // what kind of file it is. If it's not a file, just stop, we don't care.
    if (event.dataTransfer.types.indexOf('Files') === -1) {
      return false
    }

    // If we got this far it's probably a file
    return true
  }

  /**
   * Show the dropzone if the user drags a file over any part of the webpage.
   *
   * @private
   * @param {DragEvent} event - Dragging event
   */
  handleViewportDragOver (event) {
    if (this.draggableIsFile(event)) {
      // Add the class so that the drop area styles become visible
      this.$module.classList.add(this.dropzoneVisibleClass)
    }
  }

  /**
   * Hide the dropzone if the user stops dragging a file over the webpage.
   * Chrome and Safari fire the dragleave event constantly so we set a timeout
   * on actually hiding the interface to avoid flickering.
   *
   * @private
   */
  handleViewportDragLeave () {
    // Clear the timeout if one is already running
    clearTimeout(this.viewportTimeoutId)

    // Wait 250 ms before actually removing the class. This is annoyingly a
    // magic number. No real basis other than it works, usually.
    this.viewportTimeoutId = setTimeout(() => {
      this.$module.classList.remove(this.dropzoneVisibleClass)
    }, 250)
  }

  /**
   * Draw emphasis to the dropzone if the user has dragged a file over it
   * specifically, helping a user to recognise that they can safely drop it.
   *
   * @private
   * @param {DragEvent} event - Dragging event
   */
  handleInputDragOver (event) {
    if (this.draggableIsFile(event)) {
      this.$module.classList.add(this.dropzoneHoveredClass)
    }
  }

  /**
   * Remove emphasis on the dropzone if the user stopped dragging a file over it.
   *
   * @private
   */
  handleInputDragLeave () {
    // Clear the timeout if one is already running
    clearTimeout(this.inputTimeoutId)

    // Wait 250 ms before actually removing the class. This is annoyingly a
    // magic number. No real basis other than it works, usually.
    this.inputTimeoutId = setTimeout(() => {
      this.$module.classList.remove(this.dropzoneHoveredClass)
    }, 250)
  }

  /**
   * Hide the dropzone if the user has dropped a file on it.
   *
   * @private
   */
  handleDrop () {
    this.$module.classList.remove(this.dropzoneVisibleClass, this.dropzoneHoveredClass)
  }
}
