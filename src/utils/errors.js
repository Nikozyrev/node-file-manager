export class InvalidInputError extends Error {
  constructor() {
    super();
    this.message = 'Invalid input';
  }
}

export class FailedOperationError extends Error {
  constructor() {
    super();
    this.message = 'Operation failed';
  }
}
