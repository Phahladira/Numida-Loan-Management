from dtos.loan_payment_dto import LoanPaymentsDTO  # Replace `your_module` with the actual module name

# Test valid inputs
def test_validate_valid_input():
    dto = LoanPaymentsDTO(loan_id=1, amount=100.0)
    errors = dto.validate()
    assert errors == {}, "Expected no errors for valid input"

# Test invalid loan_id
def test_validate_invalid_loan_id():
    # Test loan_id as None
    dto = LoanPaymentsDTO(loan_id=None, amount=100.0)
    errors = dto.validate()
    assert errors == {"loan_id": "Loan Id is required and must be an integer"}, "Expected error for missing loan_id"

    # Test loan_id as a string
    dto = LoanPaymentsDTO(loan_id="invalid", amount=100.0)
    errors = dto.validate()
    assert errors == {"loan_id": "Loan Id is required and must be an integer"}, "Expected error for non-integer loan_id"

    # Test loan_id as a negative integer
    dto = LoanPaymentsDTO(loan_id=-1, amount=100.0)
    errors = dto.validate()
    assert errors == {"loan_id": "Loan Id must be larger than or equal to 0"}, "Expected error for negative loan_id"

# Test invalid amount
def test_validate_invalid_amount():
    # Test amount as None
    dto = LoanPaymentsDTO(loan_id=1, amount=None)
    errors = dto.validate()
    assert errors == {"amount": "Payment amount is required and must be a float/integer"}, "Expected error for missing amount"

    # Test amount as a string
    dto = LoanPaymentsDTO(loan_id=1, amount="invalid")
    errors = dto.validate()
    assert errors == {"amount": "Payment amount is required and must be a float/integer"}, "Expected error for non-numeric amount"

    # Test amount as 0
    dto = LoanPaymentsDTO(loan_id=1, amount=0)
    errors = dto.validate()
    assert errors == {"amount": "Payment amount is required and must be a float/integer"}, "Expected error for amount equal to 0"

    # Test amount as a negative number
    dto = LoanPaymentsDTO(loan_id=1, amount=-100.0)
    errors = dto.validate()
    assert errors == {"amount": "Payment amount must be larger than 0"}, "Expected error for negative amount"

# Test multiple invalid inputs
def test_validate_multiple_invalid_inputs():
    dto = LoanPaymentsDTO(loan_id=None, amount=None)
    errors = dto.validate()
    assert errors == {
        "loan_id": "Loan Id is required and must be an integer",
        "amount": "Payment amount is required and must be a float/integer",
    }, "Expected errors for both loan_id and amount"