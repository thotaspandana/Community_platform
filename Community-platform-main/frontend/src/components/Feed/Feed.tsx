import React, { useEffect, useState } from 'react';
import '../../styles/Feed.css';
import { getPosts } from '../../services/fbDataService';

interface PostType {
  id: number;
  author: string;
  time: string;
  content: string;
  likes: number | string;
  comments: number | string;
  shares: number | string;
  thumbnailUrl?: string;
  alt?: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getPosts();
      setPosts(data);
    }
    fetchData();
  }, []);

  return (
    <div className="fb-feed">
      {posts.map((post) => (
        <div className="fb-post-card" key={post.id}>
          <div className="fb-post-header">
            <img
              src="https://placehold.co/40x40?text=Profile"
              alt="Post Author Avatar"
              className="fb-avatar"
            />
            <div className="fb-post-info">
              <div className="fb-post-author">{post.author}</div>
              <div className="fb-post-time">{post.time}</div>
            </div>
          </div>
          <div className="fb-post-content">
            {post.content}
          </div>
          {post.thumbnailUrl && (
            <div className="fb-post-image">
              <img src={post.thumbnailUrl} alt={post.alt || 'Post Content'} />
            </div>
          )}
          <div className="fb-post-stats">
            <span>{post.likes} Likes</span>
            <span>{post.comments} Comments</span>
            <span>{post.shares} Shares</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
