from django.urls import path
from .views import (
    DeliveryZonesDetailApiView,
    DeliveryZonesListApiView,
)

urlpatterns = [
    path('deliveryzones', DeliveryZonesListApiView.as_view()),
    path('deliveryzones/<str:d_zone_id>', DeliveryZonesDetailApiView.as_view()),   
]