from django.db import models

# Create your models here.
class ProductDelivery(models.Model):
    #Product code as a foreign key and delivery location name as a foreign key
    deliveryLocationId = models.ForeignKey('deliverylocations_api.DeliveryLocations', on_delete=models.CASCADE)
    productId = models.ForeignKey('products_api.Product', on_delete=models.CASCADE)
    expirationDate = models.DateField()
    quantityDelivered = models.IntegerField()
    quantityReturned = models.IntegerField(blank=True, null=True)
    soldPrice = models.DecimalField(max_digits=7, decimal_places=2)
    

    def __str__(self):
        return self.productCode