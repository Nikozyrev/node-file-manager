import { basename, dirname, join, resolve } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { open, rename, unlink, writeFile } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { userCommands } from '../controller/commands.js';
import { FailedOperationError, InvalidInputError } from '../utils/errors.js';

export class FilesModule {
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#subscribe();
  }

  #readFile(path) {
    const pathToFile = this.#getFullPath(path);
    const stream = createReadStream(pathToFile);
    stream.on('data', (chunk) => console.log(chunk.toString()));
    return new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', () => reject(new FailedOperationError()));
    });
  }

  async #createFile(path) {
    const pathToFile = this.#getFullPath(path);
    try {
      await writeFile(pathToFile, '', { flag: 'wx' });
    } catch {
      throw new FailedOperationError();
    }
  }

  async #renameFile(path, newFilename) {
    if (!(path && newFilename)) throw new InvalidInputError();
    const pathToFile = this.#getFullPath(path);
    const newPath = join(dirname(pathToFile), newFilename);
    try {
      await rename(pathToFile, newPath);
    } catch {
      throw new FailedOperationError();
    }
  }

  async #copyFile(path, destination) {
    if (!(path && destination)) throw new InvalidInputError();
    const pathToFile = this.#getFullPath(path);
    const fileName = basename(pathToFile);
    const destPath = this.#getFullPath(join(destination, fileName));

    try {
      const fd = await open(pathToFile);
      const readStream = fd.createReadStream();
      const writeStream = createWriteStream(destPath, { flags: 'wx' });
      return await pipeline(readStream, writeStream);
    } catch {
      throw new FailedOperationError();
    }
  }

  async #moveFile(path, destination) {
    await this.#copyFile(path, destination);
    await this.#deleteFile(path);
  }

  async #deleteFile(path) {
    const pathToFile = this.#getFullPath(path);
    try {
      await unlink(pathToFile);
    } catch {
      throw new FailedOperationError();
    }
  }

  #subscribe() {
    this.#controller.subscribe(userCommands.cat, (...args) =>
      this.#readFile(...args)
    );
    this.#controller.subscribe(userCommands.add, (...args) =>
      this.#createFile(...args)
    );
    this.#controller.subscribe(userCommands.rn, (...args) =>
      this.#renameFile(...args)
    );
    this.#controller.subscribe(userCommands.cp, (...args) =>
      this.#copyFile(...args)
    );
    this.#controller.subscribe(userCommands.mv, (...args) =>
      this.#moveFile(...args)
    );
    this.#controller.subscribe(userCommands.rm, (...args) =>
      this.#deleteFile(...args)
    );
  }

  #getFullPath(path) {
    if (!path) throw new InvalidInputError();
    const currentDir = this.#controller.currentDir;
    const pathToFile = resolve(currentDir, path);
    return pathToFile;
  }
}
