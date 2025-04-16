import React, { useState, useEffect } from 'react';
import { Community, getAllCommunities } from '../../services/communities.services';
import CreateGroupModal from '../CreateGroupModal/CreateGroupModal';
import '../../styles/Communities.css';

interface CommunitiesProps {
  isVisible: boolean;
  onCommunitySelect?: (communityId: number) => void;
  initialSelectedCommunity?: number | null;
}

// Helper function to generate a consistent color based on community name
const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 65%)`; // Use HSL for a nice, consistent color palette
};

const Communities: React.FC<CommunitiesProps> = ({ isVisible, onCommunitySelect, initialSelectedCommunity }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(initialSelectedCommunity || null);

  // Update selectedCommunityId when initialSelectedCommunity changes
  useEffect(() => {
    if (initialSelectedCommunity) {
      setSelectedCommunityId(initialSelectedCommunity);
    }
  }, [initialSelectedCommunity]);

  useEffect(() => {
    // Only fetch when the component becomes visible
    if (isVisible) {
      fetchCommunities();
    }
  }, [isVisible]);

  const fetchCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCommunities();
      setCommunities(data);
    } catch (err) {
      setError('Failed to load communities');
      console.error('Error fetching communities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    // Refresh the communities list after creating a new one
    fetchCommunities();
  };
  
  const handleCommunityClick = (communityId: number) => {
    setSelectedCommunityId(communityId);
    if (onCommunitySelect) {
      onCommunitySelect(communityId);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="communities-container">
      <div className="communities-list">
        {/* Create Community option always at the top */}
        <div className="community-item create-community" onClick={handleCreateCommunity}>
          <div className="community-icon create-icon">+</div>
          <div className="community-info">
            <div className="community-name">Create New Community</div>
          </div>
        </div>

        {loading ? (
          <div className="communities-loading">Loading...</div>
        ) : error ? (
          <div className="communities-error">{error}</div>
        ) : communities.length === 0 ? (
          <div className="communities-empty">No communities found</div>
        ) : (
          communities.map((community) => (
            <div 
              key={community.id} 
              className={`community-item ${selectedCommunityId === community.id ? 'selected' : ''}`}
              onClick={() => handleCommunityClick(community.id)}
            >
              <div 
                className="community-icon" 
                style={{ backgroundColor: generateColorFromString(community.name) }}
              >
                <span className="community-icon-text">{community.name.charAt(0)}</span>
              </div>
              <div className="community-info">
                <div className="community-name">{community.name}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {isCreateModalOpen && <CreateGroupModal onClose={handleCloseModal} />}
    </div>
  );
};

export default Communities;