/**
 * A small subset of EventEmitter from nodejs
 */
export default class EventEmitter<
  EV extends { [key: string]: any[] } = { [key: string]: any[] }
> {
  private _lis: { [k in keyof EV]?: Function[] } = {};
  on<EventType extends keyof EV>(
    event: EventType,
    handler: (...args: EV[EventType]) => void
  ) {
    if (!this._lis[event]) {
      this._lis[event] = [];
    }
    this._lis[event].push(handler);
    return this;
  }
  emit<EventType extends keyof EV>(event: EventType, ...args: EV[EventType]) {
    if (!this._lis[event]) {
      return 0;
    }
    for (let i = 0; i < this._lis[event].length; i++) {
      this._lis[event][i](...args);
    }
    return this._lis[event].length;
  }
  off<EventType extends keyof EV>( event: EventType,
    handler: (...args: EV[EventType]) => void) {
    if (!this._lis[event]) {
      return this;
    }
    this._lis[event].splice(this._lis[event].indexOf(handler), 1);
    return this;
  }
}
