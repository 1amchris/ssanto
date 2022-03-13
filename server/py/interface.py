
# TODO: Add class for better editing
#       ex: self.add_nav_category('File').add_function('Save')
#       Add widgets
#       ex: self.add_info_panel('Test').add_text('Test text').add_img(img)

class Interface:
    def __init__(self, subjects_manager):
        raise NotImplementedError("Not implemented yet!")
        
        self.nav_bar = subjects_manager.create('nav_bar', [])
        self.add_nav_category('File')
        self.add_nav_category('Edit')
        self.add_nav_category('Help')
        self.nav_bar.update()

        self.left_bar = subjects_manager.create('left_bar', [])
        self.add_left_category('Socket menu')
        self.add_left_category('Interactive map')
        self.add_left_category('Analysis parameters') \
            .add_form() \
            .bind('parameters') \
            .add_text_input('Analysis name', 'analysis_name') \
            .add_text_input('Name of the modeler', 'modeler_name') \
            .add_size_input('Cell size', 'cell_size')
        self.add_left_category('Study area')
        self.add_left_category('Nbs system type')
        self.add_left_category('Objective hierarchy')
        self.left_bar.update()

        self.right_bar = subjects_manager.create('right_bar', [])
        self.add_info_panel('Interpolation char',
                            "Anim pariatur cliche reprehenderit, enim eiusmod high \
                            life accusamus terry richardson ad squid. 3 wolf moon \
                            officia aute, non cupidatat skateboard dolor brunch. \
                            Food truck quinoa nesciunt laborum eiusmod. Brunch 3 \
                            wolf moon tempor, sunt aliqua put a bird on it probably \
                            haven't heard of them accusamus labore sustainable VHS.")
        self.right_bar.update()

    def add_nav_category(self, name):
        nav_bar = self.nav_bar.value()
        nav_bar.append({'label': name, 'content': []})

    def add_left_category(self, name):
        left_bar = self.left_bar.value()
        left_bar.append({'label': name, 'content': []})

    def add_info_panel(self, label, content):
        right_bar = self.right_bar.value()
        right_bar.append({'label': label, 'content': content})
