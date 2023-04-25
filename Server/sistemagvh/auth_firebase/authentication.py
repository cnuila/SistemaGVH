from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import User
from auth_firebase import exceptions
import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate({
    "type": "service_account",
    "project_id": "sistemagvh",
    "private_key_id": "4c5f31a5a10843a33a81ccbd6fadf2a72814743f",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDKubt01gbhi3J\nLWJ5f2/tyN8DdLSedymlPplVM1PMpHQxRyLdPDqGQPcQk2Fn9K+BE/8biZNxviwQ\nz1wDEn6ixUPBeIAr+WrLNHXL5txBcTvvNPDFxq4Rynxen3YDygVR1OVglZcqR2vc\nKTcFhdwUOuZeSyoFu8F7DRR+ar35dT6ZjgM35BWaVxrafYsy5t7mIm5YJJ1+cb7b\nlpKkkv9z0zKamceffg7ZblyvnCgwxIl/AIgJC7R9EmSMF7SMifCRlx86+HZDP8Io\n5mHZ885aXQK8cd2TU7GC/WvcIY/mD+K3/ziTSm+953Y0gXwG1oBLDuFG6NbXs8Y6\nwtC3eUpjAgMBAAECggEAEm8E7MWfdsoPnQbKXEtrGPx2A++L98OtjUwCU4fLjHKj\n/tuHMXo01OVh8JDbDGSSBxEKcWFnKcEajGPpfujKSTl0ktt8z6p5KcREtAOUHiJB\n1PAdJbEEU+3aHV3WWblFE1uWZq76XiXszBigd8cS6F4/z/wtdekr9yFfJCmU0/DS\nim7NIHnIdUCuH3cvge8PRXMprR0F9htbzUTpJ8HfRCMzB3WPeHDyCOv/oUyLA3ge\n+rcKZ6a7nTc3kWSVaHRd9050nEhjvKauVCA7Z4xOle0XtMnQkfHNJMfRmGq7lC36\n9Y+m7GKI8taX0TKAIedEy755odxicrSjPXUB7sLMgQKBgQD4HISXGZxQI4t8EXwU\nLy8D1JJIUhX2v251BQbr7AquYhMjh+WEBHyr7UYxqXGH1CUrSElmPwH+MkO6uvs/\nLIFIlpnDvOBfCyuMkVJaCextQpZGouwymb9H8QPUNHA75FDGP7D+kUBWbdA7QakC\nMMB362d+DuLSHVgeRMHJs4OQwwKBgQDJX3PPkgra7UcOMepuHinJLmmOpUC7S5J4\nYVNq+UFOQbSDbKwzzpoOj0SEItxy3lqdNQ9sned/s/w01X0eO/rTVgpY0K8gMR0a\nGQCnS14O3Y8VWmPIGahNLNvMv2sFeTQv7TzrWGpSqNykQJVsK/fQKz5Ip1seUwDW\nm5ZZ/LvF4QKBgQDQxd5j7q7zWBWE3omTymg7RuGYbUoCCO7/FK3QUxxhxDDqku1z\n+vqVCOEp5LSdYMut8fOhT59zsAQB2liTvfVDiUX1yLbcAuAwNhAfp34EKiWdZnZt\n1aV4+bsJEt7l5qZ5Sxq5+qsyjtDLK+L07uTlg3XgQtJljz+YqK6P9LfeVQKBgDsI\nLF8RJPWA0W+r2lllpkI/xNn4P72oLcv0XAvj/ez+/ff5B5I4YpkaDq/duFpELLQh\nNeBVeePJ04l5fDA8zQ7fDjFzG6OIQkvAQJzKT0x0TtmnodCrFNdq6xRemPUFzvKt\nzUoApUqODgBonmUTjpYL1zpdNSzykDBZc/31ROaBAoGAFaD3wJx7ZcT5hJn457dV\neJycW5AUSo3OvMzdrUxU47ifm5zIdx3X00aql/JwEcPSCAHbVY0/ViGu+fH78sYQ\nD4YVFR8aLDObVW5qmQ3VglBXn1roVLRPgJLuPgAC9RVahDy71v+ol8smTz3znQu3\nZ9LVnBVALjv6+VhFxxUhlb0=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-4nexf@sistemagvh.iam.gserviceaccount.com",
    "client_id": "100397029869442169491",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4nexf%40sistemagvh.iam.gserviceaccount.com"
})

default_app = firebase_admin.initialize_app(cred)


class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            raise exceptions.NoAuthToken()
        id_token = auth_header.split(" ").pop()
        decoded_token = None

        try:
            decoded_token = auth.verify_id_token(id_token)
        except Exception:
            raise exceptions.InvalidAuthToken()

        if not id_token or not decoded_token:
            return None

        uid = decoded_token.get("uid")
        email = decoded_token.get("email")

        user, created = User.objects.get_or_create(username=uid, email=email)
        return (user, None)

    def delete_user(self, uid):
        try:
            auth.delete_user(uid)
            return True
        except:
            return False