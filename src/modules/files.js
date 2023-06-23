import { resolve } from 'path';
import { createReadStream } from 'fs';
import { userCommands } from '../controller/commands.js';
import { FailedOperationError, InvalidInputError } from '../utils/errors.js';

export class FilesModule {
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#subscribe();
  }

  #readFile(path) {
    if (!path) throw new InvalidInputError();
    const currentDir = this.#controller.currentDir;
    const pathToFile = resolve(currentDir, path);
    const stream = createReadStream(pathToFile);
    stream.on('data', (chunk) => console.log(chunk.toString()));
    return new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', () => reject(new FailedOperationError()));
    });
  }

  #subscribe() {
    this.#controller.subscribe(userCommands.cat, (...args) =>
      this.#readFile(...args)
    );
  }
}
