from osgeo import gdal, ogr


class Driver():
    def __init__(self):
        self.input_driver = ogr.GetDriverByName("ESRI Shapefile")
        self.output_driver = gdal.GetDriverByName("GTiff")


class Transformation():
    def __init__(self, cellsize, crs):
        self.cellsize = cellsize
        self.driver = Driver()
        self.crs = crs
