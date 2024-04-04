import { mergeConfigs } from '../../common/index.mjs';
import { normaliseDataset } from '../../common/normalise-dataset.mjs';
import { ElementError } from '../../errors/index.mjs';
import { GOVUKFrontendComponent } from '../../govuk-frontend-component.mjs';
import { I18n } from '../../i18n.mjs';

/**
 * Accordion component
 *
 * This allows a collection of sections to be collapsed by default, showing only
 * their headers. Sections can be expanded or collapsed individually by clicking
 * their headers. A "Show all sections" button is also added to the top of the
 * accordion, which switches to "Hide all sections" when all the sections are
 * expanded.
 *
 * The state of each section is saved to the DOM via the `aria-expanded`
 * attribute, which also provides accessibility.
 *
 * @preserve
 */
class Accordion extends GOVUKFrontendComponent {
  /**
   * @param {Element | null} $module - HTML element to use for accordion
   * @param {AccordionConfig} [config] - Accordion config
   */
  constructor($module, config = {}) {
    super();
    this.$module = void 0;
    this.config = void 0;
    this.i18n = void 0;
    this.controlsClass = 'govuk-accordion__controls';
    this.showAllClass = 'govuk-accordion__show-all';
    this.showAllTextClass = 'govuk-accordion__show-all-text';
    this.sectionClass = 'govuk-accordion__section';
    this.sectionExpandedClass = 'govuk-accordion__section--expanded';
    this.sectionButtonClass = 'govuk-accordion__section-button';
    this.sectionHeaderClass = 'govuk-accordion__section-header';
    this.sectionHeadingClass = 'govuk-accordion__section-heading';
    this.sectionHeadingDividerClass = 'govuk-accordion__section-heading-divider';
    this.sectionHeadingTextClass = 'govuk-accordion__section-heading-text';
    this.sectionHeadingTextFocusClass = 'govuk-accordion__section-heading-text-focus';
    this.sectionShowHideToggleClass = 'govuk-accordion__section-toggle';
    this.sectionShowHideToggleFocusClass = 'govuk-accordion__section-toggle-focus';
    this.sectionShowHideTextClass = 'govuk-accordion__section-toggle-text';
    this.upChevronIconClass = 'govuk-accordion-nav__chevron';
    this.downChevronIconClass = 'govuk-accordion-nav__chevron--down';
    this.sectionSummaryClass = 'govuk-accordion__section-summary';
    this.sectionSummaryFocusClass = 'govuk-accordion__section-summary-focus';
    this.sectionContentClass = 'govuk-accordion__section-content';
    this.$sections = void 0;
    this.browserSupportsSessionStorage = false;
    this.$showAllButton = null;
    this.$showAllIcon = null;
    this.$showAllText = null;
    if (!($module instanceof HTMLElement)) {
      throw new ElementError({
        componentName: 'Accordion',
        element: $module,
        identifier: 'Root element (`$module`)'
      });
    }
    this.$module = $module;
    this.config = mergeConfigs(Accordion.defaults, config, normaliseDataset(Accordion, $module.dataset));
    this.i18n = new I18n(this.config.i18n);
    const $sections = this.$module.querySelectorAll(`.${this.sectionClass}`);
    if (!$sections.length) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Sections (\`<div class="${this.sectionClass}">\`)`
      });
    }
    this.$sections = $sections;
    this.browserSupportsSessionStorage = helper.checkForSessionStorage();
    this.initControls();
    this.initSectionHeaders();
    const areAllSectionsOpen = this.checkIfAllSectionsOpen();
    this.updateShowAllButton(areAllSectionsOpen);
  }
  initControls() {
    this.$showAllButton = document.createElement('button');
    this.$showAllButton.setAttribute('type', 'button');
    this.$showAllButton.setAttribute('class', this.showAllClass);
    this.$showAllButton.setAttribute('aria-expanded', 'false');
    this.$showAllIcon = document.createElement('span');
    this.$showAllIcon.classList.add(this.upChevronIconClass);
    this.$showAllButton.appendChild(this.$showAllIcon);
    const $accordionControls = document.createElement('div');
    $accordionControls.setAttribute('class', this.controlsClass);
    $accordionControls.appendChild(this.$showAllButton);
    this.$module.insertBefore($accordionControls, this.$module.firstChild);
    this.$showAllText = document.createElement('span');
    this.$showAllText.classList.add(this.showAllTextClass);
    this.$showAllButton.appendChild(this.$showAllText);
    this.$showAllButton.addEventListener('click', () => this.onShowOrHideAllToggle());
    if ('onbeforematch' in document) {
      document.addEventListener('beforematch', event => this.onBeforeMatch(event));
    }
  }
  initSectionHeaders() {
    this.$sections.forEach(($section, i) => {
      const $header = $section.querySelector(`.${this.sectionHeaderClass}`);
      if (!$header) {
        throw new ElementError({
          componentName: 'Accordion',
          identifier: `Section headers (\`<div class="${this.sectionHeaderClass}">\`)`
        });
      }
      this.constructHeaderMarkup($header, i);
      this.setExpanded(this.isExpanded($section), $section);
      $header.addEventListener('click', () => this.onSectionToggle($section));
      this.setInitialState($section);
    });
  }
  constructHeaderMarkup($header, index) {
    const $span = $header.querySelector(`.${this.sectionButtonClass}`);
    const $heading = $header.querySelector(`.${this.sectionHeadingClass}`);
    const $summary = $header.querySelector(`.${this.sectionSummaryClass}`);
    if (!$heading) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Section heading (\`.${this.sectionHeadingClass}\`)`
      });
    }
    if (!$span) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Section button placeholder (\`<span class="${this.sectionButtonClass}">\`)`
      });
    }
    const $button = document.createElement('button');
    $button.setAttribute('type', 'button');
    $button.setAttribute('aria-controls', `${this.$module.id}-content-${index + 1}`);
    for (const attr of Array.from($span.attributes)) {
      if (attr.nodeName !== 'id') {
        $button.setAttribute(attr.nodeName, `${attr.nodeValue}`);
      }
    }
    const $headingText = document.createElement('span');
    $headingText.classList.add(this.sectionHeadingTextClass);
    $headingText.id = $span.id;
    const $headingTextFocus = document.createElement('span');
    $headingTextFocus.classList.add(this.sectionHeadingTextFocusClass);
    $headingText.appendChild($headingTextFocus);
    $headingTextFocus.innerHTML = $span.innerHTML;
    const $showHideToggle = document.createElement('span');
    $showHideToggle.classList.add(this.sectionShowHideToggleClass);
    $showHideToggle.setAttribute('data-nosnippet', '');
    const $showHideToggleFocus = document.createElement('span');
    $showHideToggleFocus.classList.add(this.sectionShowHideToggleFocusClass);
    $showHideToggle.appendChild($showHideToggleFocus);
    const $showHideText = document.createElement('span');
    const $showHideIcon = document.createElement('span');
    $showHideIcon.classList.add(this.upChevronIconClass);
    $showHideToggleFocus.appendChild($showHideIcon);
    $showHideText.classList.add(this.sectionShowHideTextClass);
    $showHideToggleFocus.appendChild($showHideText);
    $button.appendChild($headingText);
    $button.appendChild(this.getButtonPunctuationEl());
    if ($summary != null && $summary.parentNode) {
      const $summarySpan = document.createElement('span');
      const $summarySpanFocus = document.createElement('span');
      $summarySpanFocus.classList.add(this.sectionSummaryFocusClass);
      $summarySpan.appendChild($summarySpanFocus);
      for (const attr of Array.from($summary.attributes)) {
        $summarySpan.setAttribute(attr.nodeName, `${attr.nodeValue}`);
      }
      $summarySpanFocus.innerHTML = $summary.innerHTML;
      $summary.parentNode.replaceChild($summarySpan, $summary);
      $button.appendChild($summarySpan);
      $button.appendChild(this.getButtonPunctuationEl());
    }
    $button.appendChild($showHideToggle);
    $heading.removeChild($span);
    $heading.appendChild($button);
  }
  onBeforeMatch(event) {
    const $fragment = event.target;
    if (!($fragment instanceof Element)) {
      return;
    }
    const $section = $fragment.closest(`.${this.sectionClass}`);
    if ($section) {
      this.setExpanded(true, $section);
    }
  }
  onSectionToggle($section) {
    const expanded = this.isExpanded($section);
    this.setExpanded(!expanded, $section);
    this.storeState($section);
  }
  onShowOrHideAllToggle() {
    const nowExpanded = !this.checkIfAllSectionsOpen();
    this.$sections.forEach($section => {
      this.setExpanded(nowExpanded, $section);
      this.storeState($section);
    });
    this.updateShowAllButton(nowExpanded);
  }
  setExpanded(expanded, $section) {
    const $showHideIcon = $section.querySelector(`.${this.upChevronIconClass}`);
    const $showHideText = $section.querySelector(`.${this.sectionShowHideTextClass}`);
    const $button = $section.querySelector(`.${this.sectionButtonClass}`);
    const $content = $section.querySelector(`.${this.sectionContentClass}`);
    if (!$content) {
      throw new ElementError({
        componentName: 'Accordion',
        identifier: `Section content (\`<div class="${this.sectionContentClass}">\`)`
      });
    }
    if (!$showHideIcon || !$showHideText || !$button) {
      return;
    }
    const newButtonText = expanded ? this.i18n.t('hideSection') : this.i18n.t('showSection');
    $showHideText.textContent = newButtonText;
    $button.setAttribute('aria-expanded', `${expanded}`);
    const ariaLabelParts = [];
    const $headingText = $section.querySelector(`.${this.sectionHeadingTextClass}`);
    if ($headingText) {
      ariaLabelParts.push(`${$headingText.textContent}`.trim());
    }
    const $summary = $section.querySelector(`.${this.sectionSummaryClass}`);
    if ($summary) {
      ariaLabelParts.push(`${$summary.textContent}`.trim());
    }
    const ariaLabelMessage = expanded ? this.i18n.t('hideSectionAriaLabel') : this.i18n.t('showSectionAriaLabel');
    ariaLabelParts.push(ariaLabelMessage);
    $button.setAttribute('aria-label', ariaLabelParts.join(' , '));
    if (expanded) {
      $content.removeAttribute('hidden');
      $section.classList.add(this.sectionExpandedClass);
      $showHideIcon.classList.remove(this.downChevronIconClass);
    } else {
      $content.setAttribute('hidden', 'until-found');
      $section.classList.remove(this.sectionExpandedClass);
      $showHideIcon.classList.add(this.downChevronIconClass);
    }
    const areAllSectionsOpen = this.checkIfAllSectionsOpen();
    this.updateShowAllButton(areAllSectionsOpen);
  }
  isExpanded($section) {
    return $section.classList.contains(this.sectionExpandedClass);
  }
  checkIfAllSectionsOpen() {
    const sectionsCount = this.$sections.length;
    const expandedSectionCount = this.$module.querySelectorAll(`.${this.sectionExpandedClass}`).length;
    const areAllSectionsOpen = sectionsCount === expandedSectionCount;
    return areAllSectionsOpen;
  }
  updateShowAllButton(expanded) {
    if (!this.$showAllButton || !this.$showAllText || !this.$showAllIcon) {
      return;
    }
    this.$showAllButton.setAttribute('aria-expanded', expanded.toString());
    this.$showAllText.textContent = expanded ? this.i18n.t('hideAllSections') : this.i18n.t('showAllSections');
    this.$showAllIcon.classList.toggle(this.downChevronIconClass, !expanded);
  }
  storeState($section) {
    if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      if ($button) {
        const contentId = $button.getAttribute('aria-controls');
        const contentState = $button.getAttribute('aria-expanded');
        if (contentId && contentState) {
          window.sessionStorage.setItem(contentId, contentState);
        }
      }
    }
  }
  setInitialState($section) {
    if (this.browserSupportsSessionStorage && this.config.rememberExpanded) {
      const $button = $section.querySelector(`.${this.sectionButtonClass}`);
      if ($button) {
        const contentId = $button.getAttribute('aria-controls');
        const contentState = contentId ? window.sessionStorage.getItem(contentId) : null;
        if (contentState !== null) {
          this.setExpanded(contentState === 'true', $section);
        }
      }
    }
  }
  getButtonPunctuationEl() {
    const $punctuationEl = document.createElement('span');
    $punctuationEl.classList.add('govuk-visually-hidden', this.sectionHeadingDividerClass);
    $punctuationEl.innerHTML = ', ';
    return $punctuationEl;
  }
}
Accordion.moduleName = 'govuk-accordion';
Accordion.defaults = Object.freeze({
  i18n: {
    hideAllSections: 'Hide all sections',
    hideSection: 'Hide',
    hideSectionAriaLabel: 'Hide this section',
    showAllSections: 'Show all sections',
    showSection: 'Show',
    showSectionAriaLabel: 'Show this section'
  },
  rememberExpanded: true
});
Accordion.schema = Object.freeze({
  properties: {
    i18n: {
      type: 'object'
    },
    rememberExpanded: {
      type: 'boolean'
    }
  }
});
const helper = {
  /**
   * Check for `window.sessionStorage`, and that it actually works.
   *
   * @returns {boolean} True if session storage is available
   */
  checkForSessionStorage: function () {
    const testString = 'this is the test string';
    let result;
    try {
      window.sessionStorage.setItem(testString, testString);
      result = window.sessionStorage.getItem(testString) === testString.toString();
      window.sessionStorage.removeItem(testString);
      return result;
    } catch (exception) {
      return false;
    }
  }
};

/**
 * Accordion config
 *
 * @see {@link Accordion.defaults}
 * @typedef {object} AccordionConfig
 * @property {AccordionTranslations} [i18n=Accordion.defaults.i18n] - Accordion translations
 * @property {boolean} [rememberExpanded] - Whether the expanded and collapsed
 *   state of each section is remembered and restored when navigating.
 */

/**
 * Accordion translations
 *
 * @see {@link Accordion.defaults.i18n}
 * @typedef {object} AccordionTranslations
 *
 * Messages used by the component for the labels of its buttons. This includes
 * the visible text shown on screen, and text to help assistive technology users
 * for the buttons toggling each section.
 * @property {string} [hideAllSections] - The text content for the 'Hide all
 *   sections' button, used when at least one section is expanded.
 * @property {string} [hideSection] - The text content for the 'Hide'
 *   button, used when a section is expanded.
 * @property {string} [hideSectionAriaLabel] - The text content appended to the
 *   'Hide' button's accessible name when a section is expanded.
 * @property {string} [showAllSections] - The text content for the 'Show all
 *   sections' button, used when all sections are collapsed.
 * @property {string} [showSection] - The text content for the 'Show'
 *   button, used when a section is collapsed.
 * @property {string} [showSectionAriaLabel] - The text content appended to the
 *   'Show' button's accessible name when a section is expanded.
 */

/**
 * @typedef {import('../../common/index.mjs').Schema} Schema
 */

export { Accordion };
//# sourceMappingURL=accordion.mjs.map
