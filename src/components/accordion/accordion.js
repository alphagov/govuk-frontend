
/*
  Accordion

  This allows a collection of sections to be collapsed by default,
  showing only their headers. Sections can be exanded or collapsed
  individually by clicking their headers. An "Open all" button is
  also added to the top of the accordion, which switches to "Close all"
  when all the sections are expanded.

  The state of each section is saved to the DOM via the `aria-expanded`
  attribute, which also provides accessibility.

*/

function Accordion ($module) {
  this.$module = $module
}

Accordion.prototype.init = function () {
  // First do feature detection for required API methods
  if (
    document.querySelectorAll &&
    window.NodeList &&
    'classList' in document.body
  ) {
    this.sections = []

    var accordion_sections = this.$module.querySelectorAll('.accordion-section')

    var accordion = this

    for (var i = accordion_sections.length - 1; i >= 0; i--) {
      accordion.sections.push(new AccordionSection(accordion_sections[i], accordion))
    };

    var accordion_controls = document.createElement('div')
    accordion_controls.setAttribute('class', 'accordion-controls')

    var open_or_close_all_button = document.createElement('button')
    open_or_close_all_button.textContent = 'Open all'
    open_or_close_all_button.setAttribute('class', 'accordion-expand-all')
    open_or_close_all_button.setAttribute('aria-expanded', 'false')
    open_or_close_all_button.setAttribute('type', 'button')

    open_or_close_all_button.addEventListener('click', this.openOrCloseAll.bind(this))

    accordion_controls.appendChild(open_or_close_all_button)

    this.$module.insertBefore(accordion_controls, this.$module.firstChild)
    this.$module.classList.add('with-js')
  }
}

Accordion.prototype.openOrCloseAll = function (event) {
  var open_or_close_all_button = event.target
  var now_expanded = !(open_or_close_all_button.getAttribute('aria-expanded') == 'true')

  for (var i = this.sections.length - 1; i >= 0; i--) {
    this.sections[i].setExpanded(now_expanded)
  };

  this.setOpenCloseButtonExpanded(now_expanded)
}

Accordion.prototype.setOpenCloseButtonExpanded = function (expanded) {
  var open_or_close_all_button = this.$module.querySelector('.accordion-expand-all')

  var new_button_text = expanded ? 'Close all' : 'Open all'
  open_or_close_all_button.setAttribute('aria-expanded', expanded)
  open_or_close_all_button.textContent = new_button_text
}

Accordion.prototype.updateOpenAll = function () {
  var sectionsCount = this.sections.length

  var openSectionsCount = 0

  for (var i = this.sections.length - 1; i >= 0; i--) {
    if (this.sections[i].expanded()) {
      openSectionsCount += 1
    }
  };

  if (sectionsCount == openSectionsCount) {
    this.setOpenCloseButtonExpanded(true)
  } else {
    this.setOpenCloseButtonExpanded(false)
  }
}

function AccordionSection (element, accordion) {
  this.$module = element
  this.accordion = accordion
  this.setup()
}

AccordionSection.prototype.setup = function () {
  var sectionExpanded = this.$module.classList.contains('accordion-section--expanded')

  this.$module.setAttribute('aria-expanded', sectionExpanded)

  var header = this.$module.querySelector('.accordion-section-header')
  header.addEventListener('click', this.toggleExpanded.bind(this))
  header.addEventListener('keypress', this.keyPressed.bind(this))
  header.setAttribute('tabindex', '0')
  header.setAttribute('role', 'button')

  var icon = document.createElement('span')
  icon.setAttribute('class', 'icon')

  header.appendChild(icon)

  /* Remove this class now, as the `aria-expanded` attribute is being used
       to store expanded state instead. */
  if (sectionExpanded) {
    this.$module.classList.remove('accordion-section--expanded')
  }
}

AccordionSection.prototype.toggleExpanded = function () {
  var expanded = (this.$module.getAttribute('aria-expanded') == 'true')

  this.setExpanded(!expanded)
  this.accordion.updateOpenAll()
}

AccordionSection.prototype.keyPressed = function (event) {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    this.toggleExpanded()
  }
}

AccordionSection.prototype.expanded = function () {
  return (this.$module.getAttribute('aria-expanded') == 'true')
}

AccordionSection.prototype.setExpanded = function (expanded) {
  this.$module.setAttribute('aria-expanded', expanded)

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.$module.className = this.$module.className
}

export default Accordion
