export function mixOnto (baseClass, ...classes) {
  return classes.reduce((superclass, mixin) => {
    return mixin(superclass)
  }, baseClass)
}
