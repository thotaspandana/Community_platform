import React, { useEffect } from 'react';
import '../../styles/FacebookHome.css';
import LeftSidebar from '../LeftSidebar/LeftSidebar';
import ContentArea from '../ContentArea/ContentArea';
import RightSidebar from '../RightSidebar/RightSidebar';
import { Layout } from 'antd';

const { Content } = Layout;

interface FacebookHomeProps {
  selectedCommunityId: number | null;
  onCommunitySelect: (communityId: number | null) => void;
}

const FacebookHome: React.FC<FacebookHomeProps> = ({ selectedCommunityId, onCommunitySelect }) => {
  return (
    <Layout className="facebook-home-layout">
      <LeftSidebar onCommunitySelect={onCommunitySelect} initialSelectedCommunity={selectedCommunityId} />
      <Content className="facebook-home-content">
        <ContentArea selectedCommunityId={selectedCommunityId} />
      </Content>
      <RightSidebar />
    </Layout>
  );
};

export default FacebookHome;