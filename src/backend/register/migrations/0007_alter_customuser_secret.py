# Generated by Django 3.2.4 on 2022-01-19 12:34

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('register', '0006_customuser_secret'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='secret',
            field=models.CharField(default=uuid.UUID('31114a9a-da89-4761-a76a-7c7a36d60221'), max_length=36),
        ),
    ]
