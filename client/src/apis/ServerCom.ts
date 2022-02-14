import * as net from 'net';

export default class ServerCom {
  host: string;
  port: number;

  client: net.Socket;

  messageListeners: Map<string, (data: any) => void>;

  constructor() {
    this.host = '127.0.0.1';
    this.port = 6969;

    this.client = new net.Socket();

    this.messageListeners = new Map();

    this.client.on('data', (data: Buffer) => {
      var obj = JSON.parse(data.toString());
      console.log('Received: ' + data);
      console.log(obj);

      var callback = this.messageListeners.get(obj.sid);
      if (callback !== undefined) callback(obj.data);
    });

    this.client.on('close', () => {
      console.log('Connection closed');
    });
  }

  open() {
    this.client.connect(this.port, this.host, () => {
      console.log('Connected');
    });
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

  subscribe(subjectId: string, callback: (data: any) => void) {
    var object = {
      cmd: 'subscribe',
      sid: subjectId,
    };
    this.messageListeners.set(subjectId, callback);
    this.client.write(JSON.stringify(object) + '\0');
  }

  callFunction(functionName: string) {
    var object = {
      cmd: 'callf',
      trg: functionName,
    };
    this.client.write(JSON.stringify(object) + '\0');
  }

  callMethod(classInstanceName: string, methodName: string) {
    var object = {
      cmd: 'callm',
      instance: classInstanceName,
      method: methodName,
    };
    this.client.write(JSON.stringify(object) + '\0');
  }

  // TODO: Validate that the 'File' object can be sent directly (instead of a string)
  sendFile(file: File) {
    var object = {
      cmd: 'file',
      data: file,
    };
    this.client.write(JSON.stringify(object) + '\0');
  }

  // TODO: Handle call that return
}
