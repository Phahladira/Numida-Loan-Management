from typing import List, Dict

from abc import ABC, abstractmethod

class IUsersRepository(ABC):
    @abstractmethod
    def create_user(self, username:str, password: str):
        pass

    @abstractmethod
    def validate_user(self, username:str, password: str):
        pass

    @abstractmethod
    def get_users(self):
        pass