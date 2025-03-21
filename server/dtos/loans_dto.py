import re
import datetime
from typing import Union
from dataclasses import dataclass

# This DTO was created for the values
# coming through from the frontend to ensure 
# that the data adheres to the format needed.
# This enhances the robustness of our Backend
@dataclass
class LoansDTO:
    name: str
    due_date: str
    principal: Union[int, float]
    interest_rate: Union[int, float]

    def validate(self):
        errors = {}
        
        if not self.name or not isinstance(self.name, str):
            errors['name'] = 'Name is required and must be an string'
        elif not self.validate_name():
            errors['name'] = 'Name is not valid'

        if not self.due_date or not isinstance(self.due_date, str):
            errors['due_date'] = 'Due date is required and must be an string'
        elif not self.is_valid_date():
            errors['due_date'] = 'Due date is not valid'

        if not self.principal or not (isinstance(self.principal, float) or isinstance(self.principal, int)):
            errors['principal'] = 'Principal is required and must be a float/integer'
        elif self.principal <= 0:
            errors['principal'] = 'Principal must be larger than 0'

        if not self.interest_rate or not (isinstance(self.interest_rate, float) or isinstance(self.interest_rate, int)):
            errors['interest_rate'] = 'Interest rate is required and must be a float/integer'
        elif self.interest_rate <= 0:
            errors['interest_rate'] = 'Interest rate must be larger than 0'

        return errors
    
    def validate_name(self):
        pattern = r'^.{3,20}$'
        if re.match(pattern, self.name):
            return True
        return False
    
    def is_valid_date(self) -> bool:
        # Regex pattern to match common date formats
        pattern = r'^(?:(?:\d{4}[/\-.]\d{2}[/\-.]\d{2})|(?:\d{2}[/\-.]\d{2}[/\-.]\d{4}))$'
        
        # Check if the date string matches the pattern
        if not re.match(pattern, self.due_date):
            return False

        # Try to parse the date string into a datetime object
        try:
            # List of common date formats to try
            formats = [
                "%Y-%m-%d",  # ISO format (YYYY-MM-DD)
                "%d/%m/%Y",  # DD/MM/YYYY
                "%m/%d/%Y",  # MM/DD/YYYY
                "%Y.%m.%d",  # YYYY.MM.DD
                "%d.%m.%Y",  # DD.MM.YYYY
                "%m-%d-%Y",  # MM-DD-YYYY
                "%d-%m-%Y",  # DD-MM-YYYY
                "%Y/%m/%d",  # YYYY/MM/DD
            ]

            # Try each format until a match is found
            for fmt in formats:
                try:
                    due_date_obj = datetime.datetime.strptime(self.due_date, fmt).date()
                    break
                except ValueError:
                    continue
            else:
                # If no format matches, the date is invalid
                return False

            # Get the current date
            current_date = datetime.datetime.now().date()

            # Check if the due date is after the current date
            return due_date_obj > current_date

        except Exception as e:
            # Handle any unexpected errors
            print(f"Error validating date: {e}")
            return False