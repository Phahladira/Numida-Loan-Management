import datetime
from typing import List, Dict, Union

from custom_types.common_type import LoanPayment
from repository.iloan_payments_repo import ILoanPaymentRepository

# This class is the implementation of the 
# ILoanPaymentRepository. We use this repository 
# pattern to access and manipulate our DB. This is
# also so that it's extensible for future DB implementations
class LocalLoanPaymentRepository(ILoanPaymentRepository):
    def __init__(self, loan_payments: List[Dict] = None):
        self._loan_payments = loan_payments if loan_payments is not None else []

    def get_repayments_by_loan_id(self, loan_id: int) -> List[Dict]:
        return [payment for payment in self._loan_payments if payment['loan_id'] == loan_id]

    def get_repayments(self) -> List[Dict]:
        return self._loan_payments

    def add_payment(self, loan_id: int, amount: Union[int, float]) -> Dict:
        new_payment: LoanPayment = {
            "id": len(self._loan_payments) + 1,
            "loan_id": loan_id,
            "amount": amount,
            "payment_date": datetime.date.today(),
        }

        self._loan_payments.append(new_payment)
        return new_payment
    
    def delete_payment(self, payment_id: int):
        # Find the object to delete
        deleted_payment = next((payment for payment in self._loan_payments if payment['id'] == payment_id), None)
        
        if not deleted_payment:
            return None

        # Remove the object from the list if found
        if deleted_payment:
            self._loan_payments = [payment for payment in self._loan_payments if payment['id'] != payment_id]

        
        return deleted_payment
