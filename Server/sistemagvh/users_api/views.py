from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from auth_firebase.authentication import FirebaseAuthentication
from firebase_admin import auth
from .models import User
from .serializers import UserSerializer

# methods under /users
class UserListApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # retrieve every user on the db
    def get(self, request, *args, **kwargs):
        users = User.objects.order_by("id")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    

# methods under users/<str:userUId>
class UserDetailApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    def get_user(self, user_UId):
        try:
            return User.objects.get(userUId=user_UId)
        except User.DoesNotExist:
            return None

    # get the user by user UId
    def get(self, request, user_UId, *args, **kwargs):
        current_user = self.get_user(user_UId)
        if not current_user:
            return Response(
                {"res": "No se encontró el usuario con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = UserSerializer(current_user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    # delete the user by user UId
    def delete(self, request, user_UId, *args, **kwargs):
        # this deletes the user from Firebase
        was_deleted = FirebaseAuthentication.delete_user(self, uid=user_UId)

        if was_deleted:
            user_to_delete = self.get_user(user_UId)
            if not user_to_delete:
                return Response(
                    {"res": "No se encontró el usuario con ese Id."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            user_to_delete.delete()
            return Response(
                {"res": "Usuraio eliminado."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"res": "No se puedo eliminar el usuario."},
                status=status.HTTP_400_BAD_REQUEST                
            )

# methods under users/admin/<str:user_id>
class AdminUserApiView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [FirebaseAuthentication]

    # update the isAdmin boolean for the user sent
    def put(self, request, user_id, *args, **kwargs):
        new_admin_user = User.objects.get(id=user_id)
        if not new_admin_user:
            return Response(
                {"res": "No se encontró el usuario con ese Id."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = {
            'isAdmin': True, 
        }
        serializer = UserSerializer(instance = new_admin_user, data=data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# methods under users/register
class RegisterApiView(APIView):
    authentication_classes = []
    permission_classes = []

    # add the user to the table and create their user in Firebase
    def post(self, request, *args, **kwargs):
        user_to_add = {
            'userName': request.data.get('userName'),
            'userUId': request.data.get('userUId'),
            'firstName': request.data.get('firstName'),
            'lastName': request.data.get('lastName'),
            'password': request.data.get('password'),
            'isAdmin': False,                        
        }

        user = auth.create_user(
            email=user_to_add['userName'],
            email_verified=False,
            password=user_to_add['password'],
            display_name=user_to_add['firstName'] + ' ' + user_to_add['lastName'],
            disabled=False
        )

        user_to_add['userUId'] = user.uid        
        serializer = UserSerializer(data=user_to_add)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)