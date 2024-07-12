export class ValidationError extends Error {
  type: 'Type' | 'Value';
  path: Array<string | number>;

  constructor({
    message,
    type,
    path = [],
  }: {
    type: 'Type' | 'Value';
    message: string;
    path?: Array<string | number>;
  }) {
    super(message);
    this.type = type;
    this.name = 'ValidationError';
    this.path = path;
  }
}
