import uuid
import bcrypt
import datetime
from typing import List, Dict
from util.constants import users
from repository.iusers_repo import IUsersRepository

class LocalUsersRepository(IUsersRepository):
    def __init__(self, users: List[Dict] = None):
        self._users = users if users is not None else []

    def get_users(self) -> List[Dict]:
        return self._users

    def create_user(self, username:str, password: str) -> Dict:
        does_user_exist = any(user['username'] == username for user in users)

        if does_user_exist:
            return None
        
        new_user = {
            "id": str(uuid.uuid4()),
            "username": username,
            "password": bcrypt.hashpw(
                    password.encode('utf-8'), 
                    bcrypt.gensalt()).decode('utf-8'),
            "created_at": datetime.date.today()
        }

        self._users.append(new_user)
        return new_user

    def validate_user(self, username:str, password: str)-> Dict:
        user = next((user for user in users if user['username'] == username), None)

        if not user:
            return None
        
        if  bcrypt.checkpw( password.encode('utf-8'), user['password'].encode('utf-8')):
            return user
        
        return None
        #raise LoginErr('Permission denied, your password or username is incorrect.')