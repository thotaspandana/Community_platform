from django.test import TestCase
from .models import Post

class PostModelTest(TestCase):

    def setUp(self):
        self.post = Post.objects.create(
            title="Test Post",
            content="This is a test post.",
            author="Test Author"
        )

    def test_post_creation(self):
        self.assertEqual(self.post.title, "Test Post")
        self.assertEqual(self.post.content, "This is a test post.")
        self.assertEqual(self.post.author, "Test Author")

    def test_post_str(self):
        self.assertEqual(str(self.post), "Test Post")  # Assuming the __str__ method returns the title

    def test_post_content_length(self):
        self.assertLessEqual(len(self.post.content), 500)  # Assuming a max length of 500 characters for content

    def test_post_author(self):
        self.assertIsNotNone(self.post.author)  # Ensure the author is not None

    def test_post_creation_date(self):
        self.assertIsNotNone(self.post.created_at)  # Assuming there's a created_at field in the model

    def test_post_update(self):
        self.post.title = "Updated Title"
        self.post.save()
        self.assertEqual(self.post.title, "Updated Title")