import { describe, it, expect } from 'vitest';
import Ajv from 'ajv/dist/2020';

import { allJSONSchemas } from '../../src/schemas/all';
import { withBaseURI } from '../../src/schemas/internals/withBaseURI';

describe('group schema', () => {
  it('should execute', () => {
    const ajv = new Ajv({
      schemas: allJSONSchemas,
    });

    const validate = ajv.getSchema(withBaseURI('/tokenTree'));
    if (!validate) {
      throw new Error('Schema not found');
    }

    const data = {
      colors: {
        $type: 'color',
        // TODO: This should fail the test
        anInvalidColor: {
          $value: 'invalid',
        },
        blue: {
          $type: 'color',
          $value: '#0000ff',
        },
      },
      dimensions: {
        small: {
          $type: 'dimension',
          $value: '4px',
        },
      },
      fontFamilies: {
        $type: 'fontFamily',
        inter: {
          $value: 'Inter',
        },
      },
    };

    const valid = validate(data);
    if (!valid) console.log(validate.errors);

    expect(valid).toBe(true);
  });
});
