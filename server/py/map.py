from typing import Callable


class LatLng:
    def __init__(self, lat, long):
        self.lat = lat
        self.long = long


class MapCursorInformations:
    def __init__(self):
        # the placeholder is for dev purposes, and should be
        #  replaced by the actual information displayed.
        self.objectives = {
            # "slope": 0.125,
            # "greenary": 0.6,
            # "education_level": 0.3,
            # "socio_economi": 0.12,
            # "biophysical": 0.435,
            # "ANALYSIS": 0.555,
        }


class Map:
    # get_cursor_information is a callback method with signature (cursor: LatLng) -> MapCursorInformations
    def __init__(self, subjects_manager, get_cursor_informations: Callable[[LatLng], MapCursorInformations]):
        self.get_cursor_informations = get_cursor_informations
        self.cursor = subjects_manager.create("map.cursor", None)
        self.cursor_infos = subjects_manager.create(
            "map.cursor.informations", self.get_cursor_informations(self.cursor.value())
        )

    def set_cursor(self, lat, long):
        cursor = LatLng(lat, long)
        self.cursor.notify(cursor)
        self.cursor_infos.notify(self.get_cursor_informations(cursor))
