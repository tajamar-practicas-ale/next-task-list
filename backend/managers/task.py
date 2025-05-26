from models.task import Task
from models.datastore import DataStore

class TaskManager:
    @staticmethod
    def get_tasks(user):
        return DataStore.get_tasks_by_user(user.username)

    @staticmethod
    def add_task(user, title, description):
        task = Task(title, description, user.username)
        DataStore.add_task(task)
        return task
