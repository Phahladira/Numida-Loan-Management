import datetime
import graphene

from typing import Callable
from flask_cors import CORS
from flask_graphql import GraphQLView
from flask import Flask, request, jsonify

from custom_types.common_type import PaymentStatus
from custom_types.graphql_schema import Query
from util.constants import loan_payments
from dtos.loan_payment_dto import LoanPaymentsDTO
from repository.iloan_payments_repo import ILoanPaymentRepository
from repository.local_loan_payments_repo_imp import LocalLoanPaymentRepository


app = Flask(__name__)
CORS(app)

schema = graphene.Schema(query=Query)

app.add_url_rule(
    "/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True)
)


@app.route("/")
def home():
    return "Welcome to the Loan Application API"

def add_payment_route(repo: ILoanPaymentRepository) -> Callable:
    @app.route("/v1/payments", methods=['POST'])
    def add_payment():
        data = request.get_json() or {}

        loan_payment_dto = LoanPaymentsDTO(
            loan_id=data.get('loan_id'),
            amount=data.get('amount'),
        )

        validation_errors = loan_payment_dto.validate()

        if validation_errors:
            return jsonify({ 'message': PaymentStatus.FAILURE.with_details(" Validation error!"), 'errors': validation_errors }), 400

        new_payment = repo.add_payment(loan_payment_dto.loan_id, loan_payment_dto.amount)

        return jsonify({ 'message': f"{PaymentStatus.SUCCESS}", 'data': new_payment }), 200

    return add_payment

# Initialize the repository
loan_payment_repo = LocalLoanPaymentRepository(loan_payments=loan_payments)

# Register the route with the repository injected
add_payment_route(loan_payment_repo)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
