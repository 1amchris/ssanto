import ReceiveData from 'models/server-coms/ReceiveData';
import SendType from 'enums/SendType';

/**
 * Handle the communication between the client and the server
 */
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
  /**
   * @constructor
   */
  constructor() {
    this.subjectListeners = new Map();
    this.callListeners = new Map();
    this.callIdCounter = 0;

    this.messageBuffer = [];
    this.isOpen = false;
  }

  // TODO: there should probably be a "close" method
  /**
   * Initialise the connection with the server
   * @param {string} host The address of the server connection. Default is localhost.
   * @param {int} port The port of the server connection. Default is 6969.
   * @return {void}
   */
  open(host = 'localhost', port = 15649) {
    if (this.client)
      return console.warn(
        'Websocket already connected. Disconnect the active one before reconnecting.'
      );

    this.client = new WebSocket(`ws://${host}:${port}`);
    this.isOpen = false;

    this.client!.onopen = () => this.onOpen();
    this.client!.onmessage = (message: MessageEvent) => this.onMessage(message);
    this.client!.onclose = (evt: CloseEvent) => this.onClose(evt);
  }

  /**
   * Called when the socket open. It send the buffer for commands
   * issued before the connection was open.
   */
  private onOpen() {
    console.log(`Connected to ${this.client!.url}`);

    this.isOpen = true;
    for (const message of this.messageBuffer) {
      this.client!.send(message);
    }
    this.messageBuffer = [];
  }

  /**
   * Called when the socket receive a message.
   * Each message has a type field: SUBJECT, CALL or ERROR.
   * Each message has a data field containing the information relative to the type.
   * @param {MessageEvent} message Message event. Contain the message received from the server.
   */
  private onMessage(message: MessageEvent) {
    const received: ReceiveData = this.convertEventToObject(message);

    // Debug purpose
    // console.log('onMessage subject', received);

    if (received.type === SendType.Subject) {
      this.subjectListeners
        .get(received.data.subject)
        ?.call(null, received.data.data);
    } else if (received.type === SendType.Call) {
      this.callListeners
        .get(received.data.call)
        ?.call(null, true, received.data.data);
      this.callListeners.delete(received.data.call);
    } else if (received.type === SendType.Error) {
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

  /**
   * Called when the socket is closed. It will try to reconnect
   * every second with the server.
   * @param {CloseEvent} evt Close event emitted by the socket.
   */
  private onClose(evt: CloseEvent) {
    console.log('Connection closed with code', evt.code);
    this.isOpen = false;
    this.client = undefined;
    // The connection died in an abnormal way, try to reconnect
    if (evt.code != 1000) {
      setTimeout(() => {
        console.log('Trying to reconnect...');
        this.open();
      }, 1000);
    }
  }

  /**
   * Convert an event data string into a javascript object.
   * @param {MessageEvent} msg The message event containing the data string.
   * @return {any} A javascript object of the corresponding message.
   */
  private convertEventToObject(msg: MessageEvent) {
    return JSON.parse(msg.data.toString());
  }

  /**
   * Write an object into the socket if it is available,
   * otherwise it is appended to the message buffer.
   * @param {any} object A javascript object to be sended.
   */
  private writeObject(object: any) {
    const sendData: string = JSON.stringify(object);
    if (!this.isOpen || !this.client) {
      this.messageBuffer.push(sendData);
    } else {
      this.client.send(sendData);
    }
  }

  // TODO there should probably be an "unsubscribe" method
  /**
   * @callback subscribeCallback
   * @param  {any} data Data received from the server.
   * @return {void}
   */
  /**
   * Subscribe to a subject on the server.
   * @param {string} subject The name of the subject.
   * @param {subscribeCallback} callback The callback that is going to be called.
   * @return {void}
   */
  subscribe(subject: string, callback: (data: any) => void) {
    if (this.subjectListeners.has(subject))
      return console.warn(
        `The variable with Subject Id "${subject}" has already been subscribed to! Unsubscribe before resubscribing.`
      );

    this.subjectListeners.set(subject, callback);
    this.call('subscribe', [subject]);
  }

  /**
   * @callback callCallback
   * @param {boolean} isSuccess If the call was successful or not.
   * @param  {any} data Data received from the server.
   * @return {void}
   */
  /**
   * Send a call to the server.
   * @param {string} target The name of the command.
   * @param {any[]} args An array of data to used as arguments on the server.
   * @param {callCallback} [callback] The callback called when the
   * server return the status of the call. Could be leaved empty.
   */
  call(
    target: string,
    args: any[],
    callback?: (isSuccess: boolean, data: any) => void
  ) {
    const currentCallId = this.callIdCounter++;
    this.send(currentCallId, target, args);

    if (callback !== undefined) this.callListeners.set(currentCallId, callback);
  }

  /**
   * Send an object to the server. It contains the callId, the target,
   * and the arguments used to on the server side callback.
   * @param {int} callId The id of the call. It is unique for each call.
   * @param {string} target The name of the command.
   * @param {any[]} args An array of data to used as arguments on the server.
   */
  private send(callId: number, target: string, args: any[]) {
    this.writeObject({
      call: callId,
      target: target,
      data: args,
    });
  }
}
