import { appEvents } from './app-events.js';
import { Controller } from '../controller/controller.js';
import { UserModule } from '../modules/user.js';
import { OsModule } from '../modules/os.js';
import { NavigationModule } from '../modules/navigation.js';
import { ExitModule } from '../modules/exit.js';
import { FilesModule } from '../modules/files.js';
import { HashModule } from '../modules/hash.js';
import { CompressModule } from '../modules/compress.js';

export class App {
  #controller;
  #userModule;
  #osModule;
  #navModule;
  #exitModule;
  #filesModule;
  #hashModule;
  #compressModule;

  constructor() {
    this.#controller = new Controller();
    this.#userModule = new UserModule();
    this.#osModule = new OsModule(this.#controller);
    this.#navModule = new NavigationModule(this.#controller);
    this.#exitModule = new ExitModule(this.#controller);
    this.#filesModule = new FilesModule(this.#controller);
    this.#hashModule = new HashModule(this.#controller);
    this.#compressModule = new CompressModule(this.#controller);
  }

  start() {
    process.emit(appEvents.start);
  }
}
