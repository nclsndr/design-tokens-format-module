import { JSONPath } from './JSONPath.js';

export type Reference = {
  state: 'unresolved' | 'unresolvable' | 'resolved';
  from: {
    treePath: JSONPath;
    valuePath: JSONPath;
  };
  to: {
    treePath: JSONPath;
  };
};

export function createReference(
  from: {
    treePath: JSONPath;
    valuePath: JSONPath;
  },
  to: {
    treePath: JSONPath;
  },
): Reference {
  return {
    state: 'unresolved',
    from,
    to,
  };
}

// export class Reference {
//   #from: {
//     treePath: JSONPath;
//     valuePath: JSONPath;
//   };
//   #to: {
//     treePath: JSONPath;
//   }
//
//   constructor(
//     from: {
//       treePath: JSONPath;
//       valuePath: JSONPath;
//     },
//     to: {
//       treePath: JSONPath;
//     }) {
//     this.#from = from;
//     this.#to = to;
//   }
//
//   get from() {
//     return this.#from;
//   }
//   get to() {
//     return this.#to;
//   }
// }
