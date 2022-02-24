import websockets
import asyncio
import json

from .network_definitions import Field


class ServerSocket:
    def __init__(self, host_address, port):
        self.server_socket = None
        self.host = host_address
        self.port = port

        self.commands_handlers = {}

    def bind_command(self, command_name, callable):
        self.commands_handlers[command_name] = callable

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
                if obj[Field.TARGET.value] in self.commands_handlers:
                    if Field.DATA.value in obj:
                        self.commands_handlers[obj[Field.TARGET.value]](*obj[Field.DATA.value])
            except Exception as e:
                print("STDERR", "Unable to call the method/function", e)

        print("Disconnect from", websocket.remote_address[0])
                

    def serve(self):
        return websockets.serve(self.handler, self.host, self.port)
