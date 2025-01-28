# Generated by Django 5.1.5 on 2025-01-16 07:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('dateNow', models.DateTimeField(auto_now_add=True)),
                ('donde', models.BooleanField(default=False)),
            ],
        ),
    ]
