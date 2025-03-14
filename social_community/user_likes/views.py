from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Like
from user_posts.models import Post
from django.shortcuts import get_object_or_404

class LikePostView(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if not created:
            like.delete()
            return Response({"message": "Like removed"}, status=status.HTTP_200_OK)
        return Response({"message": "Post liked"}, status=status.HTTP_201_CREATED)

