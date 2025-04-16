import React, { useEffect, useState } from 'react';
import '../../styles/LeftNav.css';

interface LeftNavItem {
  id: number;
  label: string;
  icon: string;
  link: string;
}

interface LeftNavProps {
  menuItems: LeftNavItem[];
  shortcuts: LeftNavItem[];
  onCommunityClick: () => void;
}

const LeftNav: React.FC<LeftNavProps> = ({ menuItems, shortcuts, onCommunityClick }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const handleClick = (item: LeftNavItem) => {
    setSelectedItem(item.id);
    if (item.label.toLowerCase() === 'community') {
      onCommunityClick();
    } else {
      window.location.href = item.link;
    }
  };

  // Example error handling if needed
  useEffect(() => {
    try {
      // Normally you'd do something that could fail here
    } catch (error) {
      console.error('Error in LeftNav:', error);
    }
  }, []);

  return (
    <div className="left-nav-container">
      <div className="menu-section">
        <h4>Menu</h4>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${selectedItem === item.id ? 'active' : ''}`}
            onClick={() => handleClick(item)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="shortcuts-section">
        <h4>Your Shortcuts</h4>
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.id}
            className={`shortcut-item ${selectedItem === shortcut.id ? 'active' : ''}`}
            onClick={() => handleClick(shortcut)}
          >
            <span className="shortcut-icon">{shortcut.icon}</span>
            <span>{shortcut.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftNav;