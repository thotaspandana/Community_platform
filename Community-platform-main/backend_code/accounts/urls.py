from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from .views import RegisterView, UserProfileView

urlpatterns = [
    # path('register/', RegisterView.as_view(), name='register'),
    # path('login/', TokenObtainPairView.as_view(), name='login'),
    # path('profile/', UserProfileView.as_view(), name='profile'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]