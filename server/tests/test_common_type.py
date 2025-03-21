from custom_types.common_type import OperationStatus

# Tests for OperationStatus Enum
def test_payment_status_values():
    """Test OperationStatus enum values"""
    assert OperationStatus.SUCCESS.name == "SUCCESS"
    assert OperationStatus.FAILURE.name == "FAILURE"
    assert OperationStatus.PENDING.name == "PENDING"

def test_payment_status_string_representation():
    """Test string representation of OperationStatus"""
    assert str(OperationStatus.SUCCESS) == "The operation was successful"
    assert str(OperationStatus.FAILURE) == "The operation failed due to an error"
    assert str(OperationStatus.PENDING) == "The operation is still in progress"

def test_payment_status_with_details():
    """Test with_details method of OperationStatus"""
    # With details
    assert OperationStatus.SUCCESS.with_details("Payment received") == "The operation was successful: Payment received"
    assert OperationStatus.FAILURE.with_details("Insufficient funds") == "The operation failed due to an error: Insufficient funds"
    
    # Without details
    assert OperationStatus.PENDING.with_details() == "The operation is still in progress"
    assert OperationStatus.SUCCESS.with_details("") == "The operation was successful"
