from typing import Union
from typing import List, Dict

from abc import ABC, abstractmethod

class ILoanPaymentRepository(ABC):
    @abstractmethod
    def add_payment(self, loan_id: int, amount: Union[int, float]) -> Dict:
        pass

    @abstractmethod
    def delete_payment(self, loan_id: int) -> Dict:
        pass

    @abstractmethod
    def get_repayments(self) -> List[Dict]:
        pass

    @abstractmethod
    def get_repayments_by_loan_id(self, loan_id: int) -> List[Dict]:
        pass