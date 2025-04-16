from rest_framework import serializers
from .models import Post, Comment
from accounts.serializers import UserSerializer
from communities.models import Community
from django.contrib.auth import get_user_model

User = get_user_model()

class CommunityShortSerializer(serializers.ModelSerializer):
    class Meta:
        model = Community
        fields = ['id', 'name']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    like_count = serializers.ReadOnlyField()
    is_liked_by_user = serializers.SerializerMethodField(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'created_at', 'updated_at', 
                  'like_count', 'is_liked_by_user', 'parent', 'replies']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'like_count', 'is_liked_by_user', 'replies']
    
    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
    def get_replies(self, obj):
        # Only get direct replies to this comment
        if hasattr(obj, 'replies') and obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True, context=self.context).data
        return []
        
    def validate_content(self, value):
        # Validate that content is not empty
        if not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty")
        return value

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    community = CommunityShortSerializer(read_only=True)
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.ReadOnlyField()
    share_count = serializers.ReadOnlyField()  # Added share_count field
    is_liked_by_user = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'community', 'created_at', 
                  'updated_at', 'image', 'image_url', 'like_count', 'comment_count', 
                  'share_count', 'is_liked_by_user', 'comments']
    
    def get_like_count(self, obj):
        # Return stored likes_count value if available, otherwise calculate it
        if hasattr(obj, 'likes_count') and obj.likes_count is not None:
            return obj.likes_count
        return obj.likes.count()
    
    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    
    def create(self, validated_data):
        request = self.context.get('request')
        community_id = request.data.get('community_id')
        
        if not community_id:
            raise serializers.ValidationError({"community_id": "Community ID is required"})
            
        try:
            community = Community.objects.get(id=community_id)
        except Community.DoesNotExist:
            raise serializers.ValidationError({"community_id": "Invalid community ID"})
        
        # Get or create system user (since we're not requiring authentication)
        system_user, created = User.objects.get_or_create(
            username='Sam',
            defaults={
                'email': 'sam@example.com',
                'is_active': True
            }
        )
        
        # Create post with system user as author
        post = Post.objects.create(
            author=system_user,
            community=community,
            **validated_data
        )
        return post