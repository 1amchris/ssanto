from osgeo import gdal, ogr, osr
import os
import geopandas

DEFAULT_EMPTY_VAL = -99999999999


def convert_projection(in_proj, out_proj, p1, p2):
    InSR = osr.SpatialReference()
    InSR.ImportFromEPSG(in_proj)
    OutSR = osr.SpatialReference()

    OutSR.ImportFromEPSG(out_proj)

    Point = ogr.Geometry(ogr.wkbPoint)
    Point.AddPoint(p1, p2)
    Point.AssignSpatialReference(InSR)
    Point.TransformTo(OutSR)

    x = Point.GetX()
    y = Point.GetY()
    return x, y


def get_center_latitude_longitude(shape_file_path):
    df = geopandas.read_file(shape_file_path)

    df = df.to_crs({"init": "epsg:4326"})
    df["Center_point"] = df["geometry"].centroid

    df["long"] = df.Center_point.map(lambda p: p.x)
    df["lat"] = df.Center_point.map(lambda p: p.y)

    latitude = (df["lat"].max() - df["lat"].min()) / 2 + df["lat"].min()
    longitude = (df["long"].max() - df["long"].min()) / 2 + df["long"].min()

    return latitude, longitude


def shape_to_Raster(
    cell_size, input, output, field_name=False, empty_data_value=DEFAULT_EMPTY_VAL
):
    gdf = geopandas.read_file(input)
    gdf = gdf.to_crs({"init": "epsg:3857"})
    gdf.to_file(input)

    input_driver = ogr.GetDriverByName("ESRI Shapefile")
    input_source = input_driver.Open(input, 0)
    input_lyr = input_source.GetLayer()
    input_srs = input_lyr.GetSpatialRef()
    # projection = osr.SpatialReference(wkt=input_source.GetProjection())
    input_crs = int(input_srs.GetAttrValue("AUTHORITY", 1))
    output_crs = 3857

    x_min, x_max, y_min, y_max = input_lyr.GetExtent()

    # x_min_converted, y_min_converted = convert_projection(
    #     input_crs, output_crs, x_min, y_min
    # )
    # x_max_converted, y_max_converted = convert_projection(
    #     input_crs, output_crs, x_max, y_max
    # )

    x_nb_cell = int((x_max - x_min) / int(cell_size))
    y_nb_cells = int((y_max - y_min) / int(cell_size))

    output_driver = gdal.GetDriverByName("GTiff")
    if os.path.exists(output):
        output_driver.Delete(output)

    output_source = output_driver.Create(
        output, x_nb_cell, y_nb_cells, 1, gdal.GDT_Float64
    )
    output_source.SetGeoTransform((x_min, cell_size, 0, y_max, 0, -cell_size))
    output_source.SetProjection(input_srs.ExportToWkt())
    output_lyr = output_source.GetRasterBand(1)
    output_lyr.SetNoDataValue(empty_data_value)

    output_source.FlushCache()

    if field_name:
        gdal.RasterizeLayer(
            output_source, [1], input_lyr, options=["ATTRIBUTE={}".format(field_name)]
        )

    else:
        gdal.RasterizeLayer(output_source, [1], input_lyr, burn_values=[1])

    input_source = None
    output_source = None

    return output


def process_raster(cell_size, crs, input, output, field_name=False):
    print("process_raster", input, "****", output)
    if input.endswith(".shp"):
        shape_to_Raster(cell_size, input, output, field_name=field_name)

        # --- Convert to Mercantor ---
        file_raster = gdal.Open(output)
    else:
        file_raster = gdal.Open(input)
    return gdal.Warp(output, file_raster, dstSRS=crs)