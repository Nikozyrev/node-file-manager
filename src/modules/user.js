class UserModule {
  #usernameKey = '--username=';

  #username = '';

  constructor() {
    this.#username = this.#findUserName();
  }

  showGreeting() {
    console.log(`Welcome to the File Manager, ${this.#username}!`);
  }

  showGoodbye() {
    console.log(
      `Thank you for using File Manager, ${this.#username}, goodbye!`
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

export const userModule = new UserModule();
