from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
        
    def to_representation(self, instance):
        return UserSerializer(instance).data

class TokenObtainPairWithUserSerializer(serializers.Serializer):
    """
    Serializer for returning both tokens and user details after login/registration
    """
    user = serializers.SerializerMethodField()
    refresh = serializers.CharField(read_only=True)
    access = serializers.CharField(read_only=True)
    
    def get_user(self, obj):
        user = self.context['request'].user
        return UserSerializer(user).data
    
    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }