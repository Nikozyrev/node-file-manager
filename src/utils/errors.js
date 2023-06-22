export class InvalidInputError extends Error {
  constructor() {
    super();
    this.message = 'Invalid input';
  }
}

export class NoDirectoryError extends Error {
  constructor() {
    super();
    this.message = 'No such directory';
  }
}
