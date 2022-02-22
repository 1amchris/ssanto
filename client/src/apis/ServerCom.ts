import { encode as base64encode } from 'base64-arraybuffer';

class Commands {
  static Subscribe = new Commands('subscribe');
  static CallFunction = new Commands('callf');
  static CallMethod = new Commands('callm');
  static SendFile = new Commands('file');

  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

export default class ServerCom {
  client?: WebSocket;
  messageListeners: Map<string, (data: any) => void>;

  // TODO: there should probably be a "isOpen" method [returns if the connection is opened]
  // TODO: there should probably be a "isOpening" method [returns if the connection is opening]
  // TODO: there should probably be a "isClosing" method [returns if the connection is closing]
  // TODO: there should probably be a "isClosed" method [returns if the connection is closed]
  // TODO: there should probably be a "onOpened" subject [returns a promise to subscribe to]
  // TODO: there should probably be a "onClosed" subject [returns a promise to subscribe to]
  constructor() {
    this.messageListeners = new Map();
  }

  // TODO: there should probably be a "close" method
  open(host = 'localhost', port = 6969) {
    if (this.client)
      return console.warn(
        'Websocket already connected. Disconnect the active one before reconnecting.'
      );

    this.client = new WebSocket(`ws://${host}:${port}`);

    this.client!.onopen = () => {
      console.log(`Connected to ws://${host}:${port}`);
    };

    this.client!.onmessage = (msg: MessageEvent) => {
      var obj = JSON.parse(msg.data.toString());
      this.messageListeners.get(obj.sid)?.call(null, obj.data);
    };

    this.client!.onclose = () => {
      console.log('Connection closed');
    };
  }

  /*send(varName)
    {
        this.client.write('get ' + varName);
        return new Promise((resolve, reject) => {
            this.client.once('data', (data) => {
                var obj = JSON.parse(data);
                resolve(obj.data);
            });
        });
    }*/

  private writeObject(object: any) {
    this.client?.send(JSON.stringify(object) + '\0');
  }

  // TODO there should probably be an "unsubscribe" method
  subscribe(subjectId: string, callback: (data: any) => void) {
    if (this.messageListeners.has(subjectId))
      return console.warn(
        `The variable with Subject Id "${subjectId}" has already been subscribed to! Unsubscribe before resubscribing.`
      );

    this.messageListeners.set(subjectId, callback);
    this.writeObject({
      cmd: Commands.Subscribe.name,
      sid: subjectId,
    });
  }

  callFunction(functionName: string) {
    this.writeObject({
      cmd: Commands.CallFunction.name,
      trg: functionName,
    });
  }

  callMethod(classInstanceName: string, methodName: string) {
    this.writeObject({
      cmd: Commands.CallMethod.name,
      instance: classInstanceName,
      method: methodName,
    });
  }

  sendFiles(files: FileList, command: string) {
    Promise.all(Array.from(files).map((file: File) => file.arrayBuffer()))
      .then((contents: ArrayBuffer[]) =>
        contents.map((content, index) => ({
          fileName: files[index].name,
          fileSize: files[index].size,
          base64content: base64encode(content),
        }))
      )
      .then(data =>
        this.writeObject({
          cmd: command || Commands.SendFile.name,
          data,
        })
      );
  }

  // TODO: Handle call that return
}
