import signal

import asyncio
from base64 import b64decode
import geopandas
import fiona
import json

from py.logger import *
from py.server_socket import ServerSocket
from py.subjects_manager import SubjectsManager


class AClass:
    def __init__(self):
        self.attribute = "myString"
    def method(self):
        print("This method was called from javascript and contain", self.attribute)
    
def function():
    print("This function was called from javascript")
    
    
class FileManager:
    def __init__(self):
        pass
        
    def receive_files(self, cmd):
        files = cmd['data']
        for file in files:
            with open(file['fileName'], 'bw') as f:
                f.write(b64decode(file['base64content']))
        
        shapefiles = [
            (name.rstrip(f'.{ext}'), ext) 
            for name, ext in [
                (file['fileName'], file['fileName'].split('.')[-1])
                for file in files
            ]
            if ext == 'shp'
        ]
        for shapefile, ext in shapefiles:
            try:
                with fiona.collection(f'{shapefile}.{ext}') as source:
                    my_layer = {
                        "type": "FeatureCollection",
                        "features": list(source),
                    }

                with open(f"{shapefile}.geojson", "w") as f:
                    f.write(json.dumps(my_layer))
            
                # and now we've got a geojson file with the same filename
            except Exception as e:
                # TODO: handle imported shapefile error
                print("STDERR", 'Shapefile is missing complementary files', e)

        

class Parameters:
    def __init__(self):
        pass

async def main():
    ss = ServerSocket("localhost", 6969)

    sm = SubjectsManager(ss)
    myVar = sm.create('myVar', 1)
    
    ss.bind_command_m("subscribe", sm, SubjectsManager.subscribe)
    ss.bind_command_m("unsubscribe", sm, SubjectsManager.unsubscribe)

    parameters = sm.create('parameters', [])        
        
    fm = FileManager()
    ss.bind_command_m("file", fm, FileManager.receive_files)

    ###
    #ss.bind_command_f("callf", function)
    #a_class = AClass()
    #ss.bind_command_m("callm", a_class, AClass.method)
    ###

    loop = asyncio.get_running_loop()
    stop = loop.create_future()
    loop.add_signal_handler(signal.SIGTERM, stop.set_result, None)

    async with ss.serve():
        await asyncio.sleep(5)
        print("edit myVar")
        myVar.notify(2)
        await stop # run forever


if __name__ == "__main__":
    print("Hello from python")
    
    asyncio.run(main())    
