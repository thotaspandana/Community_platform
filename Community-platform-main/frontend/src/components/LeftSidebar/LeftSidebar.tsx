import React, { useEffect, useState } from 'react';
import '../../styles/LeftSidebar.css';
import { getLeftMenuItems, getShortcuts } from '../../services/fbDataService';
import CreateGroupModal from '../CreateGroupModal/CreateGroupModal';
import Communities from '../Communities/Communities';
import { Button } from 'antd';
import CreateNewPost from '../CreateNewPost';
import CreatePost from '../CreatePost/CreatePost';

interface MenuItem {
  id: number;
  label: string;
  icon: string;
  link: string;
}

interface ShortcutItem {
  id: number;
  label: string;
  icon: string;
  link: string;
}

interface LeftSidebarProps {
  onCommunitySelect?: (communityId: number | null) => void;
  initialSelectedCommunity?: number | null;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onCommunitySelect, initialSelectedCommunity }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>([]);
  const [error, setError] = useState<string>('');
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState<boolean>(false);
  const [isCreatePostModalOpen, setCreatePostModalOpen] = useState<boolean>(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(initialSelectedCommunity ? 'communities' : null);

  // When initialSelectedCommunity changes, set the communities section to active
  useEffect(() => {
    if (initialSelectedCommunity) {
      setActiveSectionId('communities');
    }
  }, [initialSelectedCommunity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch menu items, not shortcuts
        const items = await getLeftMenuItems();
        setMenuItems(items);
        // Set shortcuts to empty array instead of fetching them
        setShortcuts([]);
      } catch (err) {
        setError('Failed to load sidebar data');
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleMenuItemClick = (label: string) => {
    if (label === 'Community') {
      const newActiveSectionId = activeSectionId === 'communities' ? null : 'communities';
      setActiveSectionId(newActiveSectionId);
      
      // If we're closing the communities section, clear the selected community
      if (newActiveSectionId === null && onCommunitySelect) {
        onCommunitySelect(null);
      }
    } else {
      setActiveSectionId(null);
      // When clicking on other menu items, clear the selected community
      if (onCommunitySelect) {
        onCommunitySelect(null);
      }
    }
  };

  const handleCommunitySelect = (communityId: number) => {
    if (onCommunitySelect) {
      onCommunitySelect(communityId);
    }
  };

  const handleCreateButtonClick = () => {
    setCreateGroupModalOpen(true);
  };
  
  const handleNewPostButtonClick = () => {
    console.log('New Post Button Clicked');
    setCreatePostModalOpen(true);
  };

  // Function to render menu items with communities expansion
  const renderMenuItem = (item: MenuItem) => {
    const isCommunity = item.label === 'Community';
    const isActive = activeSectionId === 'communities' && isCommunity;
    
    return (
      <div key={item.id} className="menu-item-container">
        <a 
          className={`menu-item ${isActive ? 'active' : ''}`} 
          onClick={() => handleMenuItemClick(item.label)}
        >
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
        </a>
        
        {/* Show Communities component only for Community item and only when active */}
        {isCommunity && isActive && 
          <Communities 
            isVisible={true} 
            onCommunitySelect={handleCommunitySelect} 
            initialSelectedCommunity={initialSelectedCommunity}
          />
        }
      </div>
    );
  };

  return (
    <div className="left-sidebar-container">
      <div className="logo-section">
        <div className="search-container">
          <Button
            type="primary"
            className="create-new-button"
            onClick={() => handleNewPostButtonClick()}
          >
            Create New
          </Button>
        </div>
      </div>

      <div className="menu-items-container">
        {menuItems.map(renderMenuItem)}
      </div>

      {error && <div className="error-msg">{error}</div>}

      <div className="shortcut-section">
        <h4>Your shortcuts</h4>
        {shortcuts.map((shortcut) => (
          <a key={shortcut.id} href={shortcut.link} className="shortcut-item">
            <span className="shortcut-icon">{shortcut.icon}</span>
            <span className="shortcut-label">{shortcut.label}</span>
          </a>
        ))}
      </div>

      {isCreateGroupModalOpen && <CreateGroupModal onClose={() => setCreateGroupModalOpen(false)} />}
      {isCreatePostModalOpen && <CreatePost onClose={() => setCreatePostModalOpen(false)}/>}
    </div>
  );
};

export default LeftSidebar;