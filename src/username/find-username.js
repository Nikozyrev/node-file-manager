import { store } from '../store/index.js';

export const findUserName = () => {
  const usernameKey = '--username=';
  const usernameArg = process.argv.find((arg) => arg.startsWith(usernameKey));
  if (!usernameArg) throw new Error('User name is not provided.');
  const username = usernameArg.replace(usernameKey, '');
  store.username = username;
  return username;
};
