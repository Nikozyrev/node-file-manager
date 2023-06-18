import { store } from '../store/index.js';

export const showGreeting = () => {
  const { username } = store;
  console.log(`Welcome to the File Manager, ${username}!`);
};
