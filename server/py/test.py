import geopandas
countries_gdf = geopandas.read_file(
    "/home/philippd/Desktop/projet-bichai/server/temp/Espace_Vert.shp")

print(countries_gdf.columns)
print(countries_gdf.head(5))
countries_gdf = geopandas.read_file(
    '/home/philippd/Desktop/projet-bichai/server/tempmtl_limites_hauteurs.shp')

print(countries_gdf.columns)
print(countries_gdf.head(5))
countries_gdf = geopandas.read_file(
    '/home/philippd/Desktop/projet-bichai/server/temp/terre_shp.shp')

print(countries_gdf.columns)
print(countries_gdf.head(5))
