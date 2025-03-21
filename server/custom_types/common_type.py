import datetime
from enum import Enum
from typing import Union, TypedDict

class Loan(TypedDict):
    id: int
    name: str
    interest_rate: Union[int, float]
    principal: int
    due_date: datetime.date

class LoanPayment(TypedDict):
    id: int
    loan_id: int
    amount: Union[int, float]
    payment_date: datetime.date

class User(TypedDict):
    id: str
    username: str
    password: str
    created_at: datetime.date


# This ENUM is used to create a general class for 
# messages for the REST endpoints. 
class OperationStatus(Enum):
    SUCCESS = ("The operation was successful",)
    FAILURE = ("The operation failed due to an error",)
    PENDING = ("The operation is still in progress",)

    def __init__(self, base_message):
        self.base_message = base_message

    def __str__(self):
        return self.base_message

    def with_details(self, details: str = ""):
        if details:
            return f"{self.base_message}: {details}"
        return self.base_message