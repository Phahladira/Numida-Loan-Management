import datetime
from typing import List, Dict

from repository.iloan_payments_repo import ILoanPaymentRepository

# This class is the implementation of the 
# ILoanPaymentRepository. We use this repository 
# pattern to access and manipulate our DB. This is
# also so that it's extensible for future DB implementations
class LocalLoanPaymentRepository(ILoanPaymentRepository):
    def __init__(self, loan_payments: List[Dict] = None):
        self._loan_payments = loan_payments if loan_payments is not None else []

    def add_payment(self, loan_id: int, amount: float) -> Dict:
        new_payment = {
            "id": len(self._loan_payments) + 1,
            "loan_id": loan_id,
            "amount": amount,
            "payment_date": datetime.date.today(),
        }

        self._loan_payments.append(new_payment)
        return new_payment

    def get_payments(self) -> List[Dict]:
        return self._loan_payments