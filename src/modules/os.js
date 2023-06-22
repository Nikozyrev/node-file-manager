import { homedir } from 'os';
import { appEvents } from '../app/app-events.js';

export class OsModule {
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#subscribe();
  }

  #getHomeDir() {
    return homedir();
  }

  #subscribe() {
    process.on(appEvents.start, () => {
      this.#controller.currentDir = this.#getHomeDir();
    });
  }
}
