from typing import Union
from dataclasses import dataclass


@dataclass
class LoanPaymentsDTO:
    loan_id: int
    amount: Union[int, float] 

    def validate(self):
        errors = {}

        if not self.loan_id or not isinstance(self.loan_id, int):
            errors['loan_id'] = 'Loan Id is required and must be an integer'
        elif self.loan_id < 0:
            errors['loan_id'] = 'Loan Id must be larger than or equal to 0'

        if not self.amount or not (isinstance(self.amount, float) or isinstance(self.amount, int)):
            errors['amount'] = 'Payment amount is required and must be a float/integer'
        elif self.amount <= 0:
            errors['amount'] = 'Payment amount must be larger than 0'

        return errors