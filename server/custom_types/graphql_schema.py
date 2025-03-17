import graphene
from util.constants import loans, loan_payments

class LoanRepayments(graphene.ObjectType):
    id = graphene.Int()
    loan_id = graphene.Int()
    amount = graphene.Float()
    payment_date = graphene.DateTime()

class ExistingLoans(graphene.ObjectType):
    id = graphene.Int()
    name = graphene.String()
    interest_rate = graphene.Float()
    principal = graphene.Int()
    due_date = graphene.DateTime()
    repayments = graphene.List(LoanRepayments)

    def resolve_repayments(parent, info):
        # List comprehension
        return [repayment for repayment in loan_payments if repayment["loan_id"] == parent['id']]

class Query(graphene.ObjectType):
    #TODO: Enhancements, add more filtering options
    loans = graphene.List(ExistingLoans)

    loan_payments = graphene.List(LoanRepayments)

    def resolve_loans(self, info):
        return loans
    
    def resolve_loan_payments(self, info):
        return loan_payments

