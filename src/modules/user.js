import { appEvents } from '../app/app-events.js';

export class UserModule {
  #usernameKey = '--username=';

  #username = '';

  constructor() {
    this.#username = this.#findUserName();
    this.#subscribe();
  }

  #showGreeting() {
    console.log(`\nWelcome to the File Manager, ${this.#username}!\n`);
  }

  #showGoodbye() {
    console.log(
      `\nThank you for using File Manager, ${this.#username}, goodbye!`
    );
  }

  #findUserName() {
    const usernameArg = process.argv.find((arg) =>
      arg.startsWith(this.#usernameKey)
    );
    if (!usernameArg) throw new Error('User name is not provided.');
    const username = usernameArg.replace(this.#usernameKey, '');
    return username;
  }

  #subscribe() {
    process.on(appEvents.start, () => {
      this.#showGreeting();
    });
    process.on('exit', () => {
      this.#showGoodbye();
    });
  }
}
