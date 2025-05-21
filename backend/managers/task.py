from models.task import Task

class TaskManager:
    @staticmethod
    def get_tasks(user):
        return user.tasks

    @staticmethod
    def add_task(user, title, description):
        task = Task(title, description, user.username)
        user.tasks.append(task)
        return task
