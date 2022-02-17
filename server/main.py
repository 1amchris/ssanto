import signal
import sys

import time

import asyncio

from py.logger import *
from py.server_socket import ServerSocket
from py.subjects_manager import SubjectsManager

class AClass:
    def __init__(self):
        self.attribute = "myString"
    def method(self):
        print("This method was called from javascript and contain", self.attribute)
    
def function():
    print("This function was called from javascript");
    
    
    
class FileManager:
    def __init__(self):
        pass
        
    def receive_file(self, cmd):
        print("Receive file\n", cmd['data'])
        

class Parameters:
    def __init__(self):
        pass

async def main():
    ss = ServerSocket("localhost", 6969)

    sm = SubjectsManager(ss)
    myVar = sm.create('myVar', 1)
    
    ss.bind_command_m("subscribe", sm, SubjectsManager.subscribe)
    ss.bind_command_m("unsubscribe", sm, SubjectsManager.unsubscribe)

    async with ss.serve():
        await asyncio.sleep(5)
        print("edit myVar")
        await myVar.notify(2)
        await asyncio.Future()  # run forever
    


if __name__ == "__main__":
    print("Hello from python")
    
    asyncio.run(main())
    '''try:
        print("Hello from python")
            
        ss = ServerSocket("localhost", 6969)
        def signalHandler(signal, frame):
            ss.close()
            ss.join()
            sys.exit(1)
        signal.signal(signal.SIGTERM, signalHandler)
        signal.signal(signal.SIGINT, signalHandler)
        
        sm = SubjectsManager(ss)
        myVar = sm.create('myVar', 1)
        
        parameters = sm.create('parameters', [])
        
        ss.bind_command_m("subscribe", sm, SubjectsManager.subscribe)
        ss.bind_command_m("unsubscribe", sm, SubjectsManager.unsubscribe)
        
        
        fm = FileManager()
        ss.bind_command_m("file", fm, FileManager.receive_file)
        
        ###
        #ss.bind_command_f("callf", function)
        #a_class = AClass()
        #ss.bind_command_m("callm", a_class, AClass.method)
        ###
        
        if ss.open():
            print("Unable to open server socket")
            sys.exit(1)
            
        ss.run()
        
        time.sleep(3)
        print("edit myVar")
        myVar.notify(2)
        
        ss.join()
        ss.close()
    except Exception as e:      
        ss.close()
        ss.join()
        raise e'''

    
