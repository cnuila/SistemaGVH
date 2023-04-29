from django.urls import path
from .views import (
    DeliveryLocationsDetailApiView,
    DeliveryLocationsListApiView,
)

urlpatterns = [
    path('deliverylocations', DeliveryLocationsListApiView.as_view()),
    path('deliverylocations/<str:d_location_id>', DeliveryLocationsDetailApiView.as_view()),
]