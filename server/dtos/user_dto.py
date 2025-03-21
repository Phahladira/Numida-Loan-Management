import re
from dataclasses import dataclass


@dataclass
class UsersDTO:
    username: str
    password: str

    def validate(self):
        errors = {}

        if not self.username or not isinstance(self.username, str):
            errors['username'] = 'Username is required and must be an string'

        if not self.validate_username():
            errors['username'] = 'Username is not valid'

        if not self.password or not isinstance(self.password, str):
            errors['password'] = 'Password is required and must be an string'

        if not self.validate_password():
            errors['password'] = 'Password is not valid'

        return errors
    
    def validate_username(self):
        # Regex pattern for username validation
        pattern = r'^[a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*$'
        # Check if the username matches the pattern and has a valid length
        if re.match(pattern, self.username) and 3 <= len(self.username) <= 20:
            return True
        return False
    
    def validate_password(self):
        # Regex pattern to check if the password has 6 or more characters
        pattern = r'^.{6,20}$'
        # Check if the password matches the pattern
        if re.match(pattern, self.password):
            return True
        return False