from django.urls import path
from .views import (
    ProductDeliveryListApiView,
    ProductDeliveryDetailApiView,
    ProductDeliveryListWithReturnsApiView
)

urlpatterns = [
    path('productdelivery', ProductDeliveryListApiView.as_view()),
    path('productdelivery/returns', ProductDeliveryListWithReturnsApiView.as_view()),
    path('productdelivery/<str:prod_deliv_id>', ProductDeliveryDetailApiView.as_view()),
]