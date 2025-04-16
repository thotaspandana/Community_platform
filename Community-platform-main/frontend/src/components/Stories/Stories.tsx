import React, { useEffect, useState } from 'react';
import '../../styles/Stories.css';
import { getStories } from '../../services/fbDataService';

interface Story {
  id: number;
  name: string;
  imageUrl: string;
  alt: string;
}

const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const results = await getStories();
        setStories(results);
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve stories');
      }
    };
    fetchStories();
  }, []);

  return (
    <div className="stories-container">
      {error && <div className="error-msg">{error}</div>}

      <div className="story-items">
        <div className="story-card create-story">
          <div className="story-image create-story-image">
            <span className="create-label">Create a Story</span>
          </div>
          <div className="story-user-name">Sam</div>
        </div>

        {stories.map((story) => (
          <div className="story-card" key={story.id}>
            <img
              className="story-image"
              src={story.imageUrl}
              alt={story.alt}
            />
            <div className="story-user-name">{story.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;