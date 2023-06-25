import { basename, join, resolve } from 'path';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { userCommands } from '../controller/commands.js';
import { FailedOperationError, InvalidInputError } from '../utils/errors.js';

export class CompressModule {
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#subscribe();
  }

  async #compressFile(path, destination) {
    if (!path) throw new InvalidInputError();
    const currentDir = this.#controller.currentDir;
    const pathToFile = resolve(currentDir, path);
    const fileName = basename(pathToFile);
    const destPath = resolve(currentDir, join(destination, `${fileName}.br`));
    try {
      const source = createReadStream(pathToFile);
      const destination = createWriteStream(destPath);
      const compress = createBrotliCompress();
      await pipeline(source, compress, destination);
    } catch {
      throw new FailedOperationError();
    }
  }

  async #decompressFile(path, destination) {
    if (!path) throw new InvalidInputError();
    const currentDir = this.#controller.currentDir;
    const pathToFile = resolve(currentDir, path);
    const fileName = basename(pathToFile, '.br');
    const destPath = resolve(currentDir, join(destination, fileName));
    try {
      const source = createReadStream(pathToFile);
      const destination = createWriteStream(destPath);
      const compress = createBrotliDecompress();
      await pipeline(source, compress, destination);
    } catch {
      throw new FailedOperationError();
    }
  }

  #subscribe() {
    this.#controller.subscribe(userCommands.compress, (...args) =>
      this.#compressFile(...args)
    );
    this.#controller.subscribe(userCommands.decompress, (...args) =>
      this.#decompressFile(...args)
    );
  }
}
