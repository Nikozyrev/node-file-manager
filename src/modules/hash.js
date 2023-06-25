import { resolve } from 'path';
import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { userCommands } from '../controller/commands.js';
import { FailedOperationError, InvalidInputError } from '../utils/errors.js';

export class HashModule {
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#subscribe();
  }

  async #logFileHash(path) {
    if (!path) throw new InvalidInputError();
    const currentDir = this.#controller.currentDir;
    const pathToFile = resolve(currentDir, path);
    try {
      const fileBuffer = await readFile(pathToFile);

      const hashSum = createHash('sha256');
      hashSum.update(fileBuffer);

      const hex = hashSum.digest('hex');

      console.log(hex);
    } catch {
      throw new FailedOperationError();
    }
  }

  #subscribe() {
    this.#controller.subscribe(userCommands.hash, (...args) =>
      this.#logFileHash(...args)
    );
  }
}
