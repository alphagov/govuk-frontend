'use strict'

const fs = require('fs')
const util = require('util')

const configPaths = require('../config/paths.json')
const nunjucks = require('nunjucks')

const NODE_KEYS = [
  'args',
  'arr',
  'body',
  'cond',
  'expr',
  'else_',
  'left',
  'name',
  'right',
  'target',
  'template',
  'val',
  'value',
]

const CHILD_KEYS = [
  'children',
  'ops',
  'targets',
]

const walk = (node, func) => {
  if (func(node) !== false) {
    CHILD_KEYS
      .filter(key => Array.isArray(node[key]))
      .forEach(key => {
        node[key].forEach(child => walk(child, func));
      })

    NODE_KEYS
      .filter(key => node[key] && typeof node[key] === 'object')
      .forEach(key => walk(node[key], func))
  }
  return node
}

exports.getTemplate = function(component) {
  return fs.readFileSync(`src/components/${component}/template.njk`, {
    encoding: 'utf-8'
  })
}

const _getNodeName = function (node) {
  switch (node.typename) {
    case 'Symbol':
      return node.value
    case 'LookupVal':
      return _getNodeName(node.target) + '.' + _getNodeName(node.val)
    case 'Literal':
      return node.value.toString()
  }
}

exports.extractVariablesFromTemplate = function(template) {
  const ast = nunjucks.parser.parse(template)

  let vars = []
  let associations = {}

  walk(ast, (node) => {
    if (node instanceof nunjucks.nodes.For) {
      let target = _getNodeName(node.arr).replace('params.', '')
      let targetParent = target.includes('.') ? target.split(".")[0] : false

      if (associations.hasOwnProperty(target)) {
        target = associations[target]
      }
      if (targetParent && associations.hasOwnProperty(targetParent)) {
        target = target.replace(targetParent, associations[targetParent])
      }

      associations[node.name.value] = target
    }

    if (node instanceof nunjucks.nodes.Set && node.value) {
      const valueName = _getNodeName(node.value)
      if (valueName) {
        associations[_getNodeName(node.targets[0])] = valueName.replace('params.', '')
      }
    }

    if (node.target && node.val) {
      let nodeName = _getNodeName(node.target)
      let parent = nodeName.includes('.') ? nodeName.split(".")[0] : false

      if (associations.hasOwnProperty(nodeName)) {
        vars.push([associations[nodeName], node.val.value].join("."))
      } else if (parent && associations.hasOwnProperty(parent)) {
        vars.push([nodeName.replace(parent, associations[parent]), node.val.value].join("."))
      } else if (nodeName.indexOf('params.') !== -1) {
        vars.push([nodeName.replace('params.', ''), node.val.value].join("."))
      } else if (nodeName == 'params') {
        vars.push(node.val.value)
      }
    }
  })

  return vars.filter((v, i, a) => a.indexOf(v) === i).sort()
}
