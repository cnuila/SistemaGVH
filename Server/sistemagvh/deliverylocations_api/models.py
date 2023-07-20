from django.db import models

# Create your models here.
class DeliveryLocations(models.Model):
    name = models.CharField(max_length=250)
    address = models.CharField(max_length=250)
    deliveryZoneId = models.ForeignKey('deliveryzones_api.DeliveryZones', on_delete=models.CASCADE)

    def __str__(self):
        return self.name