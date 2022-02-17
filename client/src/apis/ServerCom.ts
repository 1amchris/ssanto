//import * as WebSocket from 'ws';


export default class ServerCom {
  host: string;
  port: number;

  client: WebSocket | null;

  messageListeners: Map<string, (data: any) => void>;

  constructor() {
    this.host = '127.0.0.1';
    this.port = 6969;

    this.client = null;

    this.messageListeners = new Map();
    console.log(`ws://${this.host}:${this.port}`)
  }

  open() {
    console.log("open")
    this.client = new WebSocket(`ws://${this.host}:${this.port}`);
    
    
    this.client!.onopen = () => { console.log('Connected'); };

    this.client!.onmessage = (msg: MessageEvent) => {
      console.log(msg.data.toString())  
      var obj = JSON.parse(msg.data.toString());
      console.log('Received: ' + msg.data.toString());
      console.log(obj);

      var callback = this.messageListeners.get(obj.sid);
      if (callback !== undefined) callback(obj.data);
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
    
  writeObject(obj: any)
  {
    this.client?.send(JSON.stringify(obj) + '\0');
  }

  subscribe(subjectId: string, callback: (data: any) => void) {
    this.messageListeners.set(subjectId, callback);
    this.writeObject({
      cmd: 'subscribe',
      sid: subjectId,
    });
  }

  callFunction(functionName: string) {
    this.writeObject({
      cmd: 'callf',
      trg: functionName,
    });
  }

  callMethod(classInstanceName: string, methodName: string) {
    this.writeObject({
      cmd: 'callm',
      instance: classInstanceName,
      method: methodName,
    });
  }

  // TODO: Validate that the 'File' object can be sent directly (instead of a string)
  sendFile(file: File) {
    this.writeObject({
      cmd: 'file',
      data: file,
    });
  }

  // TODO: Handle call that return
}
