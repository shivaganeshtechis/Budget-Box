from .models import Transaction
from rest_framework import serializers


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

    def validate(self, data):
        errors = {}
        if 'name' not in data:
            errors['name'] = ['name is required.']

        if 'amount' not in data:
            errors['amount'] = ['amount is required.']

        if 'type' not in data:
            errors['type'] = ['type is required.']

        if bool(errors):
            raise serializers.ValidationError(errors)

        return data
