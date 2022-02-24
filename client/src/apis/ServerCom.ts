import { encode as base64encode } from 'base64-arraybuffer';
import FileContentModel from 'models/FileContentModel';

export default class ServerCom {
  client?: WebSocket;
  messageListeners: Map<string, (data: any) => void>;

  messageBuffer: Array<string>;
  isOpen: boolean;

  // TODO: there should probably be a "isOpen" method [returns if the connection is opened]
  // TODO: there should probably be a "isOpening" method [returns if the connection is opening]
  // TODO: there should probably be a "isClosing" method [returns if the connection is closing]
  // TODO: there should probably be a "isClosed" method [returns if the connection is closed]
  // TODO: there should probably be a "onOpened" subject [returns a promise to subscribe to]
  // TODO: there should probably be a "onClosed" subject [returns a promise to subscribe to]
  constructor() {
    this.messageListeners = new Map();
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

    this.client!.onopen = () => {
      console.log(`Connected to ws://${host}:${port}`);

      this.isOpen = true;
      for (let message of this.messageBuffer) {
        this.client!.send(message);
      }
      this.messageBuffer = [];
    };

    this.client!.onmessage = (msg: MessageEvent) => {
      var obj = JSON.parse(msg.data.toString());
      this.messageListeners.get(obj.subject)?.call(null, obj.data);
    };

    this.client!.onclose = () => {
      console.log('Connection closed');
      this.isOpen = false;
    };
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
    if (this.messageListeners.has(subject))
      return console.warn(
        `The variable with Subject Id "${subject}" has already been subscribed to! Unsubscribe before resubscribing.`
      );

    this.messageListeners.set(subject, callback);
    this.call('subscribe', [subject]);
  }

  call(target: string, args: any[]) {
    // In theory, there should only be one type: files or not files,
    //  but I want its more robust that way
    const { files, notFiles } = this.separateFiles(args);
    this.sendAny(target, notFiles);
    this.sendFiles(target, files);
  }

  private separateFiles(args: any[]): { files: File[]; notFiles: any[] } {
    return args.reduce(
      (reducer, arg) => {
        if (arg instanceof FileList) {
          reducer.files = reducer.files.concat(Array.from(arg));
        } else {
          reducer.notFiles.push(arg);
        }
        return reducer;
      },
      { files: [], notFiles: [] }
    );
  }

  private sendAny(target: string, args: any[]) {
    if (args.length > 0)
      this.writeObject({
        target: target,
        data: args,
      });
  }

  private sendFiles(target: string, files: File[]) {
    if (files.length > 0) {
      Promise.all(
        Array.from(files).map(async (file: File) => ({
          name: file.name,
          size: file.size,
          content: await file.arrayBuffer(),
        }))
      )
        .then((contents: FileContentModel[]) =>
          contents.map(({ name: fileName, size: fileSize, content }) => ({
            fileName,
            fileSize,
            base64content: base64encode(content),
          }))
        )
        .then(data => {
          this.writeObject({
            target: `${target}/files`,
            data: data,
          });
        });
    }
  }
}
