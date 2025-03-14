from django.urls import path
from .views import UserSuggestionsView

urlpatterns = [
    path('users/', UserSuggestionsView.as_view(), name='user-suggestions'),  # Get user suggestions
]
