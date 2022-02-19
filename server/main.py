from pyclbr import Function
import signal

import asyncio
from base64 import b64decode
from geojson_rewind import rewind

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

class StudyAreaManager (FileManager):
    def __init__(self, callback: Function):
        super().__init__()
        self.callback = callback
        
    def receive_files(self, cmd):
        super().receive_files(cmd)

        files = cmd['data']        
        shapefiles = [
            (name.rstrip(f'.{ext}'), ext) 
            for name, ext in [
                (file['fileName'], file['fileName'].split('.')[-1])
                for file in files
            ]
            if ext == 'shp'
        ]
        for shapefile, ext in shapefiles[:1]: # select the first one only
            try:
                with fiona.collection(f'{shapefile}.{ext}') as source:
                    layer = {
                        "type": "FeatureCollection",
                        "features": list(source),
                    }

                # rewind enforces geojson's right hand rule
                geojson = rewind(layer)
                self.callback(shapefile, geojson)

                # with open(f"{shapefile}.geojson", "w") as f:
                #     f.write(geojson)
                
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

    study_area_file_name = sm.create('studyArea.fileName', '')
    study_area_geojson = sm.create('studyArea.geoJson', { "type": "FeatureCollection", "features": [] })
    
    def handle_study_area_changed(file_name, geojson):
        study_area_geojson.notify(geojson)
        study_area_file_name.notify(file_name)
    
    ss.bind_command_m(
        "study_area",
        StudyAreaManager(handle_study_area_changed),
        StudyAreaManager.receive_files,
    )

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
