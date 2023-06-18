import { EventEmitter } from 'events';
import { EVENT_NAMES } from '../constants/event-names.js';
import { findUserName } from '../username/find-username.js';
import { showGreeting } from '../username/show-greeting.js';

const startEvent = new EventEmitter();

startEvent.on(EVENT_NAMES.APP_START, () => {
  findUserName();
  showGreeting();
});

const startApp = () => {
  startEvent.emit(EVENT_NAMES.APP_START);
};

export { startApp };
