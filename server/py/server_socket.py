import websockets
import asyncio
import json

class AClass:
    def __init__(self):
        self.attribute = "myString"
    def method(self):
        print("This method was called from javascript and contain", self.attribute)

a_class = AClass()

def function():
    print("This function was called from javascript");
    

class ServerSocket:
    class CmdMethodFunctor:
        def __init__(self, instance, method):
            self.instance = instance
            self.method = method
        def __call__(self, cmd):
            self.method(self.instance, cmd)
    
    class MethodFunctor:
        def __init__(self, instance, method):
            self.instance = instance
            self.method = method
        def __call__(self, cmd):
            self.method(self.instance)
            
    class FunctionFunctor:
        def __init__(self, function):
            self.function = function
        def __call__(self, cmd):
            self.function()
            
    # ------------------------------------------

    def __init__(self, host_address, port):
        self.server_socket = None
        self.host = host_address
        self.port = port
        
        self.commands_handlers = {} 
                    
                
    def bind_command_m(self, cmd_type, instance, method):
        self.commands_handlers[cmd_type] = self.CmdMethodFunctor(instance, method)
        
    def bind_command_f(self, cmd_type, function):
        self.commands_handlers[cmd_type] = self.FunctionFunctor(function)
    
    # Data must have to_dict() method implemented
    def send(self, data):
        asyncio.create_task(self.conn.send(json.dumps(data.to_dict())))

    async def handler(self, websocket):
        print("Connection from", websocket.remote_address[0])

        self.conn = websocket
        while True:
            try:
                data = await websocket.recv()
            except websockets.ConnectionClosedOK:
                break
            
            jsons_data = data.split('\0')
            jsons_data.pop()
            
            for json_data in jsons_data:
                print(json_data)
                try:
                    obj = json.loads(json_data)
                    try:
                        if 'cmd' in obj:
                            if obj['cmd'] == 'callf':
                                eval(obj['trg'] + '()')
                            elif obj['cmd'] == 'callm':
                                eval(obj['instance'] + '.' + obj['method'] + '()')
                            if obj['cmd'] in self.commands_handlers:
                                self.commands_handlers[obj['cmd']](obj)
                    except Exception as e:
                        print("STDERR", e)
                except Exception as e:
                    print("STDERR", e)
    

    def serve(self):
        return websockets.serve(self.handler, self.host, self.port)
            
    

    
