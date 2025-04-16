from django.contrib import admin
from .models import Community

@admin.register(Community)
class CommunityAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)
    ordering = ('-created_at',)