

# TODO: Make abstract
class Subject:
    def __init__(self, sm, sid, data):
        self.sid = sid
        self.sm = sm
        self.data = data
        self.is_watched = False # TODO: Semaphore
    
    def watch(self):
        self.is_watched = True
        
    def unwatch(self):
        self.is_watched = False
        
    async def notify(self, data):
        self.data = data
        if self.is_watched:
            await self.sm.send(self)

    def get(self):
        return self.data
        
    def to_dict(self):
        return {"sid": self.sid, "data": self.data}

