import { describe, it, expect } from 'vitest';

import { allTokenJSONSchemas } from '../../src/schemas/tokens';

import { generateStandaloneSchema } from '../../src/schemas/generate';

describe('generateStandaloneSchema', () => {
  it('Should generate standalone schemas for token types', () => {
    const all = allTokenJSONSchemas.map((schema) =>
      generateStandaloneSchema(schema),
    );
    expect(all).toMatchSnapshot();
  });
});
