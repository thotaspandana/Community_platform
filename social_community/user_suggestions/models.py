from django.db import models
from django.contrib.auth.models import User

class UserSuggestion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="suggested_to")
    suggested_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="suggested_as")
    reason = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'suggested_user')

    def __str__(self):
        return f"Suggested {self.suggested_user.username} to {self.user.username}"

