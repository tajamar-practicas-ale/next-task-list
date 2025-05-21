class DataStore:
    users = {}  # {username: User}
    tasks = {}  # {task_id: Task}

    @classmethod
    def add_user(cls, user):
        cls.users[user.username] = user

    @classmethod
    def get_user(cls, username):
        return cls.users.get(username)

    @classmethod
    def add_task(cls, task):
        cls.tasks[task.id] = task

    @classmethod
    def get_tasks_by_user(cls, user_id):
        return [task for task in cls.tasks.values() if task.user_id == user_id]
