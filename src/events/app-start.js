import { EventEmitter } from 'events';
import { EVENT_NAMES } from '../constants/event-names.js';
import { userModule } from '../modules/user.js';

const startEvent = new EventEmitter();

startEvent.on(EVENT_NAMES.APP_START, () => {
  userModule.showGreeting();
});

const startApp = () => {
  startEvent.emit(EVENT_NAMES.APP_START);
};

export { startApp };
