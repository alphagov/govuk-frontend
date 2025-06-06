import { closestAttributeValue } from '../../common/closest-attribute-value.mjs';
import { ConfigurableComponent } from '../../common/configuration.mjs';
import { formatErrorMessage } from '../../common/index.mjs';
import { ElementError } from '../../errors/index.mjs';
import { I18n } from '../../i18n.mjs';

/**
 * File upload component
 *
 * @preserve
 * @augments ConfigurableComponent<FileUploadConfig>
 */
class FileUpload extends ConfigurableComponent {
  /**
   * @param {Element | null} $root - File input element
   * @param {FileUploadConfig} [config] - File Upload config
   */
  constructor($root, config = {}) {
    super($root, config);
    this.$input = void 0;
    this.$button = void 0;
    this.$status = void 0;
    this.i18n = void 0;
    this.id = void 0;
    this.$announcements = void 0;
    this.enteredAnotherElement = void 0;
    const $input = this.$root.querySelector('input');
    if ($input === null) {
      throw new ElementError({
        component: FileUpload,
        identifier: 'File inputs (`<input type="file">`)'
      });
    }
    if ($input.type !== 'file') {
      throw new ElementError(formatErrorMessage(FileUpload, 'File input (`<input type="file">`) attribute (`type`) is not `file`'));
    }
    this.$input = $input;
    this.$input.setAttribute('hidden', 'true');
    if (!this.$input.id) {
      throw new ElementError({
        component: FileUpload,
        identifier: 'File input (`<input type="file">`) attribute (`id`)'
      });
    }
    this.id = this.$input.id;
    this.i18n = new I18n(this.config.i18n, {
      locale: closestAttributeValue(this.$root, 'lang')
    });
    const $label = this.findLabel();
    if (!$label.id) {
      $label.id = `${this.id}-label`;
    }
    this.$input.id = `${this.id}-input`;
    const $button = document.createElement('button');
    $button.classList.add('govuk-file-upload-button');
    $button.type = 'button';
    $button.id = this.id;
    $button.classList.add('govuk-file-upload-button--empty');
    const ariaDescribedBy = this.$input.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      $button.setAttribute('aria-describedby', ariaDescribedBy);
    }
    const $status = document.createElement('span');
    $status.className = 'govuk-body govuk-file-upload-button__status';
    $status.setAttribute('aria-live', 'polite');
    $status.innerText = this.i18n.t('noFileChosen');
    $button.appendChild($status);
    const commaSpan = document.createElement('span');
    commaSpan.className = 'govuk-visually-hidden';
    commaSpan.innerText = ', ';
    commaSpan.id = `${this.id}-comma`;
    $button.appendChild(commaSpan);
    const containerSpan = document.createElement('span');
    containerSpan.className = 'govuk-file-upload-button__pseudo-button-container';
    const buttonSpan = document.createElement('span');
    buttonSpan.className = 'govuk-button govuk-button--secondary govuk-file-upload-button__pseudo-button';
    buttonSpan.innerText = this.i18n.t('chooseFilesButton');
    containerSpan.appendChild(buttonSpan);
    containerSpan.insertAdjacentText('beforeend', ' ');
    const instructionSpan = document.createElement('span');
    instructionSpan.className = 'govuk-body govuk-file-upload-button__instruction';
    instructionSpan.innerText = this.i18n.t('dropInstruction');
    containerSpan.appendChild(instructionSpan);
    $button.appendChild(containerSpan);
    $button.setAttribute('aria-labelledby', `${$label.id} ${commaSpan.id} ${$button.id}`);
    $button.addEventListener('click', this.onClick.bind(this));
    $button.addEventListener('dragover', event => {
      event.preventDefault();
    });
    this.$root.insertAdjacentElement('afterbegin', $button);
    this.$input.setAttribute('tabindex', '-1');
    this.$input.setAttribute('aria-hidden', 'true');
    this.$button = $button;
    this.$status = $status;
    this.$input.addEventListener('change', this.onChange.bind(this));
    this.updateDisabledState();
    this.observeDisabledState();
    this.$announcements = document.createElement('span');
    this.$announcements.classList.add('govuk-file-upload-announcements');
    this.$announcements.classList.add('govuk-visually-hidden');
    this.$announcements.setAttribute('aria-live', 'assertive');
    this.$root.insertAdjacentElement('afterend', this.$announcements);
    this.$button.addEventListener('drop', this.onDrop.bind(this));
    document.addEventListener('dragenter', this.updateDropzoneVisibility.bind(this));
    document.addEventListener('dragenter', () => {
      this.enteredAnotherElement = true;
    });
    document.addEventListener('dragleave', () => {
      if (!this.enteredAnotherElement && !this.$button.disabled) {
        this.hideDraggingState();
        this.$announcements.innerText = this.i18n.t('leftDropZone');
      }
      this.enteredAnotherElement = false;
    });
  }
  updateDropzoneVisibility(event) {
    if (this.$button.disabled) return;
    if (event.target instanceof Node) {
      if (this.$root.contains(event.target)) {
        if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
          if (!this.$button.classList.contains('govuk-file-upload-button--dragging')) {
            this.showDraggingState();
            this.$announcements.innerText = this.i18n.t('enteredDropZone');
          }
        }
      } else {
        if (this.$button.classList.contains('govuk-file-upload-button--dragging')) {
          this.hideDraggingState();
          this.$announcements.innerText = this.i18n.t('leftDropZone');
        }
      }
    }
  }
  showDraggingState() {
    this.$button.classList.add('govuk-file-upload-button--dragging');
  }
  hideDraggingState() {
    this.$button.classList.remove('govuk-file-upload-button--dragging');
  }
  onDrop(event) {
    event.preventDefault();
    if (event.dataTransfer && isContainingFiles(event.dataTransfer)) {
      this.$input.files = event.dataTransfer.files;
      this.$input.dispatchEvent(new CustomEvent('change'));
      this.hideDraggingState();
    }
  }
  onChange() {
    const fileCount = this.$input.files.length;
    if (fileCount === 0) {
      this.$status.innerText = this.i18n.t('noFileChosen');
      this.$button.classList.add('govuk-file-upload-button--empty');
    } else {
      if (fileCount === 1) {
        this.$status.innerText = this.$input.files[0].name;
      } else {
        this.$status.innerText = this.i18n.t('multipleFilesChosen', {
          count: fileCount
        });
      }
      this.$button.classList.remove('govuk-file-upload-button--empty');
    }
  }
  findLabel() {
    const $label = document.querySelector(`label[for="${this.$input.id}"]`);
    if (!$label) {
      throw new ElementError({
        component: FileUpload,
        identifier: `Field label (\`<label for=${this.$input.id}>\`)`
      });
    }
    return $label;
  }
  onClick() {
    this.$input.click();
  }
  observeDisabledState() {
    const observer = new MutationObserver(mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
          this.updateDisabledState();
        }
      }
    });
    observer.observe(this.$input, {
      attributes: true
    });
  }
  updateDisabledState() {
    this.$button.disabled = this.$input.disabled;
    this.$root.classList.toggle('govuk-drop-zone--disabled', this.$button.disabled);
  }
}
FileUpload.moduleName = 'govuk-file-upload';
FileUpload.defaults = Object.freeze({
  i18n: {
    chooseFilesButton: 'Choose file',
    dropInstruction: 'or drop file',
    noFileChosen: 'No file chosen',
    multipleFilesChosen: {
      one: '%{count} file chosen',
      other: '%{count} files chosen'
    },
    enteredDropZone: 'Entered drop zone',
    leftDropZone: 'Left drop zone'
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

export { FileUpload };
//# sourceMappingURL=file-upload.mjs.map
