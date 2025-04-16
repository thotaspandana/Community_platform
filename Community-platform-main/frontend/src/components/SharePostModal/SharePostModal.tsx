import React, { useState, useEffect } from 'react';
import './SharePostModal.css';
import { DisplayPost } from '../../components/PostList/PostList';
import { sharePost } from '../../services/posts.service';

interface Friend {
  id: number;
  name: string;
  avatar: string;
}

interface SharePostModalProps {
  post: DisplayPost;
  onClose: () => void;
  onShareSuccess?: (postId: number) => void;
}

const SharePostModal: React.FC<SharePostModalProps> = ({ post, onClose, onShareSuccess }) => {
  const [message, setMessage] = useState<string>('');
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareComplete, setShareComplete] = useState<boolean>(false);

  // Mock friends data
  useEffect(() => {
    // Simulate fetching friends from an API
    const mockFriends: Friend[] = [
      { id: 1, name: 'John Doe', avatar: 'https://placehold.co/36x36?text=JD' },
      { id: 2, name: 'Jane Smith', avatar: 'https://placehold.co/36x36?text=JS' },
      { id: 3, name: 'Alex Johnson', avatar: 'https://placehold.co/36x36?text=AJ' },
      { id: 4, name: 'Emily Wilson', avatar: 'https://placehold.co/36x36?text=EW' },
      { id: 5, name: 'Michael Brown', avatar: 'https://placehold.co/36x36?text=MB' },
    ];
    
    setFriends(mockFriends);
  }, []);

  const toggleFriendSelection = (friendId: number) => {
    setSelectedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleShare = async () => {
    if (selectedFriends.length === 0) {
      alert('Please select at least one friend to share with');
      return;
    }

    setIsSharing(true);

    try {
      // Call the sharePost service with the post ID and selected friends
      await sharePost(post.id, selectedFriends);
      
      setIsSharing(false);
      setShareComplete(true);
      
      // Call the onShareSuccess callback
      if (onShareSuccess) {
        onShareSuccess(post.id);
      }
      
      // Close modal after showing success message for a moment
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error sharing post:', error);
      setIsSharing(false);
      alert('Failed to share post. Please try again.');
    }
  };

  const getAuthorName = () => {
    return typeof post.author === 'string' ? post.author : post.author.username || 'User';
  };

  return (
    <div className="share-post-modal-overlay" onClick={onClose}>
      <div className="share-post-modal" onClick={e => e.stopPropagation()}>
        {!shareComplete ? (
          <>
            <div className="modal-header">
              <h2>Share Post</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              <div className="post-preview">
                <div className="post-content-preview">
                  <h4>Post by {getAuthorName()}</h4>
                  <p>{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                </div>
              </div>

              <div className="share-message">
                <textarea 
                  className="share-textarea" 
                  placeholder="Write something about this post..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="friend-selector">
                <h3>Select friends to share with:</h3>
                <div className="friends-list">
                  {friends.map(friend => (
                    <div 
                      key={friend.id} 
                      className={`friend-item ${selectedFriends.includes(friend.id) ? 'selected' : ''}`}
                      onClick={() => toggleFriendSelection(friend.id)}
                    >
                      <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                      <div className="friend-name">{friend.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="share-button" 
                onClick={handleShare}
                disabled={isSharing}
              >
                {isSharing ? 'Sharing...' : 'Share Now'}
              </button>
            </div>
          </>
        ) : (
          <div className="share-success-message">
            <h3>Post shared successfully!</h3>
            <p>Your post has been shared with {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePostModal;