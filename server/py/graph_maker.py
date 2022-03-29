import numpy as np
from py.math_operation import MATH_OPERATION


class Graph_maker:
    def compute_scaling_graph(scaling_function, min, max):
        equation = compile(scaling_function, "", "eval")
        x = np.linspace(min, max, num=50)
        y = list(map(lambda x_i: eval(equation, MATH_OPERATION, {"x": x_i}), x))
        return x, y
