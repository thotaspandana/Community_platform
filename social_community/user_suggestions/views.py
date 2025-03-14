from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from random import sample

class UserSuggestionsView(APIView):
    def get(self, request):
        users = list(User.objects.exclude(id=request.user.id))  # Exclude current user
        suggested_users = sample(users, min(len(users), 5))  # Random 5 users
        serializer = UserSerializer(suggested_users, many=True)
        return Response(serializer.data)

