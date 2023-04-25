from rest_framework import status
from rest_framework.exceptions import APIException

class NoAuthToken(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "No autorizado"
    default_code = "no_auth_token"


class InvalidAuthToken(APIException):
    status_code = status.HTTP_401_UNAUTHORIZED
    default_detail = "No autorizado"
    default_code = "invalid_token"