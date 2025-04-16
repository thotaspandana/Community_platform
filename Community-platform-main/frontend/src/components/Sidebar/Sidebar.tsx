import React, { useState } from 'react';
import { Layout, Menu, Button, Divider } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DeploymentUnitOutlined,
  TeamOutlined,
  ShopOutlined,
  PlaySquareOutlined,
  FlagOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../../styles/Sidebar.css';

const { Sider } = Layout;

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      collapsedWidth={80}
      width={280}
      className="sidebar-container"
    >
      <div className="sidebar-top-section">
        {collapsed ? (
          <MenuUnfoldOutlined className="toggle-button" onClick={toggleCollapse} />
        ) : (
          <MenuFoldOutlined className="toggle-button" onClick={toggleCollapse} />
        )}
        {!collapsed && (
          <Button
            type="primary"
            className="create-new-button"
            onClick={() => { /* handle create new action */ }}
          >
            Create New
          </Button>
        )}
      </div>

      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[]}
        className="sidebar-menu"
      >
        <Menu.Item
          key="community"
          icon={<FlagOutlined />}
          onClick={() => { navigate('/community'); }}
        >
          Community
        </Menu.Item>
        <Menu.Item
          key="covid"
          icon={<GlobalOutlined />}
          onClick={() => { /* navigate somewhere */ }}
        >
          Covid-19 Information
        </Menu.Item>
        <Menu.Item
          key="friends"
          icon={<TeamOutlined />}
          onClick={() => { /* navigate somewhere */ }}
        >
          Friends
        </Menu.Item>
        <Menu.Item
          key="groups"
          icon={<DeploymentUnitOutlined />}
          onClick={() => { /* navigate somewhere */ }}
        >
          Groups
        </Menu.Item>
        <Menu.Item
          key="marketplace"
          icon={<ShopOutlined />}
          onClick={() => { /* navigate somewhere */ }}
        >
          Marketplace
        </Menu.Item>
        <Menu.Item
          key="watch"
          icon={<PlaySquareOutlined />}
          onClick={() => { /* navigate somewhere */ }}
        >
          Watch
        </Menu.Item>
        <Menu.Item
          key="seeMore"
          onClick={() => { /* navigate somewhere */ }}
        >
          See More
        </Menu.Item>
      </Menu>

      <Divider />

      {!collapsed && (
        <div className="shortcuts-container">
          <h4 className="shortcuts-title">Your shortcuts</h4>
          <div className="shortcut-item">
            <div className="shortcut-badge">UD</div>
            <span className="shortcut-text">UI/UX Designer</span>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-badge">UR</div>
            <span className="shortcut-text">UX Research</span>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-badge">UI</div>
            <span className="shortcut-text">UX Illustrator</span>
          </div>
        </div>
      )}
    </Sider>
  );
}

export default Sidebar;
