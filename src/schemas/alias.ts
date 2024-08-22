import { withBaseURI } from './internals/withBaseURI.js';

export const aliasValuePattern = '^\\{[a-zA-Z0-9_\\-\\.]+\\}$';
export const aliasValueJSONSchema = {
  $id: withBaseURI('/alias/value'),
  title: 'Alias value',
  description:
    'A path to a value in the design token tree. Example: "{colors.primary}".',
  type: 'string',
  pattern: aliasValuePattern,
};
