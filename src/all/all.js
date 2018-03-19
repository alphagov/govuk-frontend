import { nodeListForEach } from '../globals/common'

import Button from '../button/button'
import Details from '../details/details'
import Checkboxes from '../checkboxes/checkboxes'

export function initAll () {
  new Button().init()
  new Details().init()

  var $checkboxes = document.querySelectorAll('[data-module="checkboxes"]')
  nodeListForEach($checkboxes, function ($checkbox) {
    new Checkboxes($checkbox).init()
  })
}

(initAll())
