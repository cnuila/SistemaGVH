from django.urls import path
from .views import (
    DashboardProductsByLocationApiView,
    DashboardExpirationByProductApiView,
    DashboardAvgMonthlyDeliveredApiView,
    DashboardExpiredProductsApiView,
)

urlpatterns = [
    path('dashboard/PPL/<int:location_id>/<int:month>/<str:year>', DashboardProductsByLocationApiView.as_view()),
    path('dashboard/EPP/<int:product_id>/', DashboardExpirationByProductApiView.as_view()),
    path('dashboard/MD/<int:location_id>/', DashboardAvgMonthlyDeliveredApiView.as_view()),
    path('dashboard/EP/', DashboardExpiredProductsApiView.as_view()),
]