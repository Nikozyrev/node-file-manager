import { createInterface } from 'readline/promises';

export class Controller {
  #rl;

  constructor() {
    this.#rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.#rl.on('SIGINT', () => {
      this.#rl.close();
      process.exit();
    });
  }

  async askForCommand() {
    const command = await this.#rl.question('Enter command: ');
    this.executeCommand(command);
  }

  async executeCommand(command) {
    switch (command) {
      case '.exit':
        this.#rl.emit('SIGINT');
        break;

      default:
        console.log('Invalid input');
        break;
    }
    this.askForCommand();
  }
}
