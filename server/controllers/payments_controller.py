import bleach
from markupsafe import escape
from flask import request, jsonify

from dtos.loan_payment_dto import LoanPaymentsDTO
from custom_types.common_type import OperationStatus
from repository.iloan_payments_repo import ILoanPaymentRepository

class LoanPaymentsController:

    def add_payment(self, repo: ILoanPaymentRepository, serializer: any):
        data = request.get_json() or {}

        loan_payment_dto = LoanPaymentsDTO(
            loan_id=data.get('loan_id'),
            amount=data.get('amount'),
        )

        validation_errors = loan_payment_dto.validate()

        if validation_errors:
            return jsonify({ 'message': OperationStatus.FAILURE.with_details(" Validation error!"), 'errors': validation_errors }), 400

        csrf_token = request.headers.get('x-csrf-token')
        csrf_token_validation_response = self.validate_csrf_token(csrf_token, serializer)

        if  csrf_token_validation_response:
            return csrf_token_validation_response
        
        # Escape the input for general safety
        safe_loan_id = escape(loan_payment_dto.loan_id)
        safe_amount = escape(loan_payment_dto.amount)

        # Sanitize the input if HTML is expected
        sanitized_loan_id = bleach.clean(safe_loan_id, tags=[], strip=True)  # Allow no HTML tags
        sanitized_amount = bleach.clean(safe_amount, tags=[], strip=True)  # Allow no HTML tags
    
        new_payment = repo.add_payment(sanitized_loan_id, sanitized_amount)

        return jsonify({ 'message': f"{OperationStatus.SUCCESS}", 'data': new_payment }), 200

    def delete_payment(self, repo: ILoanPaymentRepository):
        data = request.get_json() or {}

        payment_id = data.get('payment_id')
        errors = {}

        if not payment_id or not isinstance(payment_id, int):
            errors['payment_id'] = 'Payment Id is required and must be an integer'
        elif payment_id < 0:
            errors['payment_id'] = 'Payment Id must be larger than or equal to 0'

        if errors:
            return jsonify({ 'message': OperationStatus.FAILURE.with_details(" Validation error!"), 'errors': errors }), 400
        
        deleted_payment = repo.delete_payment(payment_id)

        if not deleted_payment:
            return jsonify({ 'message': OperationStatus.FAILURE.with_details(" Data object not found"), 'errors': errors }), 404

        return jsonify({ 'message': OperationStatus.SUCCESS.with_details("Delete Payment"), 'data': deleted_payment }), 200

    def validate_csrf_token(self, csrf_token: str, serializer: any):
        try:
            serializer.loads(csrf_token, max_age=1800)  # Token expires in 30 min
            return None
        except:
            return jsonify({'error': 'Invalid or expired CSRF token!'}), 403