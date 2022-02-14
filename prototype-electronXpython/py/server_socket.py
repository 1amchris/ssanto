import socket
import threading
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
        
        self.client_thread = threading.Thread(target=self.recv, args=())
        
        self.commands_handlers = {}
        
    def open(self):
        for res in socket.getaddrinfo(self.host, self.port, socket.AF_INET,
                                      socket.SOCK_STREAM, 0, socket.AI_PASSIVE):
            af, socktype, proto, canonname, sa = res
            try:
                self.server_socket = socket.socket(af, socktype, proto)
            except OSError as msg:
                self.server_socket = None
                continue
            try:
                self.server_socket.bind(sa)
                self.server_socket.listen(1)
            except OSError as msg:
                self.server_socket.close()
                self.server_socket = None
                continue
            break
            
        if self.server_socket is None:
            return -1
            
        return 0
            
    def close(self):
        self.server_socket.close()
    
    # TODO: Handle error in case of crash in the thread
    def recv(self):
        with self.conn:            
            MAX_PACKAGE_SIZE = 2048
            while True:
                data = self.conn.recv(MAX_PACKAGE_SIZE)
                
                if data == b'':
                    return
                
                # TODO: Handle big file problem
                
                jsons_data = data.decode().split('\0')
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
                          
                    
                
    def bind_command_m(self, cmd_type, instance, method):
        self.commands_handlers[cmd_type] = self.CmdMethodFunctor(instance, method)
        
    def bind_command_f(self, cmd_type, function):
        self.commands_handlers[cmd_type] = self.FunctionFunctor(function)
    
    # Data must have to_dict() method implemented
    def send(self, data):
        self.conn.send(json.dumps(data.to_dict()).encode())    
        
    def run(self):
        self.conn, addr = self.server_socket.accept()
        print('Connected by', addr)
        
        self.client_thread.start()
        
    def join(self):
        if self.client_thread.is_alive():
            self.client_thread.join()        
            
    

    
