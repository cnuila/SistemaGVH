from django.urls import path
from .views import (
    UserListApiView,
    UserDetailApiView,
    RegisterApiView,
    AdminUserApiView
)

urlpatterns = [
    path('users', UserListApiView.as_view()),
    path('users/<str:user_UId>', UserDetailApiView.as_view()),
    path('register', RegisterApiView.as_view()),
    path('users/admin/<str:user_id>', AdminUserApiView.as_view()),
]