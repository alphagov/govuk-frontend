import { closestAttributeValue } from '../../common/closest-attribute-value.mjs';
import { ConfigurableComponent } from '../../common/configuration.mjs';
import { formatErrorMessage } from '../../common/index.mjs';
import { ElementError } from '../../errors/index.mjs';
import { I18n } from '../../i18n.mjs';

/**
 * File upload component
 *
 * @preserve
 * @augments ConfigurableComponent<FileUploadConfig,HTMLFileInputElement>
 */
class FileUpload extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - File input element
   * @param {FileUploadConfig} [config] - File Upload config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.$wrapper = void 0;
    this.$button = void 0;
    this.$status = void 0;
    this.i18n = void 0;
    this.id = void 0;
    if (this.$root.type !== 'file') {
      throw new ElementError(formatErrorMessage(FileUpload, 'Form field must be an input of type `file`.'));
    }
    if (!this.$root.id.length) {
      throw new ElementError(formatErrorMessage(FileUpload, 'Form field must specify an `id`.'));
    }
    this.id = this.$root.id;
    this.i18n = new I18n(this.config.i18n, {
      locale: closestAttributeValue(this.$root, 'lang')
    });
    const $label = this.findLabel();
    $label.setAttribute('for', `${this.id}-input`);
    if (!$label.id) {
      $label.id = `${this.id}-label`;
    }
    this.$root.id = `${this.id}-input`;
    const $wrapper = document.createElement('div');
    $wrapper.className = 'govuk-file-upload-wrapper';
    const $button = document.createElement('button');
    $button.classList.add('govuk-file-upload__button');
    $button.type = 'button';
    $button.id = this.id;
    const ariaDescribedBy = this.$root.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      $button.setAttribute('aria-describedby', ariaDescribedBy);
    }
    const $status = document.createElement('span');
    $status.className = 'govuk-body govuk-file-upload__status';
    $status.innerText = this.i18n.t('filesSelectedDefault');
    $status.classList.add('govuk-file-upload__status--empty');
    $button.appendChild($status);
    const commaSpan = document.createElement('span');
    commaSpan.className = 'govuk-visually-hidden';
    commaSpan.innerText = ', ';
    commaSpan.id = `${this.id}-comma`;
    $button.appendChild(commaSpan);
    const containerSpan = document.createElement('span');
    containerSpan.className = 'govuk-file-upload__pseudo-button-container';
    const buttonSpan = document.createElement('span');
    buttonSpan.className = 'govuk-button govuk-button--secondary govuk-file-upload__pseudo-button';
    buttonSpan.innerText = this.i18n.t('selectFilesButton');
    containerSpan.appendChild(buttonSpan);
    const instructionSpan = document.createElement('span');
    instructionSpan.className = 'govuk-body govuk-file-upload__instruction';
    instructionSpan.innerText = this.i18n.t('instruction');
    containerSpan.appendChild(instructionSpan);
    $button.appendChild(containerSpan);
    $button.setAttribute('aria-labelledby', `${$label.id} ${commaSpan.id} ${$button.id}`);
    $button.addEventListener('click', this.onClick.bind(this));
    $wrapper.insertAdjacentElement('beforeend', $button);
    this.$root.insertAdjacentElement('afterend', $wrapper);
    this.$root.setAttribute('tabindex', '-1');
    this.$root.setAttribute('aria-hidden', 'true');
    $wrapper.insertAdjacentElement('afterbegin', this.$root);
    this.$wrapper = $wrapper;
    this.$button = $button;
    this.$status = $status;
    this.$root.addEventListener('change', this.onChange.bind(this));
    this.updateDisabledState();
    this.observeDisabledState();
    this.$announcements = document.createElement('span');
    this.$announcements.classList.add('govuk-file-upload-announcements');
    this.$announcements.classList.add('govuk-visually-hidden');
    this.$announcements.setAttribute('aria-live', 'assertive');
    this.$wrapper.insertAdjacentElement('afterend', this.$announcements);
    this.$wrapper.addEventListener('drop', this.hideDropZone.bind(this));
    document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));
    document.addEventListener('dragenter', () => {
      this.enteredAnotherElement = true;
    });
    document.addEventListener('dragleave', () => {
      if (!this.enteredAnotherElement) {
        this.hideDropZone();
      }
      this.enteredAnotherElement = false;
    });
  }

  /**
   * Updates the visibility of the dropzone as users enters the various elements on the page
   *
   * @param {DragEvent} event - The `dragenter` event
   */
  updateDropzoneVisibility(event) {
    if (event.target instanceof Node) {
      if (this.$wrapper.contains(event.target)) {
        if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
          if (!this.$wrapper.classList.contains('govuk-file-upload-wrapper--show-dropzone')) {
            this.$wrapper.classList.add('govuk-file-upload-wrapper--show-dropzone');
            this.$announcements.innerText = this.i18n.t('dropZoneEntered');
          }
        }
      } else {
        if (this.$wrapper.classList.contains('govuk-file-upload-wrapper--show-dropzone')) {
          this.hideDropZone();
        }
      }
    }
  }
  hideDropZone() {
    this.$wrapper.classList.remove('govuk-file-upload-wrapper--show-dropzone');
    this.$announcements.innerText = this.i18n.t('dropZoneLeft');
  }
  onChange() {
    const fileCount = this.$root.files.length;
    if (fileCount === 0) {
      this.$status.innerText = this.i18n.t('filesSelectedDefault');
      this.$status.classList.add('govuk-file-upload__status--empty');
    } else {
      if (fileCount === 1) {
        this.$status.innerText = this.$root.files[0].name;
      } else {
        this.$status.innerText = this.i18n.t('filesSelected', {
          count: fileCount
        });
      }
      this.$status.classList.remove('govuk-file-upload__status--empty');
    }
  }
  findLabel() {
    const $label = document.querySelector(`label[for="${this.$root.id}"]`);
    if (!$label) {
      throw new ElementError({
        component: FileUpload,
        identifier: 'No label'
      });
    }
    return $label;
  }
  onClick() {
    this.$root.click();
  }
  observeDisabledState() {
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        console.log('mutation', mutation);
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
          this.updateDisabledState();
        }
      }
    });
    observer.observe(this.$root, {
      attributes: true
    });
  }
  updateDisabledState() {
    this.$button.disabled = this.$root.disabled;
  }
}
FileUpload.moduleName = 'govuk-file-upload';
FileUpload.defaults = Object.freeze({
  i18n: {
    selectFilesButton: 'Choose file',
    filesSelectedDefault: 'No file chosen',
    filesSelected: {
      one: '%{count} file chosen',
      other: '%{count} files chosen'
    },
    dropZoneEntered: 'Entered drop zone',
    dropZoneLeft: 'Left drop zone',
    instruction: 'or drop file'
  }
});
FileUpload.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    }
  }
});
function isContainingFiles(dataTransfer) {
  const hasNoTypesInfo = dataTransfer.types.length === 0;
  const isDraggingFiles = dataTransfer.types.some(type => type === 'Files');
  return hasNoTypesInfo || isDraggingFiles;
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

export { FileUpload };
//# sourceMappingURL=file-upload.mjs.map
