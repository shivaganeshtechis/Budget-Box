from apps.users.models import User
from django.db import models
from config.constants import *
from django.core.validators import MinValueValidator

class Transaction(models.Model):
    class Meta(object):
        db_table = 'transaction'

    name = models.CharField(
        'Name', blank=False, null=False, max_length=200
    )
    user_id = models.ForeignKey(
        User, related_name='related_user_id', on_delete=models.CASCADE, db_index=True
    )
    type = models.CharField(
        'Type', blank=False, null=False, max_length=50, choices=TRANSACTION_TYPE
    )
    amount = models.IntegerField(
        'Amount', blank=False, null=False, validators=[
            MinValueValidator(1)
        ]
    )
    created_at = models.DateTimeField(
        'Creation Date', blank=True, auto_now_add=True
    )
    updated_at = models.DateTimeField(
        'Update Date', blank=True, auto_now=True
    )
