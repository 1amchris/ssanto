from .subject import Subject

class SubjectsManager:
    def __init__(self, ss):
        self.subjects = {}
        self.server_socket = ss
        
    def create(self, name, data = None):
        self.subjects[name] = Subject(self, name, data)
        return self.subjects[name]
        
    def destroy(self):
        raise NotImplementedError("Not implemented yet!")
    
    async def send(self, s):
        await self.server_socket.send(s)
        
    async def subscribe(self, cmd):
        # TODO: Handle sid unavailable
        s = self.subjects[cmd['sid']]
        s.is_watched = True
        await self.send(s)
        
    def unsubscribe(self, cmd):
        # TODO: Handle sid unavailable
        s = self.subjects[cmd['sid']]
        s.is_watched = False
