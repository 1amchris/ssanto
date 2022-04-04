import websockets
import asyncio
import json

from files.serializable import Serializable

from .network_definitions import Field, SendType
import traceback


class CallException(Exception):
    pass


# TODO Split command handling and networking from this class
class ServerSocket:
    REQUEST_SUCCEEDED = 0
    REQUEST_FAILED = -1

    class CommandFunctor:
        def __init__(self, callable, allow_return):
            self.callable = callable
            self.allow_return = allow_return

        def __call__(self, arguments):
            code = ServerSocket.REQUEST_SUCCEEDED
            return_data = None
            try:
                return_data = self.callable(*arguments)
                return_data = return_data if self.allow_return else None
            except CallException as e:
                code = ServerSocket.REQUEST_FAILED
                return_data = str(e)

            return code, return_data

    def __init__(self, host_address, port):
        self.server_socket = None
        self.host = host_address
        self.port = port

        self.commands_handlers = {}

    def bind_command(self, command_name, callable, allow_return = True):
        self.commands_handlers[command_name] = self.CommandFunctor(callable, allow_return)

    # Type can be 0: subject update, 1: call return, -1: error (use SendType enum)
    def send(self, send_type, data):
        send_data = {"type": send_type, "data": data}
        json_data = json.dumps(send_data, default=lambda o: o.serialize() if issubclass(type(o), Serializable) else o.__dict__)
        task = self.conn.send(json_data)
        asyncio.create_task(task)

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
                        code, return_data = self.commands_handlers[obj[Field.TARGET.value]](
                            obj[Field.DATA.value])
                        type = SendType.CALL.value if code == ServerSocket.REQUEST_SUCCEEDED else SendType.ERROR.value
                        self.send(
                            type, {"call": obj[Field.CALL_ID.value], "data": return_data})
            except Exception as e:
                print("STDERR", "Unable to call the method/function", e)
                print("STDERR", traceback.format_exc())
                self.send(SendType.ERROR.value, {
                          "call": obj[Field.CALL_ID.value], "data": "Unknown error occured"})

        print("Disconnect from", websocket.remote_address[0])

    def serve(self):
        return websockets.serve(self.handler, self.host, self.port, max_size=None)