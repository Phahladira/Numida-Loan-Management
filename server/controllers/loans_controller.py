import bleach
import datetime
from markupsafe import escape
from flask import request, jsonify

from dtos.loans_dto import LoansDTO
from custom_types.common_type import OperationStatus
from repository.iloans_repo import ILoansRepository

class LoansController:

    def add_loan(self, repo: ILoansRepository, serializer: any):
        data = request.get_json() or {}

        loan_dto = LoansDTO(
            name=data.get('name'),
            due_date=data.get('due_date'),
            principal=data.get('principal'),
            interest_rate=data.get('interest_rate'),
        )

        validation_errors = loan_dto.validate()

        if validation_errors:
            return jsonify({ 'message': OperationStatus.FAILURE.with_details(" Validation error!"), 'errors': validation_errors }), 400

        csrf_token = request.headers.get('x-csrf-token')
        csrf_token_validation_response = self.validate_csrf_token(csrf_token, serializer)

        if  csrf_token_validation_response:
            return csrf_token_validation_response
        
        # Escape the input for general safety
        safe_name = escape(loan_dto.name)
        safe_principal = escape(loan_dto.principal)
        safe_interest_rate = escape(loan_dto.interest_rate)
        safe_due_date = escape(loan_dto.due_date)

        # Sanitize the input if HTML is expected
        sanitized_name = bleach.clean(safe_name, tags=[], strip=True)  # Allow no HTML tags
        sanitized_principal = bleach.clean(safe_principal, tags=[], strip=True)  # Allow no HTML tags
        sanitized_interest_rate= bleach.clean(safe_interest_rate, tags=[], strip=True)  # Allow no HTML tags
        sanitized_safe_due_date= bleach.clean(safe_due_date, tags=[], strip=True)  # Allow no HTML tags

        parsed_date = self.string_to_date(sanitized_safe_due_date)

        new_loan = repo.add_loan(
            name=sanitized_name,
            principal=sanitized_principal,
            interest_rate=sanitized_interest_rate,
            due_date=parsed_date
        )

        return jsonify({ 'message': f"{OperationStatus.SUCCESS}", 'data': new_loan }), 200

    def delete_loan(self, repo: ILoansRepository, id: int):
        errors = {}

        if not id or not isinstance(id, int):
            errors['id'] = 'Id is required and must be an integer'
        elif id < 0:
            errors['id'] = 'Id must be larger than or equal to 0'

        if errors:
            return jsonify({ 'message': OperationStatus.FAILURE.with_details(" Validation error!"), 'errors': errors }), 400
        
        deleted_loan = repo.delete_loan(id)

        if not deleted_loan:
            return jsonify({ 'message': OperationStatus.FAILURE.with_details(" Data object not found"), 'errors': errors }), 404

        return jsonify({ 'message': OperationStatus.SUCCESS.with_details("Delete Loan"), 'data': deleted_loan }), 200

    def validate_csrf_token(self, csrf_token: str, serializer: any):
        try:
            serializer.loads(csrf_token, max_age=1800)  # Token expires in 30 min
            return None
        except:
            return jsonify({'error': 'Invalid or expired CSRF token!'}), 403
        
    def string_to_date(self, date_str: str) -> datetime.date:
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
            "%Y%m%d",    # YYYYMMDD (no separators)
        ]

        # Try each format until a match is found
        for fmt in formats:
            try:
                datetime_obj = datetime.datetime.strptime(date_str, fmt)
                return datetime_obj.date()
            except ValueError:
                continue

        # If no format matches, raise an error
        raise ValueError(f"Date string '{date_str}' does not match any supported format.")