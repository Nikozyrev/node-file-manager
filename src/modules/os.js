import { EOL, arch, cpus, homedir, userInfo } from 'os';
import { appEvents } from '../app/app-events.js';
import { userCommands } from '../controller/commands.js';
import { FailedOperationError, InvalidInputError } from '../utils/errors.js';

export class OsModule {
  #params = {
    EOL: '--EOL',
    cpus: '--cpus',
    homedir: '--homedir',
    username: '--username',
    architecture: '--architecture',
  };
  #controller;

  constructor(controller) {
    this.#controller = controller;
    this.#subscribe();
  }

  #getEOL() {
    return EOL;
  }

  #getCPUs() {
    const cpusInfo = cpus();

    return {
      amount: cpusInfo.length,
      cpus: cpusInfo.map(({ model, speed }) => ({
        model,
        speed: `${speed / 1000} GHz`,
      })),
    };
  }

  #getHomeDir() {
    return homedir();
  }

  #getUsername() {
    try {
      return userInfo().username;
    } catch {
      throw new FailedOperationError();
    }
  }

  #getArchitecture() {
    return arch();
  }

  #logOsData(param) {
    let data;
    switch (param) {
      case this.#params.EOL:
        data = this.#getEOL();
        break;
      case this.#params.cpus:
        data = this.#getCPUs();
        break;
      case this.#params.homedir:
        data = this.#getHomeDir();
        break;
      case this.#params.username:
        data = this.#getUsername();
        break;
      case this.#params.architecture:
        data = this.#getArchitecture();
        break;
      default:
        throw new InvalidInputError();
    }
    console.log(data);
  }

  #subscribe() {
    process.on(appEvents.start, () => {
      this.#controller.currentDir = this.#getHomeDir();
    });
    this.#controller.subscribe(userCommands.os, (...args) =>
      this.#logOsData(...args)
    );
  }
}
