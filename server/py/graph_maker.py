import numpy as np
from py.math_operation import MATH_OPERATION


class GraphMaker:
    @staticmethod
    def compute_scaling_graph(scaling_function, min, max, num=50):
        equation = compile(scaling_function, "", "eval")
        x = np.linspace(min, max, num=num)
        y = list(map(lambda x_i: eval(equation, MATH_OPERATION, {"x": x_i}), x))
        return x, y

    @staticmethod
    def compute_fraction_above_threshold(array, threshold):
        return np.count_nonzero(array > threshold) / array.size

    @staticmethod
    def compute_fraction_in_range(array, min_threshold, max_threshold):
        above_max = GraphMaker.calculate_fraction_above_threshold(array, max_threshold)
        above_min = GraphMaker.calculate_fraction_above_threshold(array, min_threshold)
        return above_min - above_max
