import { userCommands } from '../controller/commands.js';

export class ExitModule {
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#subscribe();
  }

  #exit() {
    process.exit();
  }

  #subscribe() {
    this.#controller.subscribe(userCommands['.exit'], () => this.#exit());
  }
}
