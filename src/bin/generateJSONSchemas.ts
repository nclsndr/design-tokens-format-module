import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { URL } from 'node:url';

import { generateStandaloneSchema } from '../schemas/generate.js';
import {
  allTokenJSONSchemas,
  allTokenValueJSONSchemas,
} from '../schemas/tokens.js';
import { JSON_SCHEMA_BASE_URI } from '../schemas/constants.js';

const moduleRoot = resolve(new URL('.', import.meta.url).pathname, '..', '..');

const generatedDirPath = resolve(moduleRoot, 'generated');
if (!existsSync(generatedDirPath)) {
  mkdirSync(generatedDirPath, { recursive: true });
}

/* ------------------------------------------
   Tokens
--------------------------------------------- */
console.log('Generate JSON schemas for tokens');
allTokenJSONSchemas
  .map((schema) => generateStandaloneSchema(schema))
  .forEach((schema) => {
    console.log('Generate schema for:', schema.$id);

    // assuming the $id is like: https://designtokens.org/schemas/tokens/color
    const pathItems = schema.$id
      .replaceAll(JSON_SCHEMA_BASE_URI, '')
      .split('/');
    const tail = pathItems.pop();

    const path = resolve(generatedDirPath, ...pathItems);
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    writeFileSync(
      resolve(path, `${tail}.json`),
      JSON.stringify(schema, null, 2),
    );
  });

/* ------------------------------------------
   Token values
--------------------------------------------- */
console.log('Generate JSON schemas for token values');
allTokenValueJSONSchemas
  .map((schema) => generateStandaloneSchema(schema))
  .forEach((schema) => {
    console.log('Generate schema for:', schema.$id);

    // assuming the $id is like: https://designtokens.org/schemas/tokens/color
    const pathItems = schema.$id
      .replaceAll(JSON_SCHEMA_BASE_URI, '')
      .split('/');
    const tail = pathItems.pop();

    const path = resolve(generatedDirPath, ...pathItems);
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    writeFileSync(
      resolve(path, `${tail}.json`),
      JSON.stringify(schema, null, 2),
    );
  });
