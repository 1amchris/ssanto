import matplotlib.pyplot as plt
import numpy as np

from py.raster_transform import *

from py.study_area import StudyArea
from py.math_operation import MATH_OPERATION
import geopandas


class Feature:
    def __init__(
        self,
        id,
        path,
        output_tiff,
        weight,
        cell_size,
        crs,
        study_area: StudyArea,
        scaling_function,
    ):
        self.id = id
        self.path = path
        self.output_tiff = output_tiff
        self.cell_size = cell_size
        self.crs = crs
        self.study_area = study_area
        self.weight = weight


class ContinuousFeature(Feature):
    def __init__(
        self,
        id,
        path,
        output_tiff,
        weight,
        cell_size,
        crs,
        study_area: StudyArea,
        scaling_function,
        field_name=False,
    ):
        super().__init__(
            id, path, output_tiff, weight, cell_size, crs, study_area, scaling_function
        )

        self.field_name = field_name
        self.scaling_function = "x"

    def update(self):
        print("update", self.path, '****', self.output_tiff)
        self.as_raster = process_raster(
            self.cell_size,
            self.crs,
            self.path,
            self.output_tiff,
            field_name=self.field_name,
        )
        self.as_array = self.process_raster_as_array()

    def process_raster_as_array(self):
        file_band = self.as_raster.GetRasterBand(1)
        file_array = file_band.ReadAsArray()
        file_array = self.clip_matrix(file_array)
        file_array = self.apply_value_scaling(file_array)
        file_array = self.default_normalize_matrix(file_array)
        return file_array

    def apply_value_scaling(self, file_array):
        equation = compile(self.scaling_function, "", "eval")
        for i in range(len(file_array)):
            for j in range(len(file_array[1])):
                x = file_array[i, j]
                file_array[i, j] = eval(equation, MATH_OPERATION, {"x": x})
        return file_array

    def clip_matrix(self, file):
        origin_file = (
            self.as_raster.GetGeoTransform()[0],
            self.as_raster.GetGeoTransform()[3],
        )

        offset = offset = (
            -int((origin_file[1] - self.study_area.origin[1]
                  ) // self.cell_size),
            int((origin_file[0] - self.study_area.origin[0]) //
                self.cell_size),
        )
        return self.balance_matrix(file, self.study_area.as_array, offset)

    def balance_matrix(self, input_matrix, study_area, offset):
        output_matrix = np.zeros(study_area.shape)
        output_matrix = np.zeros(study_area.shape)
        output_matrix[
            max(offset[0], 0): max(
                min(len(input_matrix) + offset[0], len(study_area)), 0
            ),
            max(offset[1], 0): max(
                min(len(input_matrix[0]) + offset[1], len(study_area[0])), 0
            ),
        ] = input_matrix[
            max(0, -offset[0]): max(len(study_area) - offset[0], 0),
            max(0, -offset[1]): max(len(study_area[0]) - offset[1], 0),
        ]
        return output_matrix

    def default_normalize_matrix(self, matrix, minimum=None, maximum=None):
        if minimum == None or minimum > matrix.min():
            minimum = matrix.min()

        if maximum == None or minimum > matrix.min():
            maximum = matrix.max()
        return (matrix - minimum) / (maximum - minimum)

    def display_array(self):
        plt.figure()
        plt.imshow(self.as_array)
        plt.show()

    def process_value_matrix(self):
        self.update()
        return self.as_array, {}

    def get_value_matrix(self):
        return self.as_array


class DistanceFeature(ContinuousFeature):
    def __init__(
        self,
        id,
        path,
        output_tiff,
        weight,
        max_distance,
        cell_size,
        crs,
        study_area: StudyArea,
        scaling_function,
        field_name=False,
        maximize_distance=True,
        centroid=True,
        granularity=None,
        threshold=0.8,
    ):
        super().__init__(
            id,
            path,
            output_tiff,
            weight,
            cell_size,
            crs,
            study_area,
            scaling_function,
            field_name,
        )
        print('DistanceFeature', path)
        self.max_distance = float(max_distance) / float(self.cell_size)
        self.granularity = granularity
        self.threshold = threshold
        self.maximise_distance = maximize_distance
        self.centroid = centroid

    def update(self):
        super().update()
        self.compute_distance_matrix()

    def compute_distance_matrix(self):
        if self.centroid:
            points = self.get_centroid(self.as_array)
        else:
            points = self.get_coordinate(self.as_array, self.threshold)
        self.distance_matrix = self.draw_distance_matrix(
            self.as_array.shape,
            points,
            self.max_distance,
            self.granularity,
            self.maximise_distance,
        )

    def get_value_matrix(self):
        return self.distance_matrix

    def manhattan(point_a, point_b):
        """
        Return the manhattan distance between two points
        """
        return abs(point_a[0] - point_b[0]) + abs((point_a[1] - point_b[1]))

    def euclidean(point_a, point_b):
        """
        Return the euclidean distance between two points
        """
        return np.sqrt((point_a[0] - point_b[0]) ** 2 + (point_a[1] - point_b[1]) ** 2)

    def draw_distance_matrix(
        self,
        shape,
        point,
        max_distance,
        granularity=None,
        maximize=True,
        distance_function=euclidean,
    ):
        """
        Form matrix of minimal distance to a given point or EPSG:32188many points.

        Keyword arguments:
        shape -- the form of the wanted matrix
        points -- the point or points the distance is calculated from.
        max_distance -- maximum distance beyond which an additional distance will have no influence
        granularity -- the number of distance category subdivisions, the default value is None and return no subdivision at all
        distance_function -- The distance function used to calculate the distance between two points
        goal -- the goal can be either to 'maximize' or to 'minimize' the distance.
        Return: A numpy Array
        """

        if hasattr(point[0], "__iter__"):
            arr = np.ones(shape)
            for p in point:
                np.minimum(
                    arr,
                    self.draw_distance_matrix(
                        shape, p, max_distance, granularity, distance_function
                    ),
                    arr,
                )

            if maximize:
                return arr
            else:
                return np.ones(shape) - arr
        else:

            if granularity != None:
                cat = np.linspace(0, 1, granularity + 1)
            arr = np.ones(shape)
            a = max(point[0] - max_distance, 0)
            b = min(point[0] + max_distance, len(arr))
            for i in range(
                int(max(point[0] - max_distance, 0)),
                int(min(point[0] + max_distance, len(arr))),
            ):
                for j in range(
                    int(max(point[1] - max_distance, 0)),
                    int(min(point[1] + max_distance, len(arr[0]))),
                ):
                    if granularity != None:

                        arr[i, j] = cat[
                            min(
                                int(
                                    granularity
                                    * distance_function((i, j), point)
                                    / max_distance
                                ),
                                granularity,
                            )
                        ]
                    else:
                        arr[i, j] = distance_function(
                            (i, j), point) / max_distance

            if maximize:
                return arr
            else:
                return np.ones(shape) - arr

    def get_centroid(self, array):
        total = np.sum(array)

        sum_x = 0
        sum_y = 0
        for i in range(len(array)):
            for j in range(len(array[0])):
                sum_x += i * array[i, j]
                sum_y += j * array[i, j]
        centroid = (sum_x, sum_y) / total
        centroid[0] = int(centroid[0])
        centroid[1] = int(centroid[1])
        return centroid

    def get_coordinate(self, array, threshold):
        coordinate = []
        for i in range(len(array)):
            for j in range(len(array[0])):
                if array[i][j] > threshold:
                    coordinate.append((i, j))
        return coordinate


class CategoricalFeature(ContinuousFeature):
    def __init__(
        self,
        id,
        path,
        output_tiff,
        weight,
        cell_size,
        crs,
        study_area: StudyArea,
        scaling_function,
        field_name,
        category_value_dict,
    ):
        super().__init__(
            path,
            id,
            output_tiff,
            weight,
            cell_size,
            crs,
            study_area,
            scaling_function,
            field_name,
        )
        self.categorized_value = category_value_dict

    def update(self):
        self.categorize_values()
        self.as_raster = process_raster(
            self.cell_size,
            self.crs,
            self.path,
            self.output_tiff,
            field_name="cal_value",
        )
        self.as_array = self.process_raster_as_array()

    def categorize_values(self):
        df = geopandas.read_file(self.path)
        df["cal_value"] = (
            df[self.field_name].map(
                self.categorized_value).fillna(0.0).astype(float)
        )
        df.to_file(self.path)
