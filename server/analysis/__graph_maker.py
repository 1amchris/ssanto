# import numpy as np
# from analysis.math_operation import MATH_OPERATION
# from analysis.study_area import StudyArea


# class GraphMaker:
#     @staticmethod
#     def compute_scaling_graph(scaling_function, min_, max_, num=50):
#         equation = compile(scaling_function, "", "eval")
#         x = np.linspace(min_, max_, num=num)
#         y = list(map(lambda x_i: eval(equation, MATH_OPERATION, {"x": x_i}), x))
#         minimum = min(y)
#         maximum = max(y)
#         y = list(map(lambda y_i: (y_i - minimum) / (maximum - minimum), y))
#         return x, y

#     @staticmethod
#     def compute_fraction_above_threshold(study_area: StudyArea, array, threshold):
#         return np.count_nonzero(array >= threshold) / np.count_nonzero(study_area.as_array > 0)

#     @staticmethod
#     def compute_fraction_in_range(study_area, array, min_threshold, max_threshold):
#         above_max = GraphMaker.compute_fraction_above_threshold(study_area, array, max_threshold)
#         above_min = GraphMaker.compute_fraction_above_threshold(study_area, array, min_threshold)
#         return above_min - above_max
