import datetime
from typing import List, Dict, Union

from custom_types.common_type import Loan
from repository.iloans_repo import ILoansRepository


class LocalLoansRepository(ILoansRepository):
    def __init__(self, loans: List[Dict] = None):
        self._loans = loans if loans is not None else []

    def add_loan(
        self, 
        name: str, 
        due_date: datetime.date,
        principal: Union[int, float],
        interest_rate: Union[int, float]
    ) -> Dict:
        new_loan: Loan = {
            "id": len(self._loans) + 1,
            "name": name,
            "interest_rate": interest_rate,
            "due_date": due_date,
            "principal": principal,
        }

        self._loans.append(new_loan)
        return new_loan

    def delete_loan(self, id: int) -> Dict:
        # Find the object to delete
        deleted_loan = next((loan for loan in self._loans if loan['id'] == id), None)
        
        if not deleted_loan:
            return None

        # Remove the object from the list if found
        if deleted_loan:
            self._loans = [loan for loan in self._loans if loan['id'] != id]

        
        return deleted_loan

    def get_loans(self) -> List[Dict]:
        return self._loans

    def get_loan_by_id(self, id: int) -> List[Dict]:
        return [loan for loan in self._loans if loan['id'] == id]
