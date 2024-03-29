"""sistemagvh URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from users_api import urls as users_urls
from products_api import urls as products_urls
from deliverylocations_api import urls as delivery_locations_urls
from productdelivery_api import urls as product_delivery_urls
from deliveryzones_api import urls as delivery_zones_urls
from providers_api import urls as providers_urls
from dashboard_api import urls as dashboard_urls
from logs_api import urls as logs_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(users_urls)),
    path('api/', include(products_urls)),
    path('api/', include(delivery_locations_urls)),
    path('api/', include(product_delivery_urls)),
    path('api/', include(delivery_zones_urls)),
    path('api/', include(providers_urls)),
    path('api/', include(dashboard_urls)),
    path('api/', include(logs_urls)),
]