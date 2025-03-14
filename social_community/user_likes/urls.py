from django.urls import path
from .views import LikePostView

urlpatterns = [
    path('<int:post_id>/like/', LikePostView.as_view(), name='like-post'),  # Like/Unlike a post
]
