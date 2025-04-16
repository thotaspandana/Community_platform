from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Community, Membership
from .serializers import CommunitySerializer
from posts.serializers import PostSerializer
from posts.models import Post
# from django.contrib.auth.models import User
from django.db.models import Count

class CommunityListView(generics.ListCreateAPIView):
    """View for listing all communities and creating new ones"""
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    
    def perform_create(self, serializer):
        # Set dummy owner when creating a community instead of authenticated user
        community = serializer.save()
        # No automatic membership creation as it requires user authentication
        print(f"Community created via ListCreateAPIView: {community.name}")

class CreateCommunityView(generics.CreateAPIView):
    """View for creating a new community"""
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        print(f"Request method: {request.method}")
        print(f"Request data: {request.data}")
        
        # Enhanced error handling
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            print(f"Exception during community creation: {str(e)}")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def perform_create(self, serializer):
        try:
            # Create community without owner, just using name and description
            community = serializer.save()
            print(f"Community saved with ID: {community.id}, Name: {community.name}")
            print(f"Community created successfully: {community.name}")
            return community
        except Exception as e:
            print(f"Error in perform_create: {str(e)}")
            raise e

class TrendingCommunitiesView(generics.ListAPIView):
    """View for listing trending communities"""
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Get communities with the most members
        return Community.objects.annotate(
            member_count=Count('members')
        ).order_by('-member_count')[:10]

class SearchCommunitiesView(generics.ListAPIView):
    """View for searching communities"""
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        query = self.request.query_params.get('query', '')
        if query:
            return Community.objects.filter(name__icontains=query) | Community.objects.filter(description__icontains=query)
        return Community.objects.none()

class UserCommunitiesView(generics.ListAPIView):
    """View for listing communities a user is a member of"""
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Since we don't have authentication, return all communities
        return Community.objects.all()

class CommunityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, or deleting a community"""
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer
    permission_classes = [AllowAny]

class JoinCommunityView(APIView):
    """View for joining a community"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        community = get_object_or_404(Community, pk=pk)
        
        # Since we don't have authentication, we can't track memberships
        # Return a simple success message instead
        return Response({"detail": "Community join operation received."}, status=status.HTTP_200_OK)

class LeaveCommunityView(APIView):
    """View for leaving a community"""
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        community = get_object_or_404(Community, pk=pk)
        
        # Since we don't have authentication, we can't track memberships
        # Return a simple success message instead
        return Response({"detail": "Community leave operation received."}, status=status.HTTP_200_OK)

class CommunityPostsView(generics.ListAPIView):
    """View for listing posts in a community"""
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        community_id = self.kwargs['pk']
        return Post.objects.filter(community_id=community_id).order_by('-created_at')

class CommunityMembersView(APIView):
    """View for listing members of a community"""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        community = get_object_or_404(Community, pk=pk)
        members = community.members.all()
        member_data = []
        
        for membership in members:
            user = membership.user
            member_data.append({
                'id': user.id,
                'username': user.username,
                'joined_at': membership.joined_at
            })
            
        return Response(member_data)

class CommunityViewSet(viewsets.ModelViewSet):
    """Legacy ViewSet for communities (use the above views instead)"""
    queryset = Community.objects.all()
    serializer_class = CommunitySerializer