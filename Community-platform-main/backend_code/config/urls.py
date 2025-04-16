from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include the communities URLs with proper namespace
    path('api/', include('communities.urls')),  # Add 'api/' prefix
    # Other app inclusions should also be under api/
    path('api/', include('accounts.urls')),
    # path('api/', include('posts.urls')),
]
