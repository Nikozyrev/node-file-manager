import { homedir } from 'os';

export class OsModule {
  constructor() {}

  getHomeDir() {
    return homedir();
  }
}
