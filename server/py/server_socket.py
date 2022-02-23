from copyreg import constructor
import websockets
import asyncio
import json

from . import network_definitions as nd

from .remote_calls import *


class ServerSocket:
    class MethodFunctor:
        def __init__(self, instance, method):
            self.instance = instance
            self.method = method

        def __call__(self, command):
            self.method(self.instance, command)

    class FunctionFunctor:
        def __init__(self, function):
            self.function = function

        def __call__(self, command):
            self.function(command)

    # ------------------------------------------

    def __init__(self, host_address, port):
        self.server_socket = None
        self.host = host_address
        self.port = port

        self.commands_handlers = {}

    def bind_command_m(self, command_name, instance, method):
        self.commands_handlers[command_name] = self.MethodFunctor(instance, method)

    def bind_command_f(self, command_name, function):
        self.commands_handlers[command_name] = self.FunctionFunctor(function)

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

            print(data)

            try:
                obj = json.loads(data)
            except Exception as e:
                print("STDERR", "Unable to loads json", e)
                continue

            try:
                if nd.COMMAND_FIELD in obj:
                    if obj[nd.COMMAND_FIELD] == "callf":
                        eval(obj[nd.TARGET_FIELD] + "()")
                    elif obj[nd.COMMAND_FIELD] == "callm":
                        eval(obj[nd.INSTANCE_FIELD] + "." + obj[nd.METHOD_FIELD] + "()")
                    elif obj[nd.COMMAND_FIELD] in self.commands_handlers:
                        self.commands_handlers[obj[nd.COMMAND_FIELD]](obj)
            except Exception as e:
                print("STDERR", "Unable to call the method/function", e)
                
        print("Disconnect from", websocket.remote_address[0])
                

    def serve(self):
        return websockets.serve(self.handler, self.host, self.port)
