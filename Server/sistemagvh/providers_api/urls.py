from django.urls import path
from .views import (
    ProvidersDetailApiView,
    ProvidersListApiView,
)

urlpatterns = [
    path('providers', ProvidersListApiView.as_view()),
    path('providers/<str:provider_id>', ProvidersDetailApiView.as_view()),   
]