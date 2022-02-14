import {Socket} from 'net'
        
export default class Client
{
    host: string;
    port: number;
    messageListeners: Map<string, (data: any)=>void>;
    client: any;

    constructor()
    {
        this.host = '127.0.0.1';
        this.port = 6969;
    
        this.messageListeners = new Map();
    
        this.client = new Socket();
        
        this.client.on('data', (data: Buffer) => {
            
            var obj = JSON.parse(data.toString());
            console.log('Received: ' + data);
            console.log(obj);
            
            if ('sid' in obj)
            {
                var f = this.messageListeners.get(obj.sid);
                if (f !== undefined)
                    f(obj.data);
            }
        });

        this.client.on('close', () => {
            console.log('Connection closed');
        });
    }
    
    open()
    {
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
    
    subscribe(sid: string, callable: (data: any)=>void)
    {
        var obj = {
            cmd: 'subscribe',
            sid: sid
        };
        this.messageListeners.set(sid, callable);
        
        this.client.write(JSON.stringify(obj)+'\0');
    }
    
    callf(name: string)
    {
        var obj = {
            cmd: 'callf',
            trg: name
        };
        this.client.write(JSON.stringify(obj)+'\0');
    }
    
    callm(inst: string, meth: string)
    {
        var obj = {
            cmd: 'callm',
            instance: inst,
            method: meth
        };
        this.client.write(JSON.stringify(obj)+'\0');
    }
    
    sendFile(file: string)
    {
        var obj = {
            cmd: 'file',
            data: file
        };
        this.client.write(JSON.stringify(obj)+'\0');
    }
    
    // TODO: Handle call that return
};
