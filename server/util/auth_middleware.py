import jwt
from flask import request
from functools import wraps

from util.response import Response
from util.constants import JWT_SECRETKEY

class AuthMiddleware:
    def middleware(self, func):
        @wraps(func)
        def decorator():
            token = request.headers.get('x-auth-token')
            
            if not token:
                return Response.make_error('Forbidden access', 401)
            try:
                jwt.decode(token, JWT_SECRETKEY, algorithms='HS256')
            except jwt.ExpiredSignatureError:
                return Response.make_error('Unauthorized', 401)
            except jwt.InvalidTokenError:
                return Response.make_error('Invalid token', 401)
            return func()
        return decorator