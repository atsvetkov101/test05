import { EventEmitter } from 'events';

export const APP_EVENTS = {
  INITIALIZED: 'initialized',
  START_GAME: 'start_game',
};

/**
 * Служит для обмена сообщениями в приложении.
 * */
class AppEventProcessor extends EventEmitter {
  constructor() {
    super();
    console.log('Application event processor created');
  }
}

// Service to proxy event handler callback setting right context (this)
// eslint-disable-next-line func-names
export const proxy = function (fun, context, ...args) {
  // eslint-disable-next-line func-names
  return function () { return fun.apply(context, args); };
};

export default AppEventProcessor;
