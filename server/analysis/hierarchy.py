import json

default_attributes = dict.fromkeys(["attribute", "weights", "datasets"], [])


class Hierarchy:
    def __init__(self, path):
        self.path = path
        self.objective_hierarchy = {}
        self.nbs_system = None

        with open(self.path, "r") as f:
            self.hierarchy_json = json.load(f)

    def filter_master_list(self, nbs_system):
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
                    nbs = secondaries_["allowed_nbs"]
                    if int(self.nbs_system) in [int(x) for x in nbs]:
                        new_secondaries.append({"secondary": secondary})
                new_primaries.append({"primary": primary, "secondaries": new_secondaries})
            new_mains.append({"main": main, "primaries": new_primaries})
        self.objective_hierarchy = {"name": "ObjectivesHierarchy", "mains": new_mains}
        return self.objective_hierarchy

    # TODO: default hierarchy for a specific nbs system

    def get_default_hierarchy(self, nbs_system):
        self.nbs_system = nbs_system

        for mains_ in self.hierarchy_json["mains"]:
            new_mains = dict()
            main = mains_["main"]
            primaries = mains_["primaries"]
            new_primaries = {"primary": [], "weights": [], "secondaries": []}
            for primaries_ in primaries:
                primary = primaries_["primary"]
                secondaries = primaries_["secondaries"]
                new_secondaries = {"secondary": [], "weights": [], "attributes": []}
                for secondaries_ in secondaries:
                    secondary = secondaries_["secondary"]
                    nbs = secondaries_["default_hierarchy"]
                    if int(self.nbs_system) in [int(x) for x in nbs]:
                        new_secondaries["secondary"].append(secondary)
                        new_secondaries["weights"].append(1)
                        new_secondaries["attributes"].append(default_attributes.copy())

                if len(new_secondaries["secondary"]) > 0:
                    new_primaries["primary"].append(primary)
                    new_primaries["weights"].append(1)
                    new_primaries["secondaries"].append(new_secondaries)
            new_mains["main"] = main
            new_mains["update"] = True
            new_mains["primaries"] = new_primaries
        return new_mains

    """
      main: string;
  update?: boolean;
  primaries: {
    primary: string[];
    weights: number[];
    secondaries: {
      secondary: string[];
      weights: number[];
      attributes: {
        attribute: string[];
        weights: number[];
        datasets: DatasetModel[];
      }[];
    }[];
  };
    
    
    
    """

    # TODO: default value scaling
