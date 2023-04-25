from django.urls import path
from .views import (
    ProductsListApiView,
    ProductsDetailApiView,
)

urlpatterns = [
    path('products', ProductsListApiView.as_view()),
    path('products/<str:product_id>', ProductsDetailApiView.as_view()),
]