# Community Platform API

A Django REST API for a community platform allowing users to create communities, posts, and comments with social features like likes and shares.

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- MySQL database
- Virtual environment (recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd community-platform/backend
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

4. Set up the database:
   - Create a MySQL database named 'online'
   - Update database settings in `community_platform/settings.py` if needed

5. Run migrations:
```bash
python manage.py migrate
```

7. Start the development server:
```bash
python manage.py runserver 8090
```

The API will be available at http://127.0.0.1:8090/

## API Endpoints

### Authentication
- No authentication required for most endpoints (system user is used automatically)

### Communities

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/communities/` | GET | List all communities |
| `/communities/create/` | POST | Create a new community |
| `/communities/<id>/` | GET | Get community details |
| `/communities/trending/` | GET | Get trending communities |
| `/communities/search/?query=<query>` | GET | Search communities |
| `/communities/<id>/join/` | POST | Join a community |
| `/communities/<id>/leave/` | POST | Leave a community |
| `/communities/<id>/members/` | GET | List community members |

#### Create Community Payload Example:
```json
{
  "name": "Community Name",
  "description": "Community Description"
}
```

### Posts

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/posts/` | GET | List all posts |
| `/posts/?community=<id>` | GET | List posts for a community |
| `/posts/create/` | POST | Create a new post |
| `/posts/<id>/` | GET | Get post details |
| `/posts/<id>/like/` | POST | Like a post |
| `/posts/<id>/unlike/` | POST | Unlike a post |
| `/posts/<id>/share/` | POST | Share a post |
| `/posts/<id>/comments/` | GET | List comments for a post |
| `/posts/<id>/comments/` | POST | Add a comment to a post |

#### Create Post Payload Example:
```json
{
  "title": "Post Title",
  "content": "Post Content",
  "community_id": 1
}
```

### Comments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/posts/<id>/comments/` | GET | List comments for a post |
| `/posts/<id>/comments/` | POST | Create a comment on a post |
| `/posts/comments/<id>/` | GET | Get comment details |
| `/posts/comments/<id>/like/` | POST | Like a comment |
| `/posts/comments/<id>/unlike/` | POST | Unlike a comment |

#### Create Comment Payload Example:
```json
{
  "content": "Comment text here"
}
```

#### Create Reply to Comment Example:
```json
{
  "content": "Reply text here",
  "parent_id": 123
}
```

## Features

- Community creation and management
- Post creation with optional image upload
- Comments and nested replies
- Like/unlike posts and comments
- Share posts
- Trending communities
- Search functionality
- Post filtering by community

## Development

### Project Structure
- `accounts`: User authentication and profiles
- `communities`: Community-related functionality
- `posts`: Posts, comments, likes, and shares
- `community_platform`: Main project settings

### Running Tests
```bash
python manage.py test
```

## API Response Format Examples

### Community List
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "name": "Technology",
      "description": "Discuss latest tech trends",
      "owner_username": "system",
      "created_at": "2025-04-15T12:00:00Z",
      "updated_at": "2025-04-15T12:00:00Z",
      "member_count": 5
    },
    {
      "id": 2,
      "name": "Gardening",
      "description": "Tips for home gardeners",
      "owner_username": "system",
      "created_at": "2025-04-15T12:30:00Z",
      "updated_at": "2025-04-15T12:30:00Z",
      "member_count": 3
    }
  ]
}
```

### Post List for Community
```json
{
  "count": 2,
  "results": [
    {
      "id": 1,
      "title": "New Tech Gadgets",
      "content": "Check out these new gadgets...",
      "author": {
        "id": 1,
        "username": "system"
      },
      "community": {
        "id": 1,
        "name": "Technology"
      },
      "created_at": "2025-04-15T14:00:00Z",
      "updated_at": "2025-04-15T14:00:00Z",
      "image_url": "http://localhost:8000/media/post_images/gadget.jpg",
      "like_count": 5,
      "comment_count": 3,
      "share_count": 2
    }
  ]
}
```

### Comments for Post
```json
{
  "post_id": 1,
  "post_title": "New Tech Gadgets",
  "comment_count": 3,
  "comments": [
    {
      "id": 1,
      "content": "Great post!",
      "author": {
        "id": 1,
        "username": "system"
      },
      "created_at": "2025-04-15T15:00:00Z",
      "updated_at": "2025-04-15T15:00:00Z",
      "like_count": 2,
      "replies": [
        {
          "id": 2,
          "content": "I agree!",
          "author": {
            "id": 1,
            "username": "system"
          },
          "created_at": "2025-04-15T15:10:00Z",
          "updated_at": "2025-04-15T15:10:00Z",
          "like_count": 0
        }
      ]
    }
  ]
}
```