function normaliseString(value) {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmedValue = value.trim();
  if (trimmedValue === 'true') {
    return true;
  }
  if (trimmedValue === 'false') {
    return false;
  }
  if (trimmedValue.length > 0 && isFinite(Number(trimmedValue))) {
    return Number(trimmedValue);
  }
  return value;
}
function normaliseDataset(dataset) {
  const out = {};
  for (const [key, value] of Object.entries(dataset)) {
    out[key] = normaliseString(value);
  }
  return out;
}

export { normaliseDataset, normaliseString };
//# sourceMappingURL=normalise-dataset.mjs.map
