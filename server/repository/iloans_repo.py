import datetime
from typing import List, Dict, Union

from abc import ABC, abstractmethod

class ILoansRepository(ABC):
    @abstractmethod
    def add_loan(
        self, 
        name: str,
        due_date: datetime.date,
        principal: Union[int, float],
        interest_rate: Union[int, float]
    ) -> Dict:
        pass

    @abstractmethod
    def delete_loan(self, id: int) -> Dict:
        pass

    @abstractmethod
    def get_loans(self) -> List[Dict]:
        pass

    @abstractmethod
    def get_loan_by_id(self, id: int) -> List[Dict]:
        pass