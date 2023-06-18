import { UserModule } from './user.js';
import { Controller } from './controller.js';

export class App {
  #userModule;
  #controller;

  constructor() {
    this.#userModule = new UserModule();
    this.#controller = new Controller();
  }

  start() {
    this.#userModule.showGreeting();
    this.#controller.askForCommand();
    process.on('exit', () => {
      this.#userModule.showGoodbye();
    });
  }
}
