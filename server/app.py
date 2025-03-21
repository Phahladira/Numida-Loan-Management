import datetime
import graphene

from typing import Callable
from flask_cors import CORS
from flask import Flask, jsonify
from flask_graphql import GraphQLView
from itsdangerous import URLSafeTimedSerializer
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from custom_types.graphql_schema import Query
from util.auth_middleware import AuthMiddleware
from repository.iusers_repo import IUsersRepository
from repository.iloans_repo import ILoansRepository
from controllers.user_controller import AuthController
from controllers.loans_controller import LoansController
from util.constants import loan_payments, loans, users,SERIALIZE_KEY
from repository.local_loans_repo_imp import LocalLoansRepository
from repository.local_users_repo_imp import LocalUsersRepository
from repository.iloan_payments_repo import ILoanPaymentRepository
from controllers.payments_controller import LoanPaymentsController
from repository.local_loan_payments_repo_imp import LocalLoanPaymentRepository

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    methods=['POST', 'GET', 'DELETE'],
    headers=['Content-Type', 'x-auth-token', 'x-csrf-token'],
    origin='http://127.0.0.1:5173'
)  # Allow credentials (cookies) in CORS requests

schema = graphene.Schema(query=Query)
serializer = URLSafeTimedSerializer(SERIALIZE_KEY)

# Initialize the Limiter
limiter = Limiter(
    get_remote_address,  # Use the client's IP address for rate limiting
    app=app,
    default_limits=["1000 per day", "200 per hour"]  # Default limits for all routes
)


# Initialize the repository
auth=AuthMiddleware()
loans_repo = LocalLoansRepository(loans=loans)
users_repo = LocalUsersRepository(users=users)
loan_payment_repo = LocalLoanPaymentRepository(loan_payments=loan_payments)


# Wrap the GraphQLView with the auth middleware
def graphql_view():
    return GraphQLView.as_view(
        "graphql",
        schema=schema,
        graphiql=True,
        get_context=lambda: {
            'loans_repo': loans_repo,
            'payment_repo': loan_payment_repo,
        }
    )()

# Add the GraphQL endpoint with rate limiting and auth middleware
@app.route("/graphql", methods=["GET", "POST"])
@limiter.limit("100 per hour")  # Apply rate limiting
# @auth.middleware
def graphql():
    return graphql_view()

@app.route("/")
def home():
    return "Welcome to the Loan Application API"

def loans_routes(repo: ILoansRepository) -> Callable:
    @limiter.limit
    @auth.middleware
    @app.route("/api/v1/loans", methods=['POST'])
    def add_loan():
            return LoansController().add_loan(repo=repo, serializer=serializer)
    
    @limiter.limit
    @auth.middleware
    @app.route("/api/v1/loans/<int:id>", methods=['DELETE'])
    def delete_loan(id: int):
        return LoansController().delete_loan(repo=repo, id=id)
    
    return add_loan, delete_loan
    
def payment_routes(repo: ILoanPaymentRepository) -> Callable:
    @limiter.limit
    @auth.middleware
    @app.route("/api/v1/payments", methods=['POST'])
    def add_payment():
        return LoanPaymentsController().add_payment(repo=repo, serializer=serializer)
    
    @limiter.limit
    @auth.middleware
    @app.route("/api/v1/payments", methods=['DELETE'])
    def delete_payment():
        return LoanPaymentsController().delete_payment(repo=repo)

    return add_payment, delete_payment

def authentication_routes(repo: IUsersRepository) -> Callable:
    @limiter.limit
    @app.route("/api/v1/auth/login", methods=['POST'])
    def login():
        return AuthController().login(repo, serializer)
    
    @limiter.limit
    @app.route("/api/v1/auth/sign-up", methods=['POST'])
    def sign_up():
        return AuthController().sign_up(repo)
    
    @limiter.limit
    @app.route("/api/v1/auth/logout", methods=['GET'])
    def log_out():
        return AuthController().log_out()
    
    return login, sign_up, log_out

# Error handler for rate limit exceeded
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded", "message": str(e.description)}), 429

# Register the route with the repository injected
loans_routes(loans_repo)
authentication_routes(users_repo)
payment_routes(loan_payment_repo)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
