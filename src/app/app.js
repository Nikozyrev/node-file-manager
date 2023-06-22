import { UserModule } from '../modules/user.js';
import { Controller } from '../controller/controller.js';
import { OsModule } from '../modules/os.js';
import { NavigationModule } from '../modules/navigation.js';
import { ExitModule } from '../modules/exit.js';

export class App {
  #controller;
  #userModule;
  #osModule;
  #navModule;
  #exitModule;

  constructor() {
    this.#controller = new Controller();
    this.#userModule = new UserModule();
    this.#osModule = new OsModule();
    this.#navModule = new NavigationModule(
      this.#controller,
      this.#osModule.getHomeDir()
    );
    this.#exitModule = new ExitModule(this.#controller);
  }

  start() {
    this.#userModule.showGreeting();
    this.#controller.askForCommand();
  }
}
