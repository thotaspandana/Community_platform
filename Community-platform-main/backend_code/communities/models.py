from django.db import models
from django.conf import settings

class Community(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name='communities', 
        on_delete=models.CASCADE,
        null=True,  # Make owner field optional
        blank=True
    )

    def __str__(self):
        return self.name

class Membership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='memberships', on_delete=models.CASCADE)
    community = models.ForeignKey(Community, related_name='members', on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'community')

    def __str__(self):
        return f"{self.user.username} - {self.community.name}"