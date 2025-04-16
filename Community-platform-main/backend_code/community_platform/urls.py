from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('communities/', include('communities.urls')),
    path('accounts/', include('accounts.urls')),
    path('posts/', include('posts.urls')),
]

# Add static and media URL patterns if DEBUG is True
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    if hasattr(settings, 'MEDIA_URL'):
        urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)