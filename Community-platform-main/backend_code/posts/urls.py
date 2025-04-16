from django.urls import path
from . import views

urlpatterns = [
    path('', views.PostListView.as_view(), name='post-list'),
    path('feed/', views.UserFeedView.as_view(), name='user-feed'),
    path('create/', views.CreatePostView.as_view(), name='create-post'),
    path('<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('<int:pk>/like/', views.LikePostView.as_view(), name='like-post'),
    path('<int:pk>/unlike/', views.UnlikePostView.as_view(), name='unlike-post'),
    path('<int:pk>/share/', views.SharePostView.as_view(), name='share-post'),
    path('<int:pk>/comments/', views.CommentListView.as_view(), name='comments-list'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('comments/<int:pk>/like/', views.LikeCommentView.as_view(), name='like-comment'),
    path('comments/<int:pk>/unlike/', views.UnlikeCommentView.as_view(), name='unlike-comment'),
]