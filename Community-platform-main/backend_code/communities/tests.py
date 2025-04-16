from django.test import TestCase
from .models import Community

class CommunityModelTests(TestCase):

    def setUp(self):
        Community.objects.create(name="Test Community", description="A community for testing.")

    def test_community_creation(self):
        community = Community.objects.get(name="Test Community")
        self.assertEqual(community.description, "A community for testing.")

    def test_community_str(self):
        community = Community.objects.get(name="Test Community")
        self.assertEqual(str(community), "Test Community")