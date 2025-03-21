import datetime
from dtos.loans_dto import LoansDTO  # Replace `your_module` with the actual module name


def test_valid_loans_dto():
    # Valid input
    valid_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-12-31",
        principal=1000,
        interest_rate=5.0,
    )
    errors = valid_loan.validate()
    assert errors == {}, "Expected no errors for valid input"


def test_invalid_name():
    # Name is too short
    invalid_name_loan = LoansDTO(
        name="A",
        due_date="2025-12-31",
        principal=1000,
        interest_rate=5.0,
    )
    errors = invalid_name_loan.validate()
    assert "name" in errors, "Expected 'name' error for invalid name"
    assert errors["name"] == "Name is not valid", "Incorrect error message for invalid name"

    # Name is missing
    missing_name_loan = LoansDTO(
        name="",
        due_date="2025-12-31",
        principal=1000,
        interest_rate=5.0,
    )
    errors = missing_name_loan.validate()
    assert "name" in errors, "Expected 'name' error for missing name"
    assert errors["name"] == "Name is required and must be an string", "Incorrect error message for missing name"


def test_invalid_due_date():
    # Due date is in the past
    past_date_loan = LoansDTO(
        name="Valid Loan",
        due_date="2020-01-01",
        principal=1000,
        interest_rate=5.0,
    )
    errors = past_date_loan.validate()
    assert "due_date" in errors, "Expected 'due_date' error for past date"
    assert errors["due_date"] == "Due date is not valid", "Incorrect error message for past date"

    # Due date is invalid format
    invalid_format_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-31-12",  # Invalid format
        principal=1000,
        interest_rate=5.0,
    )
    errors = invalid_format_loan.validate()
    assert "due_date" in errors, "Expected 'due_date' error for invalid format"
    assert errors["due_date"] == "Due date is not valid", "Incorrect error message for invalid format"

    # Due date is missing
    missing_date_loan = LoansDTO(
        name="Valid Loan",
        due_date="",
        principal=1000,
        interest_rate=5.0,
    )
    errors = missing_date_loan.validate()
    assert "due_date" in errors, "Expected 'due_date' error for missing date"
    assert errors["due_date"] == "Due date is required and must be an string", "Incorrect error message for missing date"


def test_invalid_principal():
    # Principal is zero
    zero_principal_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-12-31",
        principal=0,
        interest_rate=5.0,
    )
    errors = zero_principal_loan.validate()
    assert "principal" in errors, "Expected 'principal' error for zero principal"
    assert errors["principal"] == "Principal is required and must be a float/integer", "Incorrect error message for zero principal"

    # Principal is negative
    negative_principal_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-12-31",
        principal=-100,
        interest_rate=5.0,
    )
    errors = negative_principal_loan.validate()
    assert "principal" in errors, "Expected 'principal' error for negative principal"
    assert errors["principal"] == "Principal must be larger than 0", "Incorrect error message for negative principal"

    # Principal is missing
    missing_principal_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-12-31",
        principal=None,
        interest_rate=5.0,
    )
    errors = missing_principal_loan.validate()
    assert "principal" in errors, "Expected 'principal' error for missing principal"
    assert errors["principal"] == "Principal is required and must be a float/integer", "Incorrect error message for missing principal"


def test_invalid_interest_rate():
    # Interest rate is zero
    zero_interest_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-12-31",
        principal=1000,
        interest_rate=0,
    )
    errors = zero_interest_loan.validate()
    assert "interest_rate" in errors, "Expected 'interest_rate' error for zero interest rate"
    assert errors["interest_rate"] == "Interest rate is required and must be a float/integer", "Incorrect error message for zero interest rate"

    # Interest rate is negative
    negative_interest_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-12-31",
        principal=1000,
        interest_rate=-5.0,
    )
    errors = negative_interest_loan.validate()
    assert "interest_rate" in errors, "Expected 'interest_rate' error for negative interest rate"
    assert errors["interest_rate"] == "Interest rate must be larger than 0", "Incorrect error message for negative interest rate"

    # Interest rate is missing
    missing_interest_loan = LoansDTO(
        name="Valid Loan",
        due_date="2025-12-31",
        principal=1000,
        interest_rate=None,
    )
    errors = missing_interest_loan.validate()
    assert "interest_rate" in errors, "Expected 'interest_rate' error for missing interest rate"
    assert errors["interest_rate"] == "Interest rate is required and must be a float/integer", "Incorrect error message for missing interest rate"


def test_validate_name():
    # Valid name
    valid_name = "Valid Loan"
    assert LoansDTO(valid_name, "2025-12-31", 1000, 5.0).validate_name(), "Expected valid name to pass validation"

    # Name is too short
    short_name = "A"
    assert not LoansDTO(short_name, "2025-12-31", 1000, 5.0).validate_name(), "Expected short name to fail validation"

    # Name is too long
    long_name = "This is a very long loan name that exceeds the limit"
    assert not LoansDTO(long_name, "2025-12-31", 1000, 5.0).validate_name(), "Expected long name to fail validation"


def test_is_valid_date():
    # Valid future date
    future_date = (datetime.datetime.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%d")
    assert LoansDTO("Valid Loan", future_date, 1000, 5.0).is_valid_date(), "Expected future date to be valid"

    # Past date
    past_date = "2020-01-01"
    assert not LoansDTO("Valid Loan", past_date, 1000, 5.0).is_valid_date(), "Expected past date to be invalid"

    # Invalid format
    invalid_format = "2025-31-12"
    assert not LoansDTO("Valid Loan", invalid_format, 1000, 5.0).is_valid_date(), "Expected invalid format to be invalid"

    # Missing date
    missing_date = ""
    assert not LoansDTO("Valid Loan", missing_date, 1000, 5.0).is_valid_date(), "Expected missing date to be invalid"