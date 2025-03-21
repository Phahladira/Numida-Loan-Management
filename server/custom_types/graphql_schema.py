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
        repo = info.context['payment_repo']
        return repo.get_repayments_by_loan_id(parent['id'])
    
class Query(graphene.ObjectType):
    loans = graphene.List(ExistingLoans, id=graphene.Int())
    loan_payments = graphene.List(LoanRepayments, loanId=graphene.Int())

    def resolve_loans(self, info, id=None):
        repo = info.context['loans_repo']

        if id is not None:
            return repo.get_loan_by_id(id)

        return repo.get_loans()

    def resolve_loan_payments(self, info, loanId=None):
        repo = info.context['payment_repo']
        
        if loanId is not None:
            return repo.get_repayments_by_loan_id(loanId)
        
        return repo.get_repayments()
