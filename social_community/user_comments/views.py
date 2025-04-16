from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Comment
from user_posts.models import Post
from .serializers import CommentSerializer
from django.shortcuts import get_object_or_404

class CommentCreateView(APIView):
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        data = request.data.copy()
        data["post"] = post.id
        data["user"] = request.user.id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

