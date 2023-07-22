from django.urls import path
from .views import (
    DashboardProductsByLocationApiView,
)

urlpatterns = [
    path('dashboard/<int:location_id>/', DashboardProductsByLocationApiView.as_view())
]