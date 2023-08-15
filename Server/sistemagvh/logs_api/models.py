from django.db import models

# Create your models here.
class Log(models.Model):
    description = models.CharField(max_length=250)
    user = models.CharField(max_length=250)
    date = models.DateField()

    def __str__(self):
        return self.description + " el " + self.date