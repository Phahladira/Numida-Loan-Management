import jwt
import bleach
from markupsafe import escape
from datetime import datetime, timedelta
from flask import make_response, request

from util.response import Response
from dtos.user_dto import UsersDTO
from util.constants import IS_PROD, JWT_SECRETKEY
from repository.iusers_repo import IUsersRepository
from custom_types.common_type import OperationStatus
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError


class AuthController:

    def login(self, repo: IUsersRepository, serializer: any):
        user = None

        data = request.get_json() or {}

        user_dto = UsersDTO(
            username=data.get("username"),
            password=data.get("password"),
        )

        validation_errors = user_dto.validate()

        if validation_errors:
            return make_response(Response.make_error("Validation error!", validation_errors, 400))

        # Escape the input for general safety
        safe_username = escape(user_dto.username)
        safe_password = escape(user_dto.password)

        # Sanitize the input if HTML is expected
        sanitized_username = bleach.clean(safe_username, tags=[], strip=True)  # Allow no HTML tags
        sanitized_password = bleach.clean(safe_password, tags=[], strip=True)  # Allow no HTML tags

        # Validate the user
        user = repo.validate_user(sanitized_username, sanitized_password)

        if not user:
            return make_response(Response.make_error("Username or Password was incorrect", 401))

        try:
            # Create a JWT token
            token = self.create_token(user)
            # Return the token in the response body
            return make_response(Response.make_success("Login successful", data={"token": token, "csrf": serializer.dumps('csrf_token')}))
        except Exception as e:
            return make_response(Response.make_error("Failed to create access token", 400))

    def sign_up(self, repo: IUsersRepository):
        user = None

        data = request.get_json() or {}

        user_dto = UsersDTO(
            username=data.get("username"),
            password=data.get("password"),
        )

        validation_errors = user_dto.validate()

        if validation_errors:
            return make_response(Response.make_error("Validation error!", validation_errors, 400))

        # Escape the input for general safety
        safe_username = escape(user_dto.username)
        safe_password = escape(user_dto.password)

        # Sanitize the input if HTML is expected
        sanitized_username = bleach.clean(safe_username, tags=[], strip=True)  # Allow no HTML tags
        sanitized_password = bleach.clean(safe_password, tags=[], strip=True)  # Allow no HTML tags

        # Create the user
        user = repo.create_user(sanitized_username, sanitized_password)

        if not user:
            return make_response(Response.make_error("Username already exists", 400))

        return make_response(Response.make_success("Sign Up successful", data=user))

    def create_token(self, user):
        token = jwt.encode(
            payload={
                "userId": user["id"],
                "username": user["username"],  # Fixed duplicate key 'userId'
                "exp": datetime.utcnow() + timedelta(minutes=30)  # Token expires in 30 minutes
            },
            key=JWT_SECRETKEY,
            algorithm="HS256"
        )
        return token

    def log_out(self):
        # Since we're using Bearer Token, logout is handled client-side by removing the token
        return make_response(Response.make_success("Logout successful"))
