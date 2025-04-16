from django.urls import path
from .views import (
    CommunityListView,
    CreateCommunityView,
    TrendingCommunitiesView,
    SearchCommunitiesView,
    UserCommunitiesView,
    CommunityDetailView,
    JoinCommunityView,
    LeaveCommunityView,
    CommunityPostsView,
    CommunityMembersView,
)

app_name = 'communities'

urlpatterns = [
    # Modified to make CommunityListView handle both GET and POST
    path('communities/', CommunityListView.as_view(), name='community-list'),
    
    # Keep the dedicated endpoint for creating communities
    path('create/', CreateCommunityView.as_view(), name='community-create'),
    
    path('communities/<int:pk>/', CommunityDetailView.as_view(), name='community-detail'),
    path('communities/<int:pk>/join/', JoinCommunityView.as_view(), name='community-join'),
    path('communities/<int:pk>/leave/', LeaveCommunityView.as_view(), name='community-leave'),
    path('communities/<int:pk>/posts/', CommunityPostsView.as_view(), name='community-posts'),
    path('communities/<int:pk>/members/', CommunityMembersView.as_view(), name='community-members'),
    path('communities/trending/', TrendingCommunitiesView.as_view(), name='community-trending'),
    path('communities/search/', SearchCommunitiesView.as_view(), name='community-search'),
    path('communities/user/', UserCommunitiesView.as_view(), name='user-communities'),
]