from django.db import models
from django.conf import settings
from communities.models import Community

class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    community = models.ForeignKey(Community, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    likes_count = models.IntegerField(default=0)  # Added explicit field for likes count
    share_count = models.IntegerField(default=0)  # Added explicit field for share count

    def __str__(self):
        return self.title
        
    @property
    def like_count(self):
        return self.likes.count()
        
    @property
    def comment_count(self):
        return self.comments.count()

class Comment(models.Model):
    content = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_comments', blank=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"
        
    @property
    def like_count(self):
        return self.likes.count()