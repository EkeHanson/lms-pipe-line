# Generated by Django 5.2 on 2025-04-19 08:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('advert', '0002_advert_image_delete_advertimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='advert',
            name='link',
            field=models.TextField(blank=True, null=True),
        ),
    ]
