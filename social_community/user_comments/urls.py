from django.urls import path
from .views import CommentCreateView

urlpatterns = [
    path('<int:post_id>/comment/', CommentCreateView.as_view(), name='comment-create'),  # Add a comment
]
