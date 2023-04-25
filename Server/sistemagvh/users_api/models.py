from django.db import models

# Create your models here.
class User(models.Model):
    userName = models.CharField(max_length=250)
    userUId = models.CharField(max_length=100)
    firstName = models.CharField(max_length=250)
    lastName = models.CharField(max_length=250)
    isAdmin = models.BooleanField(default=False)

    def __str__(self):
        return self.userName