/* eslint-env jest */

const { extractVariablesFromTemplate } = require('./nunjucks-helper')

describe('extractVariablesFromTemplate', () => {
  it('extracts basic parameters', () => {
    const vars = extractVariablesFromTemplate(`
      {{ params.foo }}
    `)

    expect(vars).toEqual(['foo'])
  })

  it('extracts nested parameters', () => {
    const vars = extractVariablesFromTemplate(`
      {{ params.foo.bar }}
    `)

    expect(vars).toEqual(['foo', 'foo.bar'])
  })

  it('extracts parameters used in set statements', () => {
    const vars = extractVariablesFromTemplate(`
      {% set bar = params.foo %}
    `)

    expect(vars).toEqual(['foo'])
  })

  it('follows for loops', () => {
    const vars = extractVariablesFromTemplate(`
      {% for item in params.items %}
        {{ item.text }}
      {% endfor %}
    `)

    expect(vars).toEqual(['items', 'items.text'])
  })

  it('follows renames using set', () => {
    const vars = extractVariablesFromTemplate(`
      {% set foo = params.items %}

      {% for item in foo %}
        {{ item.text }}
      {% endfor %}
    `)

    expect(vars).toEqual(['items', 'items.text'])
  })

  it('handles nested parameters in for loops', () => {
    const vars = extractVariablesFromTemplate(`
      {% for item in params.items %}
        {{ item.link.text }}
      {% endfor %}
    `)

    expect(vars).toEqual(['items', 'items.link', 'items.link.text'])
  })

  it('follows for loops recursively', () => {
    const vars = extractVariablesFromTemplate(`
      {% for row in params.rows %}
        {% for cell in row %}
          {{ cell.text }}
        {% endfor %}
      {% endfor %}
    `)

    expect(vars).toEqual(['rows', 'rows.text'])
  })

  it('follows for loops recursively with nesting', () => {
    const vars = extractVariablesFromTemplate(`
      {% for item in params.items %}
        {% for link in item.links %}
          {{ link.text }}
        {% endfor %}
      {% endfor %}
    `)

    expect(vars).toEqual(['items', 'items.links', 'items.links.text'])
  })

  it('returns variables in set blocks', () => {
    const vars = extractVariablesFromTemplate(`
      {%- set bar %} {% if params.foo %} {{ params.foo }}{% endif %}{% endset %}
    `)

    expect(vars).toEqual(['foo'])
  })
})
