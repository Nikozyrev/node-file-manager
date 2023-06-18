export class UserModule {
  #usernameKey = '--username=';

  #username = '';

  constructor() {
    this.#username = this.#findUserName();
  }

  showGreeting() {
    console.log(`\nWelcome to the File Manager, ${this.#username}!\n`);
  }

  showGoodbye() {
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
}
