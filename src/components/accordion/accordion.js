
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

    var accordionSections = this.$module.querySelectorAll('.govuk-accordion__section')

    var accordion = this

    for (var i = accordionSections.length - 1; i >= 0; i--) {
      accordion.sections.push(new AccordionSection(accordionSections[i], accordion))
    };

    var accordionControls = document.createElement('div')
    accordionControls.setAttribute('class', 'govuk-accordion__controls')

    var openOrCloseAllButton = document.createElement('button')
    openOrCloseAllButton.textContent = 'Open all'
    openOrCloseAllButton.setAttribute('class', 'govuk-accordion__expand-all')
    openOrCloseAllButton.setAttribute('aria-expanded', 'false')
    openOrCloseAllButton.setAttribute('type', 'button')

    openOrCloseAllButton.addEventListener('click', this.openOrCloseAll.bind(this))

    accordionControls.appendChild(openOrCloseAllButton)

    this.$module.insertBefore(accordionControls, this.$module.firstChild)
    this.$module.classList.add('with-js')
  }
}

Accordion.prototype.openOrCloseAll = function (event) {
  var openOrCloseAllButton = event.target
  var nowExpanded = !(openOrCloseAllButton.getAttribute('aria-expanded') === 'true')

  for (var i = this.sections.length - 1; i >= 0; i--) {
    this.sections[i].setExpanded(nowExpanded)
  };

  this.setOpenCloseButtonExpanded(nowExpanded)
}

Accordion.prototype.setOpenCloseButtonExpanded = function (expanded) {
  var openOrCloseAllButton = this.$module.querySelector('.govuk-accordion__expand-all')

  var newButtonText = expanded ? 'Close all' : 'Open all'
  openOrCloseAllButton.setAttribute('aria-expanded', expanded)
  openOrCloseAllButton.textContent = newButtonText
}

Accordion.prototype.updateOpenAll = function () {
  var sectionsCount = this.sections.length

  var openSectionsCount = 0

  for (var i = this.sections.length - 1; i >= 0; i--) {
    if (this.sections[i].expanded()) {
      openSectionsCount += 1
    }
  };

  if (sectionsCount === openSectionsCount) {
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
  var sectionExpanded = this.$module.classList.contains('govuk-accordion__section--expanded')

  this.$module.setAttribute('aria-expanded', sectionExpanded)

  var header = this.$module.querySelector('.govuk-accordion__section-header')
  header.addEventListener('click', this.toggleExpanded.bind(this))
  header.addEventListener('keypress', this.keyPressed.bind(this))
  header.setAttribute('tabindex', '0')
  header.setAttribute('role', 'button')

  var icon = document.createElement('span')
  icon.setAttribute('class', 'govuk-accordion--icon')

  header.appendChild(icon)

  /* Remove this class now, as the `aria-expanded` attribute is being used
       to store expanded state instead. */
  if (sectionExpanded) {
    this.$module.classList.remove('govuk-accordion__section--expanded')
  }
}

AccordionSection.prototype.toggleExpanded = function () {
  var expanded = (this.$module.getAttribute('aria-expanded') === 'true')

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
  return (this.$module.getAttribute('aria-expanded') === 'true')
}

AccordionSection.prototype.setExpanded = function (expanded) {
  this.$module.setAttribute('aria-expanded', expanded)

  // This is set to trigger reflow for IE8, which doesn't
  // always reflow after a setAttribute call.
  this.$module.className = this.$module.className
}

export default Accordion
