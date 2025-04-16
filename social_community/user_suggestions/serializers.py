from rest_framework import serializers
from .models import UserSuggestion

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSuggestion
        fields = '__all__'
