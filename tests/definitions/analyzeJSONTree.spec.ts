import { describe, it, expect } from 'vitest';
import { analyzeJSONTree } from '../../src/parser/analyzeJSONTree';

describe.concurrent('analyzeTree', () => {
  it.only('should parse a simple token tree with groups and tokens', () => {
    const tree = {
      someColors: {
        $type: 'color',
        red: {
          $type: 'cc',
          $value: '#ff0000',
        },
        orange: {
          $type: 'oo',
          $value: '#ff7f00',
        },
        blue: {
          $value: '#0000ff',
        },
      },
      someNumbers: {
        $type: 'number',
        one: {
          $type: 'dimension',
          $value: '12px',
        },
        two: {
          $value: 44,
        },
        three: {
          $value: '{someNumbers.two}',
        },
      },
    };

    const result = analyzeJSONTree(tree);

    // TODO @Nico: NO CONSOLE

    if (result.isOk()) {
      expect(JSON.stringify(result.get(), null, 2)).toMatchSnapshot();
    }
  });
});
