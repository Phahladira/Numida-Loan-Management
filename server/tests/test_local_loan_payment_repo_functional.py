import pytest
from datetime import date
from repository.local_loan_payments_repo_imp import LocalLoanPaymentRepository

# Fixture to create a repository instance for testing
@pytest.fixture
def repo():
    return LocalLoanPaymentRepository()

# Test adding a payment
def test_add_payment(repo):
    # Add a payment
    payment = repo.add_payment(loan_id=1, amount=100.0)

    # Check the returned payment
    assert payment == {
        "id": 1,
        "loan_id": 1,
        "amount": 100.0,
        "payment_date": date.today(),
    }

    # Check that the payment was added to the repository
    payments = repo.get_payments()
    assert len(payments) == 1
    assert payments[0] == payment

# Test adding multiple payments
def test_add_multiple_payments(repo):
    # Add first payment
    payment1 = repo.add_payment(loan_id=1, amount=100.0)
    assert payment1["id"] == 1

    # Add second payment
    payment2 = repo.add_payment(loan_id=2, amount=200.0)
    assert payment2["id"] == 2

    # Check that both payments were added
    payments = repo.get_payments()
    assert len(payments) == 2
    assert payments[0] == payment1
    assert payments[1] == payment2

# Test initializing the repository with existing payments
def test_repo_with_initial_payments():
    initial_payments = [
        {"id": 1, "loan_id": 1, "amount": 100.0, "payment_date": date.today()},
    ]
    repo = LocalLoanPaymentRepository(loan_payments=initial_payments)

    # Check that the initial payments are loaded
    payments = repo.get_payments()
    assert len(payments) == 1
    assert payments[0] == initial_payments[0]

    # Add a new payment
    new_payment = repo.add_payment(loan_id=2, amount=200.0)
    assert new_payment["id"] == 2

    # Check that the new payment was added
    payments = repo.get_payments()
    assert len(payments) == 2
    assert payments[1] == new_payment

# Test getting payments from an empty repository
def test_get_payments_empty_repo(repo):
    payments = repo.get_payments()
    assert len(payments) == 0

# Test repository with initial data
def test_repo_with_initial_data():
    initial_payments = [
        {"id": 1, "loan_id": 1, "amount": 100.0, "payment_date": date.today()},
    ]
    repo = LocalLoanPaymentRepository(loan_payments=initial_payments)

    # Add a new payment
    new_payment = repo.add_payment(loan_id=2, amount=200.0)

    # Retrieve payments
    payments = repo.get_payments()

    # Check that the initial and new payments are present
    assert len(payments) == 2
    assert payments[0] == initial_payments[0]
    assert payments[1] == new_payment