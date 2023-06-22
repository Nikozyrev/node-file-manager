import { dirname, resolve } from 'path';
import { access, readdir } from 'fs/promises';
import { userCommands } from '../controller/commands.js';
import { appEvents } from '../app/app-events.js';
import { InvalidInputError, NoDirectoryError } from '../utils/errors.js';

export class NavigationModule {
  #controller;
  #currentDir = '';

  constructor(controller, defaultDir) {
    this.#controller = controller;
    this.#currentDir = defaultDir ?? '';
    this.#subscribe();
  }

  #goUp() {
    const newPath = dirname(this.#currentDir);
    this.#currentDir = newPath;
  }

  async #goToPath(path) {
    if (!path) throw new InvalidInputError();
    const newPath = resolve(this.#currentDir, path);

    const hasAccess = await this.#hasPathAccess(newPath);
    if (!hasAccess) throw new NoDirectoryError();

    this.#currentDir = newPath;
  }

  async #list() {
    const list = await readdir(this.#currentDir, { withFileTypes: true });
    const listWithTypes = list.reduce((acc, dirent) => {
      const isFile = dirent.isFile();
      const isDir = dirent.isDirectory();
      if (isDir || isFile) {
        return [
          ...acc,
          {
            Name: dirent.name,
            Type: isDir ? 'directory' : 'file',
          },
        ];
      }
      return acc;
    }, []);
    const result = listWithTypes.sort((a, b) => {
      if (a.Type === b.Type) {
        return a.Name.localeCompare(b.Name);
      }
      return a.Type === 'file' ? 1 : -1;
    });
    console.table(result);
  }

  #printCurrentDir() {
    console.log(`You are currently in ${this.#currentDir}`);
  }

  async #hasPathAccess(path) {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }

  #subscribe() {
    process.on(appEvents.askForCommand, () => this.#printCurrentDir());
    this.#controller.subscribe(userCommands.up, () => this.#goUp());
    this.#controller.subscribe(userCommands.cd, (...args) =>
      this.#goToPath(...args)
    );
    this.#controller.subscribe(userCommands.ls, () => this.#list());
  }
}
