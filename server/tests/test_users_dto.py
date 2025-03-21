from dtos.user_dto import UsersDTO  # Replace `dtos.users_dto` with the actual module path


def test_valid_users_dto():
    # Valid input
    valid_user = UsersDTO(
        username="valid_user_123",
        password="password123",
    )
    errors = valid_user.validate()
    assert errors == {}, "Expected no errors for valid input"


def test_invalid_username():
    # Username is too short
    short_username_user = UsersDTO(
        username="ab",
        password="password123",
    )
    errors = short_username_user.validate()
    assert "username" in errors, "Expected 'username' error for short username"
    assert errors["username"] == "Username is not valid", "Incorrect error message for short username"

    # Username is too long
    long_username_user = UsersDTO(
        username="this_is_a_very_long_username_that_exceeds_the_limit",
        password="password123",
    )
    errors = long_username_user.validate()
    assert "username" in errors, "Expected 'username' error for long username"
    assert errors["username"] == "Username is not valid", "Incorrect error message for long username"

    # Username contains invalid characters
    invalid_char_username_user = UsersDTO(
        username="invalid@user",
        password="password123",
    )
    errors = invalid_char_username_user.validate()
    assert "username" in errors, "Expected 'username' error for invalid characters"
    assert errors["username"] == "Username is not valid", "Incorrect error message for invalid characters"

    # Username is missing
    missing_username_user = UsersDTO(
        username="",
        password="password123",
    )
    errors = missing_username_user.validate()
    assert "username" in errors, "Expected 'username' error for missing username"
    assert errors["username"] == "Username is not valid", "Incorrect error message for missing username"


def test_invalid_password():
    # Password is too short
    short_password_user = UsersDTO(
        username="valid_user_123",
        password="pass",
    )
    errors = short_password_user.validate()
    assert "password" in errors, "Expected 'password' error for short password"
    assert errors["password"] == "Password is not valid", "Incorrect error message for short password"

    # Password is too long
    long_password_user = UsersDTO(
        username="valid_user_123",
        password="this_is_a_very_long_password_that_exceeds_the_limit",
    )
    errors = long_password_user.validate()
    assert "password" in errors, "Expected 'password' error for long password"
    assert errors["password"] == "Password is not valid", "Incorrect error message for long password"

    # Password is missing
    missing_password_user = UsersDTO(
        username="valid_user_123",
        password="",
    )
    errors = missing_password_user.validate()
    assert "password" in errors, "Expected 'password' error for missing password"
    assert errors["password"] == "Password is not valid", "Incorrect error message for missing password"


def test_validate_username():
    # Valid username
    valid_username = "valid_user_123"
    assert UsersDTO(valid_username, "password123").validate_username(), "Expected valid username to pass validation"

    # Username is too short
    short_username = "ab"
    assert not UsersDTO(short_username, "password123").validate_username(), "Expected short username to fail validation"

    # Username is too long
    long_username = "this_is_a_very_long_username_that_exceeds_the_limit"
    assert not UsersDTO(long_username, "password123").validate_username(), "Expected long username to fail validation"

    # Username contains invalid characters
    invalid_char_username = "invalid@user"
    assert not UsersDTO(invalid_char_username, "password123").validate_username(), "Expected invalid characters to fail validation"


def test_validate_password():
    # Valid password
    valid_password = "password123"
    assert UsersDTO("valid_user_123", valid_password).validate_password(), "Expected valid password to pass validation"

    # Password is too short
    short_password = "pass"
    assert not UsersDTO("valid_user_123", short_password).validate_password(), "Expected short password to fail validation"

    # Password is too long
    long_password = "this_is_a_very_long_password_that_exceeds_the_limit"
    assert not UsersDTO("valid_user_123", long_password).validate_password(), "Expected long password to fail validation"