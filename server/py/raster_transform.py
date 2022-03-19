from osgeo import gdal, ogr
import os


def shape_to_Raster(transformation,
                    file_path,
                    output_tiff,
                    field_name=False,
                    empty_data_value=0,

                    ):

    input_source = transformation.driver.input_driver.Open(
        file_path, 0)
    input_lyr = input_source.GetLayer()
    input_srs = input_lyr.GetSpatialRef()

    x_min, x_max, y_min, y_max = input_lyr.GetExtent()
    x_nb_cell = int((x_max - x_min) / transformation.cellsize)
    y_nb_cells = int((y_max - y_min) / transformation.cellsize)

    if os.path.exists(output_tiff):
        transformation.driver.output_driver.Delete(
            output_tiff)
    output_source = transformation.driver.output_driver.Create(
        output_tiff, x_nb_cell, y_nb_cells, 1, gdal.GDT_Float64)

    output_source.SetGeoTransform(
        (x_min, transformation.cellsize, 0, y_max, 0, -transformation.cellsize))
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

    return output_tiff


def process_raster(transformation, file_path, output_tiff, field_name=False):

    if file_path.endswith('.shp'):
        shape_to_Raster(transformation,
                        file_path=file_path, output_tiff=output_tiff,  field_name=field_name)

    # --- Convert to Mercantor ---
        file_raster = gdal.Open(output_tiff)
    else:
        file_raster = gdal.Open(file_path)
    return gdal.Warp(
        output_tiff, file_raster, dstSRS=transformation.crs)
