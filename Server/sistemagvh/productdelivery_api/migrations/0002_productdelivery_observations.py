# Generated by Django 4.1.6 on 2023-10-09 00:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productdelivery_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='productdelivery',
            name='observations',
            field=models.CharField(blank=True, max_length=250, null=True),
        ),
    ]