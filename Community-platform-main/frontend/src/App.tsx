import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import FacebookHome from './components/FacebookHome/FacebookHome';
import Sidebar from './components/Sidebar/Sidebar';

const { Content } = Layout;

function App() {
  // State to maintain the selected community ID
  const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Load the saved state when the app initializes
  useEffect(() => {
    // Get stored community ID and path from localStorage
    const storedCommunityId = localStorage.getItem('selectedCommunityId');
    const storedPath = localStorage.getItem('currentPath');
    
    if (storedCommunityId) {
      setSelectedCommunityId(Number(storedCommunityId));
    }
    
    // If there's a stored path and we're currently at the root, navigate to the stored path
    if (storedPath && location.pathname === '/' && storedPath !== '/') {
      navigate(storedPath);
    }
  }, [navigate, location.pathname]);

  // Save the current path whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPath', location.pathname);
  }, [location.pathname]);

  // Handler for when community is selected
  const handleCommunitySelect = (communityId: number | null) => {
    setSelectedCommunityId(communityId);
    
    // Store selected community ID in localStorage
    if (communityId) {
      localStorage.setItem('selectedCommunityId', communityId.toString());
      navigate('/community');
    } else {
      localStorage.removeItem('selectedCommunityId');
      navigate('/');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Header />
      <Layout className="site-layout" style={{ flexDirection: 'row' }}>
        <Content style={{ padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/" element={<FacebookHome onCommunitySelect={handleCommunitySelect} selectedCommunityId={selectedCommunityId} />} />
            <Route path="/community" element={<FacebookHome onCommunitySelect={handleCommunitySelect} selectedCommunityId={selectedCommunityId} />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
