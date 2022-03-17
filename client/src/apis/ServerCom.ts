import ReceiveData from '../models/server-coms/ReceiveData';
import SendType from '../enums/SendType';

export default class ServerCom {
  client?: WebSocket;
  subjectListeners: Map<string, (data: any) => void>;
  callListeners: Map<number, (isSuccess: boolean, data: any) => void>;

  callIdCounter: number;

  messageBuffer: Array<string>;
  isOpen: boolean;

  // TODO: there should probably be a "isOpen" method [returns if the connection is opened]
  // TODO: there should probably be a "isOpening" method [returns if the connection is opening]
  // TODO: there should probably be a "isClosing" method [returns if the connection is closing]
  // TODO: there should probably be a "isClosed" method [returns if the connection is closed]
  // TODO: there should probably be a "onOpened" subject [returns a promise to subscribe to]
  // TODO: there should probably be a "onClosed" subject [returns a promise to subscribe to]
  constructor() {
    this.subjectListeners = new Map();
    this.callListeners = new Map();
    this.callIdCounter = 0;

    this.messageBuffer = [];
    this.isOpen = false;
  }

  // TODO: there should probably be a "close" method
  open(host = 'localhost', port = 6969) {
    if (this.client)
      return console.warn(
        'Websocket already connected. Disconnect the active one before reconnecting.'
      );

    this.client = new WebSocket(`ws://${host}:${port}`);
    this.isOpen = false;

    this.client!.onopen = () => this.onOpen();
    this.client!.onmessage = (message: MessageEvent) => this.onMessage(message);
    this.client!.onclose = () => this.onClose();
  }

  private onOpen() {
    console.log(`Connected to ${this.client!.url}`);

    this.isOpen = true;
    for (let message of this.messageBuffer) {
      this.client!.send(message);
    }
    this.messageBuffer = [];
  }

  private onMessage(message: MessageEvent) {
    let received: ReceiveData = this.convertEventToObject(message);

    // console.log('onMessage subject', received);

    if (received.type === SendType.SUBJECT) {
      this.subjectListeners
        .get(received.data.subject)
        ?.call(null, received.data.data);
    } else if (received.type === SendType.CALL) {
      this.callListeners
        .get(received.data.call)
        ?.call(null, true, received.data.data);
      this.callListeners.delete(received.data.call);
    } else if (received.type === SendType.ERROR) {
      this.callListeners
        .get(received.data.call)
        ?.call(null, false, received.data.data);
      this.callListeners.delete(received.data.call);
    } else {
      console.warn(
        'ServerCom received a message with an unknown type from server.'
      );
    }
  }

  private onClose() {
    console.log('Connection closed');
    this.isOpen = false;
  }

  private convertEventToObject(msg: MessageEvent) {
    return JSON.parse(msg.data.toString());
  }

  private writeObject(object: any) {
    const sendData: string = JSON.stringify(object);
    if (!this.isOpen || !this.client) {
      this.messageBuffer.push(sendData);
    } else {
      this.client.send(sendData);
    }
  }

  // TODO there should probably be an "unsubscribe" method
  subscribe(subject: string, callback: (data: any) => void) {
    if (this.subjectListeners.has(subject))
      return console.warn(
        `The variable with Subject Id "${subject}" has already been subscribed to! Unsubscribe before resubscribing.`
      );

    this.subjectListeners.set(subject, callback);
    this.call('subscribe', [subject]);
  }

  call(
    target: string,
    args: any[],
    callback?: (isSuccess: boolean, data: any) => void
  ) {
    const currentCallId = this.callIdCounter++;
    this.send(currentCallId, target, args);

    if (callback !== undefined) this.callListeners.set(currentCallId, callback);
  }

  private send(callId: number, target: string, args: any[]) {
    this.writeObject({
      call: callId,
      target: target,
      data: args,
    });
  }
}
