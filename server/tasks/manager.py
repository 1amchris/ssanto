import asyncio
from serializable import Serializable
from singleton import TenantInstance, TenantSingleton
from subjects.manager import SubjectsManager
from logger.manager import LogsManager


class Task(Serializable):
    def __init__(self, task, display_name=None, on_error=None):
        self.task = asyncio.create_task(task)
        self.name = display_name or self.task.get_name()
        # not currently used, but should be used to handle errors if specified
        self.on_error = on_error

    def serialize(self):
        return {"id": self.get_id(), "name": self.display_name, "running": not self.is_done()}

    def get_id(self):
        return self.task.get_name()

    def cancel(self):
        return self.task.cancel()

    def is_done(self):
        return self.task.done()

    def add_done_callback(self, callback):
        self.task.add_done_callback(callback)

    def remove_done_callback(self, callback):
        self.task.remove_done_callback(callback)


class TasksManager(TenantInstance, metaclass=TenantSingleton):
    @staticmethod
    async def sleep(seconds):
        await asyncio.sleep(seconds)

    def __init__(self, tenant_id: str):
        super().__init__(tenant_id)
        self.subjects = SubjectsManager(tenant_id)
        self.logger = LogsManager(tenant_id)
        self.tasks = self.subjects.create("tasker.tasks", [])

        self.logger.info("[Tasks] initialized.")

    def add_task(self, task, display_name, on_complete=None, on_error=None):
        task = Task(task, display_name, on_error)
        if on_complete is not None:
            task.add_done_callback(on_complete)
        task_id = task.get_id()
        task.add_done_callback(lambda *_, **__: self.remove_task(task_id))

        self.tasks.notify(self.tasks.value() + [task])
        self.logger.info(f'[Tasks] Added task with id "{task_id}"')
        return task.get_id()

    def remove_task(self, task_id):
        tasks = self.tasks.value()
        task_ids = [task.get_id() for task in tasks]
        if task_id in task_ids:
            task_index = task_ids.index(task_id)
            self.tasks.notify(tasks[:task_index] + tasks[task_index + 1 :])
            self.logger.info(f'[Tasks] Removed task with id "{task_id}"')

    def cancel_task(self, task_id, message=None):
        task = self.get_task(task_id)
        if task is not None and not task.done():
            # TODO: There should probably some error handling here.
            task.cancel(message)
            self.tasks.update()  # TODO: I don't know if this is necessary. When the task is cancelled, the task might be done, and the task is removed when done
            self.logger.info(f'[Tasks] Removed task with id "{task_id}"')

    def get_task(self, task_id):
        if task_id in self.tasks.value():
            return self.tasks.value()[task_id]
        else:
            return None