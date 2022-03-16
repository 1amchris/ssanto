

import matplotlib.pyplot as plt
from py.objective import *


class Analyser():
    def __init__(self, cellsize=200):
        self.objectives = {}
        self.cellsize = cellsize
        self.study_area = None

    def add_objective(self, objective_name, weight):
        obj = Objective(cellsize=self.cellsize, weight=weight)
        self.objectives[objective_name] = obj
        if(self.study_area != None):
            self.add_study_area()

    def process_data(self):
        output_matrix = []
        total_weight = 0
        for obj in self.objectives:
            data = self.objectives[obj].process_data()
            objective_weight = self.objectives[obj].weight
            if len(output_matrix) == 0:
                output_matrix = np.zeros(data.shape)
            output_matrix += data * objective_weight
            total_weight += objective_weight
        output_matrix = output_matrix / total_weight
        plt.figure()
        plt.imshow(output_matrix)
        plt.show()
        return output_matrix

    def save_study_area(self, shp_id, shx_id):
        self.study_area = (shp_id, shx_id)
        print('save_study_area, Analyser', self.study_area)

    def add_study_area(self):
        for o in self.objectives:
            o.add_study_area(self, path, output_tiff)
