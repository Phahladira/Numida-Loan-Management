
from flask import jsonify

from custom_types.common_type import OperationStatus

class Response:
    @staticmethod
    def make_error( msg='', code=400 ,data=[]):
        return jsonify({ 'message': OperationStatus.FAILURE.with_details(msg), 'errors': data }), code
    
    def make_success( msg='', code=200 ,data=[]):
        return jsonify({ 'message': OperationStatus.SUCCESS.with_details(msg), 'data': data }), code