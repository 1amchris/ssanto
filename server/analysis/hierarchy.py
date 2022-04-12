import json


class Hierarchy:
    def __init__(self, path):
        self.path = path
        self.hierarchy_json = json.load(open(self.path, 'r'))
        self.objective_hierarchy = {}
        self.nbs_system = None

    def filter(self, nbs_system):
        self.nbs_system = nbs_system
        new_mains = []
        for mains_ in self.hierarchy_json["mains"]:
            main = mains_["main"]
            primaries = mains_["primaries"]
            new_primaries = []
            for primaries_ in primaries:
                primary = primaries_["primary"]
                secondaries = primaries_["secondaries"]
                new_secondaries = []
                for secondaries_ in secondaries:
                    secondary = secondaries_["secondary"]
                    nbs = secondaries_["nbs"]
                    if int(self.nbs_system) in [int(x) for x in nbs]:
                        new_secondaries.append({"secondary": secondary})
                new_primaries.append(
                    {'primary': primary, 'secondaries': new_secondaries})
            new_mains.append({'main': main, "primaries": new_primaries})
        self.objective_hierarchy = {
            "name": "ObjectivesHierarchy", 'mains': new_mains}
        return self.objective_hierarchy

    # TODO: default hierarchy for a specific nbs system

    # TODO: default value scaling
