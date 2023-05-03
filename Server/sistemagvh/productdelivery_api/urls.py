from django.urls import path
from .views import (
    ProductDeliveryListApiView,
    ProductDeliveryDetailApiView,
)

urlpatterns = [
    path('productdelivery', ProductDeliveryListApiView.as_view()),
    path('productdelivery/<str:prod_deliv_id>', ProductDeliveryDetailApiView.as_view()),
]