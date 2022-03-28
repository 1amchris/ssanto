from osgeo import gdal, ogr
import os


def shape_to_Raster(cell_size,
                    input,
                    output,
                    field_name=False,
                    empty_data_value=0):

    input_driver = ogr.GetDriverByName("ESRI Shapefile")
    input_source = input_driver.Open(input, 0)
    input_lyr = input_source.GetLayer()
    input_srs = input_lyr.GetSpatialRef()

    x_min, x_max, y_min, y_max = input_lyr.GetExtent()
    x_nb_cell = int((x_max - x_min) / cell_size)
    y_nb_cells = int((y_max - y_min) / cell_size)

    output_driver = gdal.GetDriverByName("GTiff")
    if os.path.exists(output):
        output_driver.Delete(output)

    print(cell_size,input,output)
    output_source = output_driver.Create(output, x_nb_cell, y_nb_cells, 1, gdal.GDT_Float64)
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

    if input.endswith('.shp'):
        shape_to_Raster(cell_size, input, output, field_name=field_name)

        # --- Convert to Mercantor ---
        file_raster = gdal.Open(output)
    else:
        file_raster = gdal.Open(input)
    return gdal.Warp(output, file_raster, dstSRS=crs)
