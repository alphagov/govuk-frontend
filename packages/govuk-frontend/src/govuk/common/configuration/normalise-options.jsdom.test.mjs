import { normaliseOptions } from '../configuration.mjs'

describe('normaliseOptions', () => {
  const scopes = [
    {
      name: 'div element',
      $scope: document.createElement('div')
    },
    {
      name: 'article element',
      $scope: document.createElement('article')
    }
  ]

  const handlers = [
    {
      name: 'plain function',
      handler: function errorCallback() {}
    },
    {
      name: 'anonymous function',
      handler: function () {}
    },
    {
      name: 'shorthand function',
      handler() {}
    },
    {
      name: 'arrow function',
      handler: () => {}
    }
  ]

  it('returns defaults', () => {
    expect(normaliseOptions()).toMatchObject({
      scope: document,
      onError: undefined
    })
  })

  it('returns defaults for empty object', () => {
    expect(normaliseOptions({})).toMatchObject({
      scope: document,
      onError: undefined
    })
  })

  it("returns defaults for 'undefined' scope option", () => {
    expect(
      normaliseOptions({
        scope: undefined
      })
    ).toMatchObject({
      scope: document,
      onError: undefined
    })
  })

  it("returns defaults for 'undefined' error handler option", () => {
    expect(
      normaliseOptions({
        onError: undefined
      })
    ).toMatchObject({
      scope: document,
      onError: undefined
    })
  })

  it("returns defaults for 'null' error handler option", () => {
    expect(
      normaliseOptions({
        onError: null
      })
    ).toMatchObject({
      scope: document,
      onError: undefined
    })
  })

  describe('with $scope option', () => {
    it.each(scopes)("normalises '$name' option into object", ({ $scope }) => {
      expect(normaliseOptions({ scope: $scope })).toMatchObject({
        scope: $scope,
        onError: undefined
      })
    })
  })

  describe('with $scope parameter', () => {
    it.each(scopes)(
      "normalises '$name' parameter into object",
      ({ $scope }) => {
        expect(normaliseOptions($scope)).toMatchObject({
          scope: $scope,
          onError: undefined
        })
      }
    )
  })

  describe('with error handler option', () => {
    it.each(handlers)(
      "normalises '$name' option into object",
      ({ handler }) => {
        expect(normaliseOptions({ onError: handler })).toMatchObject({
          scope: document,
          onError: handler
        })
      }
    )
  })

  describe('with error handler parameter', () => {
    it.each(handlers)(
      "normalises '$name' parameter into object",
      ({ handler }) => {
        expect(normaliseOptions(handler)).toMatchObject({
          scope: document,
          onError: handler
        })
      }
    )
  })
})
