import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-nav">
        <li className="sidebar-nav-item">
          <Link to="/create-post" className="sidebar-nav-link">
            <button className="create-post-button">Create New Post</button>
          </Link>
        </li>
        {/* Add more navigation items here */}
      </ul>
    </div>
  );
};

export default Sidebar;