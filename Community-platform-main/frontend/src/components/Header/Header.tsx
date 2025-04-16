import React from 'react';
import { Input } from 'antd';
import { SearchOutlined, Home, LiveTv, Storefront, Group, Notifications } from '@mui/icons-material';
// import { SearchOutlined } from '@mui/icons-material';
import '../../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="fb-header">
      <div className="fb-header-left">
        <div className="fb-search-bar">
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined style={{ color: '#606770' }} />}
            style={{ borderRadius: '50px' }}
          />
        </div>
      </div>
      <div className="fb-header-center">
        <div className="fb-nav-icon home active">
         <Home style={{ fontSize: 30 }} />
        </div>
        <div className="fb-nav-icon">
          <LiveTv style={{ fontSize: 30 }} />
        </div>
        <div className="fb-nav-icon">
          <Storefront style={{ fontSize: 30 }} />
        </div>
        <div className="fb-nav-icon">
          <Group style={{ fontSize: 30 }} />
        </div>
        <div className="fb-nav-icon">
          <Notifications style={{ fontSize: 30 }} />
      </div>
      </div>
      <div className="fb-header-right">
        <div className="fb-profile">
          <img
            src="https://randomuser.me/api/portraits/men/76.jpg"
            alt="Sam's Profile"
          />
          <span>Sam</span>
        </div>
        <div className="fb-dropdown">
          <i className="fas fa-caret-down"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
