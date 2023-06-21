import { EventEmitter } from 'events';
import { createInterface } from 'readline/promises';
import { appEvents } from '../app/app-events.js';

export class Controller {
  #commandsEmitter;
  #rl;

  constructor() {
    this.#commandsEmitter = new EventEmitter();

    this.#rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.#rl.on('SIGINT', () => {
      this.#rl.close();
      process.exit();
    });
  }

  subscribe(command, listener) {
    this.#commandsEmitter.addListener(command, async (...args) => {
      await listener(...args);
      this.askForCommand();
    });
  }

  async askForCommand() {
    process.emit(appEvents.askForCommand);
    const userInput = await this.#rl.question('Enter command: ');
    const [command, ...args] = userInput.split(' ');
    this.#executeCommand(command, args);
  }

  #executeCommand(command, args) {
    const listenersExist = this.#commandsEmitter.emit(command, ...args);
    if (!listenersExist) {
      console.log('Invalid input');
      this.askForCommand();
    }
  }
}
