from django.urls import path
from .views import (
    DashboardProductsByLocationApiView,
    DashboardExpirationByProductApiView,
    DashboardMonthlyDeliveriesApiView,
    DashboardExpiredProductsApiView,
)

urlpatterns = [
    path('dashboard/PPL/<int:location_id>/<int:month>/<str:year>', DashboardProductsByLocationApiView.as_view()),
    path('dashboard/EPP/<int:product_id>/', DashboardExpirationByProductApiView.as_view()),
    path('dashboard/MD/<str:year>/', DashboardMonthlyDeliveriesApiView.as_view()),
    path('dashboard/EP/', DashboardExpiredProductsApiView.as_view()),
]