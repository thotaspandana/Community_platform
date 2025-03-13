# Generated by Django 5.1.7 on 2025-03-13 04:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserSuggestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.CharField(blank=True, max_length=255, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('suggested_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='suggested_as', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='suggested_to', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'suggested_user')},
            },
        ),
    ]
