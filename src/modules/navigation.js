import { dirname, resolve } from 'path';
import { access } from 'fs/promises';
import { userCommands } from '../controller/commands.js';
import { appEvents } from '../app/app-events.js';

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
    const newPath = resolve(this.#currentDir, path);
    if (await this.#hasPathAccess(newPath)) {
      this.#currentDir = newPath;
    } else {
      console.error('No such directory.');
    }
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
  }
}
