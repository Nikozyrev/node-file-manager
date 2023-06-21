import { UserModule } from '../modules/user.js';
import { Controller } from '../controller/controller.js';
import { OsModule } from '../modules/os.js';
import { NavigationModule } from '../modules/navigation.js';

export class App {
  #controller;
  #userModule;
  #osModule;
  #navModule;

  constructor() {
    this.#controller = new Controller();
    this.#userModule = new UserModule();
    this.#osModule = new OsModule();
    this.#navModule = new NavigationModule(
      this.#controller,
      this.#osModule.getHomeDir()
    );
  }

  start() {
    this.#userModule.showGreeting();
    this.#controller.askForCommand();
    process.on('exit', () => {
      this.#userModule.showGoodbye();
    });
  }
}
