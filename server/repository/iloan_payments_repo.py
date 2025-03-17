from typing import Union
from typing import List, Dict

from abc import ABC, abstractmethod

class ILoanPaymentRepository(ABC):
    @abstractmethod
    def add_payment(self, loan_id: int, amount: Union[int, float]) -> Dict:
        pass

    @abstractmethod
    def get_payments(self) -> List[Dict]:
        pass