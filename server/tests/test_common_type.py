import pytest
from custom_types.common_type import PaymentStatus

# Tests for PaymentStatus Enum
def test_payment_status_values():
    """Test PaymentStatus enum values"""
    assert PaymentStatus.SUCCESS.name == "SUCCESS"
    assert PaymentStatus.FAILURE.name == "FAILURE"
    assert PaymentStatus.PENDING.name == "PENDING"

def test_payment_status_string_representation():
    """Test string representation of PaymentStatus"""
    assert str(PaymentStatus.SUCCESS) == "The operation was successful"
    assert str(PaymentStatus.FAILURE) == "The operation failed due to an error"
    assert str(PaymentStatus.PENDING) == "The operation is still in progress"

def test_payment_status_with_details():
    """Test with_details method of PaymentStatus"""
    # With details
    assert PaymentStatus.SUCCESS.with_details("Payment received") == "The operation was successful: Payment received"
    assert PaymentStatus.FAILURE.with_details("Insufficient funds") == "The operation failed due to an error: Insufficient funds"
    
    # Without details
    assert PaymentStatus.PENDING.with_details() == "The operation is still in progress"
    assert PaymentStatus.SUCCESS.with_details("") == "The operation was successful"
