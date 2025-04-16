from rest_framework import serializers
from .models import Community
from django.contrib.auth import get_user_model

User = get_user_model()

class CommunitySerializer(serializers.ModelSerializer):
    owner_username = serializers.SerializerMethodField(read_only=True)
    member_count = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Community
        fields = ['id', 'name', 'description', 'owner', 'owner_username', 'created_at', 'updated_at', 'member_count']
        read_only_fields = ['id', 'created_at', 'updated_at', 'member_count']
    
    def get_owner_username(self, obj):
        return obj.owner.username if obj.owner else None
    
    def get_member_count(self, obj):
        return obj.members.count() if hasattr(obj, 'members') else 0
    
    def validate_name(self, value):
        # Add validation for community name
        if Community.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A community with this name already exists.")
        return value
    
    def to_representation(self, instance):
        # Customize the output representation if needed
        representation = super().to_representation(instance)
        # Add any additional fields or transformations here
        return representation
    
    def create(self, validated_data):
        # Get or create a system user to use as the owner
        # This works around the NOT NULL constraint in the database
        system_user, created = User.objects.get_or_create(
            username='sam',
            defaults={
                'email': 'sam@example.com',
                'is_active': True,
                'is_staff': False
            }
        )
        
        # Set the owner to the system user
        validated_data['owner'] = system_user
        return super().create(validated_data)