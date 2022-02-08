import signal
import sys

import time

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

if __name__ == "__main__":
    try:
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
        
        ss.bind_command_m("subscribe", sm, SubjectsManager.subscribe)
        ss.bind_command_m("unsubscribe", sm, SubjectsManager.unsubscribe)
        
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
        raise e

    
