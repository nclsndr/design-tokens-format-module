import { JSONValuePath } from './JSONDefinitions.js';

export class ValidationError extends Error {
  type: 'Type' | 'Value';
  path: JSONValuePath;

  constructor({
    message,
    type,
    path,
  }: {
    type: 'Type' | 'Value';
    message: string;
    path: JSONValuePath;
  }) {
    super(message);
    this.type = type;
    this.name = 'ValidationError';
    this.path = path;
  }
}
