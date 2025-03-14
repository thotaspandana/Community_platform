from django.urls import path
from .views import PostListCreateView, PostDetailView, login_view, profile_view, index_view

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),  # GET all posts, POST new post
    path('<int:post_id>/', PostDetailView.as_view(), name='post-detail'),  # GET, DELETE a single post

    # New URL patterns for HTML pages
    path('login/', login_view, name='login'),
    path('profile/', profile_view, name='profile'),
    path('index/', index_view, name='index'),
]

