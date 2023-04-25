from django.db import models

# Create your models here.
class Product(models.Model):
    code = models.CharField(max_length=250)
    description = models.CharField(max_length=250)
    cost = models.DecimalField(max_digits=7, decimal_places=2)
    sellingPrice = models.DecimalField(max_digits=7, decimal_places=2)
    quantity = models.IntegerField()

    def __str__(self):
        return self.description