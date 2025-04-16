from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from communities.models import Community, Membership
from django.contrib.auth import get_user_model

User = get_user_model()


class PostListView(generics.ListAPIView):
    """View for listing all posts with filtering options"""
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Post.objects.all()
        # Always prefetch likes to make counting more efficient
        queryset = queryset.prefetch_related('likes')
        
        # Filter by community if specified (support both 'community_id' and 'community' parameters)
        community_id = self.request.query_params.get('community_id') or self.request.query_params.get('community')
        if community_id:
            queryset = queryset.filter(community_id=community_id)
        
        # Update likes_count for all posts in this queryset regardless of filtering
        for post in queryset:
            # Only update if the current value doesn't match
            current_likes = post.likes.count()
            if post.likes_count != current_likes:
                post.likes_count = current_likes
                post.save(update_fields=['likes_count'])
        
        # Sort options
        sort = self.request.query_params.get('sort')
        if sort == 'trending':
            # Sort by combined likes and shares for trending posts
            queryset = queryset.order_by('-likes_count', '-share_count', '-created_at')
        elif sort == 'latest':
            queryset = queryset.order_by('-created_at')
        else:
            queryset = queryset.order_by('-created_at')
            
        return queryset
    
    def list(self, request, *args, **kwargs):
        # Standard list implementation with added count info
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = self.get_serializer(queryset, many=True)
        
        # Print response data for debugging
        print("API Response for posts:")
        for post in serializer.data:
            print(f"Post ID: {post.get('id')}, Title: {post.get('title')}, Likes count: {post.get('like_count')}, Share count: {post.get('share_count')}")
        
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class UserFeedView(generics.ListAPIView):
    """View for personalized user feed"""
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user = self.request.user
        
        # Get communities the user is a member of
        user_communities = Membership.objects.filter(user=user).values_list('community_id', flat=True)
        
        # Get posts from those communities
        queryset = Post.objects.filter(community_id__in=user_communities).order_by('-created_at')
            
        return queryset
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CreatePostView(generics.CreateAPIView):
    """View for creating a new post"""
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        # Print debugging info
        print(f"Request method: {request.method}")
        print(f"Request data: {request.data}")
        print(f"Request FILES: {request.FILES}")
        
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(f"Exception during post creation: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, or deleting a post"""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

class LikePostView(APIView):
    """View for liking a post"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        # Get or create system user 
        system_user, created = User.objects.get_or_create(
            username='system',
            defaults={
                'email': 'system@example.com',
                'is_active': True
            }
        )
        
        # Add like and increment counter
        post.likes.add(system_user)
        post.likes_count = post.likes.count()  # Update the explicit like count
        post.save(update_fields=['likes_count'])
        
        return Response({
            "detail": "Post liked successfully.",
            "likes_count": post.likes_count
        }, status=status.HTTP_200_OK)

class UnlikePostView(APIView):
    """View for unliking a post"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        # Get system user
        try:
            system_user = User.objects.get(username='system')
            # Remove like and decrement counter
            post.likes.remove(system_user)
            post.likes_count = post.likes.count()  # Update the explicit like count
            post.save(update_fields=['likes_count'])
        except User.DoesNotExist:
            pass
        
        return Response({
            "detail": "Post unliked successfully.",
            "likes_count": post.likes_count
        }, status=status.HTTP_200_OK)

class SharePostView(APIView):
    """View for sharing a post"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        
        # Increment share count
        post.share_count += 1
        post.save(update_fields=['share_count'])
        
        return Response({
            "detail": "Post shared successfully.",
            "share_count": post.share_count
        }, status=status.HTTP_200_OK)

class CommentListView(generics.ListCreateAPIView):
    """View for listing and creating comments on a post"""
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Get post ID from URL
        post_id = self.kwargs['pk']
        
        # Check if we should include all comments or just top-level ones
        include_all = self.request.query_params.get('include_all', 'false').lower() == 'true'
        
        if include_all:
            # Return all comments for this post
            return Comment.objects.filter(post_id=post_id).order_by('-created_at')
        else:
            # Return only top-level comments (no parents)
            return Comment.objects.filter(post_id=post_id, parent=None).order_by('-created_at')
    
    def perform_create(self, serializer):
        post_id = self.kwargs['pk']
        post = get_object_or_404(Post, pk=post_id)
        
        # Check if this is a reply to another comment
        parent_comment_id = self.request.data.get('parent_id')
        parent_comment = None
        
        if parent_comment_id:
            parent_comment = get_object_or_404(Comment, pk=parent_comment_id)
            # Make sure parent comment belongs to the same post
            if parent_comment.post != post:
                raise serializers.ValidationError("Parent comment does not belong to this post")
        
        # Get or create system user (since we're not requiring authentication)
        system_user, created = User.objects.get_or_create(
            username='system',
            defaults={
                'email': 'system@example.com',
                'is_active': True
            }
        )
        
        # Create comment with system user as author
        comment = serializer.save(
            post=post,
            parent=parent_comment,
            author=system_user
        )
        
        # Print debug info about the created comment
        print(f"Comment created for Post ID: {post_id}")
        print(f"Comment content: {serializer.validated_data.get('content')}")
        
        # Update comment count for post if needed
        post.save()  # This will trigger the comment_count property update
        
        return comment
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def list(self, request, *args, **kwargs):
        # Get the post to include basic post info in the response
        post_id = self.kwargs['pk']
        post = get_object_or_404(Post, pk=post_id)
        
        # Get comments
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        # Print debug info about comments being listed
        print(f"Listing comments for Post ID: {post_id}")
        print(f"Found {len(serializer.data)} comments")
        
        # Return enhanced response
        return Response({
            'post_id': post_id,
            'post_title': post.title,
            'comment_count': post.comment_count,
            'comments': serializer.data
        })
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, or deleting a comment"""
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class LikeCommentView(APIView):
    """View for liking a comment"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        return Response({"detail": "Comment liked successfully."}, status=status.HTTP_200_OK)

class UnlikeCommentView(APIView):
    """View for unliking a comment"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        comment = get_object_or_404(Comment, pk=pk)
        return Response({"detail": "Comment unliked successfully."}, status=status.HTTP_200_OK)

# Legacy ViewSet (for compatibility) - use the class-based views above instead
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]