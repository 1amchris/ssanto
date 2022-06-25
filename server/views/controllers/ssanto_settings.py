from views.controllers.view_controller import ViewController


class SSantoSettingsViewController(ViewController):
    def get_view_type(self):
        return "ssanto-settings"

    def get_content(self):
        try:
            return {
                "analysis": {
                    "name": "montreal",
                    "description": "This is a brief analysis of the Montreal data set provided by Fred.",
                    "author": {
                        "name": "Christophe Beaulieu",
                        "email": "beaulieu.christophe23@gmail.com",
                        "website": "http://github.com/1amchris",
                    },
                    "createdOn": "2022-01-01",
                    "modifiedOn": "2022-02-02",
                }
            }
        except Exception:
            return super().get_content()
