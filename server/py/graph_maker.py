class Graph_maker:
    def compute_scaling_graph(scaling_function, min, max):
        equation = compile(scaling_function, "", "eval")
        x = np.linspace(min, max, num=50)
        y = list(map(lambda x_i: eval(equation, math_op, {"x": x_i}), x))
        return x, y
