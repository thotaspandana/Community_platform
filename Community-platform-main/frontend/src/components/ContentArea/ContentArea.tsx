import React from 'react';
import '../../styles/ContentArea.css';
import Stories from '../Stories/Stories';
import PostList from '../PostList/PostList';

interface ContentAreaProps {
  selectedCommunityId?: number | null;
}

const ContentArea: React.FC<ContentAreaProps> = ({ selectedCommunityId }) => {
  return (
    <div className="content-area">
      {/* Only show Stories when not viewing a specific community */}
      {!selectedCommunityId && <Stories />}
      <PostList selectedCommunityId={selectedCommunityId} />
    </div>
  );
};

export default ContentArea;