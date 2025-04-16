from django.shortcuts import render
from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import RegisterSerializer, UserSerializer, TokenObtainPairWithUserSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        # breakpoint()

        if serializer.is_valid():
            user = serializer.save()
            # breakpoint()
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Create response with user data and tokens
            response_data = {
                'user': UserSerializer(user).data,  # This will include the user id
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
            
            return Response(response_data, status=status.HTTP_201_CREATED)
        breakpoint()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def profile_view(request):
    return render(request, 'accounts/profile.html')