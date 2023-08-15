from django.urls import path
from .views import (
    LogsApiView,
)

urlpatterns = [
    path('Logs', LogsApiView().as_view())
]