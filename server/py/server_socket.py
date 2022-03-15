import websockets
import asyncio
import json

from .network_definitions import Field, SendType
import traceback


class CallException(Exception):
    pass


# TODO Split command handling and networking from this class
class ServerSocket:
    REQUEST_SUCCEEDED = 0
    REQUEST_FAILED = -1

    class CommandFunctor:
        def __init__(self, callable):
            self.callable = callable

        def __call__(self, arguments):
            code = ServerSocket.REQUEST_SUCCEEDED
            return_data = None
            try:
                return_data = self.callable(*arguments)
            except CallException as e:
                code = ServerSocket.REQUEST_FAILED
                return_data = str(e)

            return code, return_data

    def __init__(self, host_address, port):
        self.server_socket = None
        self.host = host_address
        self.port = port

        self.commands_handlers = {}

    def bind_command(self, command_name, callable):
        self.commands_handlers[command_name] = self.CommandFunctor(callable)

    # Type can be 0: subject update, 1: call return, -1: error (use SendType enum)
    def send(self, type, data):
        send_data = {"type": type, "data": data}
        asyncio.create_task(self.conn.send(json.dumps(send_data, default=lambda o: o.__dict__)))

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
                        code, return_data = self.commands_handlers[obj[Field.TARGET.value]](obj[Field.DATA.value])
                        type = SendType.CALL.value if code == ServerSocket.REQUEST_SUCCEEDED else SendType.ERROR.value
                        self.send(type, {"call": obj[Field.CALL_ID.value], "data": return_data})
            except Exception as e:
                print("STDERR", "Unable to call the method/function", e)
                print("STDERR", traceback.format_exc())
                self.send(SendType.ERROR.value, {"call": obj[Field.CALL_ID.value], "data": "Unknown error occured"})

        print("Disconnect from", websocket.remote_address[0])

    def serve(self):
        return websockets.serve(self.handler, self.host, self.port)
