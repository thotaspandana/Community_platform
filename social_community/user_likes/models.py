from django.db import models
from django.contrib.auth.models import User
from user_posts.models import Post  # Import Post model

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # Prevents duplicate likes from the same user

    def __str__(self):
        return f"{self.user.username} liked {self.post.id}"

