import { extractConfigByNamespace } from './index.mjs';
import { normaliseString } from './normalise-string.mjs';

function normaliseDataset(Component, dataset) {
  const out = {};
  for (const [field, property] of Object.entries(Component.schema.properties)) {
    if (field in dataset) {
      out[field] = normaliseString(dataset[field], property);
    }
    if ((property == null ? void 0 : property.type) === 'object') {
      out[field] = extractConfigByNamespace(Component, dataset, field);
    }
  }
  return out;
}

export { normaliseDataset };
//# sourceMappingURL=normalise-dataset.mjs.map
