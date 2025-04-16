import React, { useEffect, useState } from 'react';
import '../../styles/PostList.css';
import { getPosts } from '../../services/fbDataService';
import { getCommunityPosts, likePost, unlikePost, sharePost} from '../../services/posts.service';
import { getPostComments, addComment, Comment } from '../../services/comments.service'; // Import our new service
import SharePostModal from '../SharePostModal/SharePostModal';

// Define a unified Post interface that works with both mock data and API responses
interface Author {
  id?: number;
  username?: string;
  email?: string;
}

interface Community {
  id: number;
  name: string;
  description?: string;
}

// This interface will be used for our component state
export interface DisplayPost {
  id: number;
  title?: string; // Title is optional since mock data doesn't always have it
  content: string;
  author: Author | string;
  community?: Community;
  community_id?: number;
  created_at?: string;
  updated_at?: string;
  image?: string;
  image_url?: string;
  likes?: number;
  likes_count?: number; // Added likes_count
  like_count?: number; // Adding like_count to match backend response
  comments?: Comment[] | number;
  shares?: number | string;
  share_count?: number; // Added share_count to match backend response
  time?: string;
  thumbnailUrl?: string;
  alt?: string;
  comment_count?: number;
  isLiked?: boolean; // Track if the post is liked by the user
}

interface PostListProps {
  selectedCommunityId?: number | null;
}

// Utility function to safely render any value
const safeRender = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};

// Utility functions to simplify nested ternary expressions
const getLikesCount = (post: any): number => {
  if (post.like_count !== undefined) return post.like_count;
  if (post.likes_count !== undefined) return post.likes_count;
  return post.likes ?? 0;
};

const getSharesCount = (post: any): number => {
  if (post.share_count !== undefined) return post.share_count;
  return post.shares ?? 0;
};

const getCommentCount = (post: any): number => {
  if (post.comment_count !== undefined) return post.comment_count;
  if (post.comments !== undefined && typeof post.comments === 'number') return post.comments;
  return 0;
};

const PostList: React.FC<PostListProps> = ({ selectedCommunityId }) => {
  const [posts, setPosts] = useState<DisplayPost[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [likeInProgress, setLikeInProgress] = useState<{[key: number]: boolean}>({});
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [postToShare, setPostToShare] = useState<DisplayPost | null>(null);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: number]: boolean }>({});
  const [addingComment, setAddingComment] = useState<{ [key: number]: boolean }>({});
  const [loadingComments, setLoadingComments] = useState<{ [key: number]: boolean }>({});
  
  // Debug state to track likes information
  const [debugInfo, setDebugInfo] = useState<{ [key: number]: any }>({});

  // Fetch posts whenever selectedCommunityId or refreshTrigger changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        if (selectedCommunityId) {
          // Fetch posts for the selected community
          const communityPosts = await getCommunityPosts(selectedCommunityId);
          
          // Debug info
          const newDebugInfo: { [key: number]: any } = {};
          
          // Map community posts to the format expected by the component
          const formattedPosts = communityPosts.map(post => {
            // Create a safe object to access properties that might not exist in the type
            const safePost = post as any;
            
            // Store debug info for each post
            newDebugInfo[post.id] = {
              raw_likes: safePost.likes,
              raw_likes_count: safePost.likes_count,
              raw_like_count: safePost.like_count,
              computed_likes: getLikesCount(safePost),
              raw_shares: safePost.shares,
              raw_share_count: safePost.share_count,
              computed_shares: getSharesCount(safePost),
              raw_comment_count: safePost.comment_count,
              computed_comment_count: getCommentCount(safePost)
            };
            
            return {
              id: post.id,
              title: post.title || '',
              content: post.content,
              author: post.author || 'Anonymous',
              community_id: post.community_id,
              created_at: post.created_at,
              likes: getLikesCount(safePost),
              likes_count: getLikesCount(safePost),
              like_count: getLikesCount(safePost),
              shares: getSharesCount(safePost),
              share_count: getSharesCount(safePost),
              comment_count: getCommentCount(safePost), 
              thumbnailUrl: post.image_url || '',
              time: post.created_at ? new Date(post.created_at).toLocaleString() : 'Unknown date',
              comments: getCommentCount(safePost),
              isLiked: post.is_liked_by_user || false
            } as DisplayPost;
          });
          
          // Update debug info state
          setDebugInfo(newDebugInfo);
          console.log("Debug info for posts:", newDebugInfo);
          
          setPosts(formattedPosts);
        } else {
          // If no community is selected, fetch all posts
          const mockPosts = await getPosts();
          // Transform mock posts to match our Post interface with explicit casting
          const formattedMockPosts = mockPosts.map(post => {
            return {
              ...post,
              title: (post as any).title || '', 
              created_at: post.time || new Date().toISOString(),
              comments: [],
              comment_count: typeof post.comments === 'number' ? post.comments : 0,
              likes_count: post.likes || 0, 
              isLiked: false 
            } as DisplayPost;
          });
          
          setPosts(formattedMockPosts);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [selectedCommunityId, refreshTrigger]);

  // Handle like/unlike functionality
  const handleLikeToggle = async (postId: number, isCurrentlyLiked: boolean = false) => {
    // Prevent duplicate like/unlike requests for the same post
    if (likeInProgress[postId]) return;
    
    setLikeInProgress(prev => ({ ...prev, [postId]: true }));
    
    try {
      // Call the appropriate API based on current like status
      let response;
      if (isCurrentlyLiked) {
        response = await unlikePost(postId);
      } else {
        response = await likePost(postId);
      }
      
      // Log detailed debugging info about the response
      console.log(`${isCurrentlyLiked ? 'Unlike' : 'Like'} response for post ${postId}:`, {
        response_data: response,
        has_likes_count: 'likes_count' in response,
        has_like_count: 'like_count' in response,
        likes_count_value: response.likes_count,
        like_count_value: response.like_count
      });
      
      // Update the posts state after successful API call
      setPosts(prevPosts => {
        const updatedPosts = prevPosts.map(post => {
          if (post.id === postId) {
            const likesCount = getLikesCount(response);
            
            console.log(`Updating post ${postId} likes:`, {
              previous_likes: post.likes,
              previous_likes_count: post.likes_count,
              api_likes_count: response.likes_count,
              api_like_count: response.like_count,
              computed_likes_count: likesCount,
              is_from_api: response.like_count !== undefined || response.likes_count !== undefined
            });
            
            return {
              ...post,
              likes: likesCount,
              likes_count: likesCount,
              like_count: likesCount,
              isLiked: !isCurrentlyLiked
            };
          }
          return post;
        });
        
        return updatedPosts;
      });
      
      if (selectedCommunityId && response.like_count === undefined && response.likes_count === undefined) {
        console.log('API did not return like_count or likes_count, scheduling refresh');
        setTimeout(() => {
          console.log('Refreshing posts to get updated like counts');
          setRefreshTrigger(prev => prev + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikeInProgress(prev => ({ ...prev, [postId]: false }));
    }
  };

  // Handle comment button click - Fetch comments when clicked
  const handleCommentClick = async (postId: number) => {
    const willShow = !showComments[postId];
    
    setShowComments(prev => ({
      ...prev,
      [postId]: willShow
    }));
    
    if (willShow) {
      const currentPost = posts.find(p => p.id === postId);
      const needToFetch = currentPost && (
        typeof currentPost.comments === 'number' || 
        currentPost.comments === undefined || 
        (Array.isArray(currentPost.comments) && currentPost.comments.length === 0) ||
        showComments[postId] === false
      );
      
      if (needToFetch) {
        console.log(`Fetching comments for post ${postId} from API endpoint: /posts/${postId}/comments/`);
        setLoadingComments(prev => ({
          ...prev,
          [postId]: true
        }));
        
        try {
          const commentsResponse = await getPostComments(postId);
          console.log(`Received response for post ${commentsResponse.post_id}: ${commentsResponse.comment_count} comments`);
          
          const comments = commentsResponse.comments ?? [];
          
          const sanitizeComment = (comment: any): Comment => {
            return {
              id: Number(comment.id),
              content: safeRender(comment.content),
              author: {
                id: comment.author?.id ?? 0,
                username: safeRender(comment.author?.username ?? 'User'),
                email: safeRender(comment.author?.email ?? '')
              },
              created_at: safeRender(comment.created_at),
              updated_at: safeRender(comment.updated_at ?? ''),
              like_count: comment.like_count ?? 0,
              is_liked_by_user: Boolean(comment.is_liked_by_user),
              parent: comment.parent ?? null,
              replies: Array.isArray(comment.replies) 
                ? comment.replies.map(sanitizeComment) 
                : []
            };
          };
          
          const validComments = comments.map(sanitizeComment);
          
          setPosts(prevPosts => {
            return prevPosts.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  comments: validComments,
                  comment_count: commentsResponse.comment_count
                };
              }
              return post;
            });
          });
        } catch (error) {
          console.error(`Failed to load comments for post ${postId}:`, error);
        } finally {
          setLoadingComments(prev => ({
            ...prev,
            [postId]: false
          }));
        }
      }
    }
  };

  // Handle comment text change
  const handleCommentChange = (postId: number, text: string) => {
    setCommentText(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  // Handle add comment button click
  const handleAddCommentClick = (postId: number) => {
    setAddingComment(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  // Handle comment submission - Now uses the API
  const handleSubmitComment = async (postId: number) => {
    if (!commentText[postId] || commentText[postId].trim() === '') {
      return;
    }

    try {
      // Call the API to add a comment
      const response = await addComment(postId, commentText[postId]);
      console.log('Comment added:', response);

      // Sanitize the response to ensure no object values are rendered directly
      const safeResponse: Comment = {
        id: Number(response.id),
        content: safeRender(response.content),
        author: {
          id: response.author?.id ?? 0,
          username: "Sam", // Always use "Sam" as the username for new comments
          email: safeRender(response.author?.email ?? '')
        },
        created_at: safeRender(response.created_at),
        updated_at: safeRender(response.updated_at ?? ''),
        like_count: response.like_count ?? 0,
        is_liked_by_user: Boolean(response.is_liked_by_user),
        parent: response.parent ?? null,
        replies: Array.isArray(response.replies) 
          ? response.replies.map((reply: any) => ({
              id: Number(reply.id),
              content: safeRender(reply.content),
              author: {
                id: reply.author?.id ?? 0,
                username: safeRender(reply.author?.username ?? 'User'),
                email: safeRender(reply.author?.email ?? '')
              },
              created_at: safeRender(reply.created_at),
              updated_at: safeRender(reply.updated_at ?? '')
            }))
          : []
      };

      // Update the posts state
      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            // Initialize comments array if it doesn't exist or is a number
            const currentComments = Array.isArray(post.comments) 
              ? post.comments 
              : [];
            
            return {
              ...post,
              comments: [...currentComments, safeResponse],
              comment_count: (post.comment_count ?? 0) + 1
            };
          }
          return post;
        });
      });

      // Clear comment text and hide comment form
      setCommentText(prev => ({
        ...prev,
        [postId]: ''
      }));
      setAddingComment(prev => ({
        ...prev,
        [postId]: false
      }));

    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Handle share button click
  const handleShareClick = (post: DisplayPost) => {
    setPostToShare(post);
  };

  // Close share modal
  const handleCloseShareModal = () => {
    setPostToShare(null);
  };

  // Handle successful share
  const handleShareSuccess = async (postId: number) => {
    try {
      const response = await sharePost(postId);
      console.log('Share response:', response);

      setPosts(prevPosts => {
        return prevPosts.map(post => {
          if (post.id === postId) {
            const safeResponse = response as any;
            
            const newShareCount = getSharesCount(safeResponse);
            
            console.log(`Updating share count for post ${postId}:`, {
              previous_count: post.shares,
              previous_share_count: post.share_count,
              api_response_shares: safeResponse.shares,
              api_response_share_count: safeResponse.share_count,
              new_count: newShareCount
            });
            
            return {
              ...post,
              shares: newShareCount,
              share_count: newShareCount
            };
          }
          return post;
        });
      });
      
      handleCloseShareModal();
    } catch (error) {
      console.error('Error updating share count:', error);
    }
  };

  if (loading) {
    return <div className="post-list-loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error-msg">{error}</div>;
  }

  if (posts.length === 0 && selectedCommunityId) {
    return (
      <div className="no-posts-message">
        <p>No posts available in this community.</p>
        <p>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-author-avatar">
              <img
                src="https://placehold.co/40x40?text=User"
                alt={`Avatar of ${typeof post.author === 'string' ? post.author : post.author.username || 'User'}`}
              />
            </div>
            <div className="post-author-info">
              <h4>{typeof post.author === 'string' ? post.author : post.author.username || 'User'}</h4>
              <span className="post-time">{post.time || (post.created_at ? new Date(post.created_at).toLocaleString() : 'Unknown date')}</span>
            </div>
          </div>
          <div className="post-content">
            {post.title && <h3 className="post-title">{post.title}</h3>}
            <p>{post.content}</p>
            {(post.thumbnailUrl || post.image_url) && (
              <img
                src={post.thumbnailUrl || post.image_url}
                alt={post.alt || 'Post image'}
                className="post-thumbnail"
              />
            )}
          </div>
          <div className="post-actions">
            <div className="post-stats">
              <span title={`Debug: ${JSON.stringify(debugInfo[post.id] || {})}`}>
                {getLikesCount(post)} Likes
              </span>
              <span>{getCommentCount(post)} Comments</span>
              <span>{getSharesCount(post)} Shares</span>
            </div>
            <div className="post-action-buttons">
              <button 
                className={`like-button ${post.isLiked ? 'liked' : ''}`}
                onClick={() => handleLikeToggle(post.id, post.isLiked)}
                disabled={likeInProgress[post.id]}
              >
                {post.isLiked ? 'Unlike' : 'Like'}
              </button>
              <button 
                onClick={() => handleCommentClick(post.id)}
                className={showComments[post.id] ? 'active' : ''}
              >
                Comment
              </button>
              <button onClick={() => handleShareClick(post)}>Share</button>
            </div>
          </div>
          
          {/* Comments Section */}
          {showComments[post.id] && (
            <div className="post-comments-section">
              <div className="comments-header">
                <h4>Comments ({getCommentCount(post)})</h4>
              </div>
              
              {/* Loading indicator for comments */}
              {loadingComments[post.id] && (
                <div className="comments-loading">Loading comments...</div>
              )}
              
              {/* Comments List */}
              <div className="comments-list">
                {!loadingComments[post.id] && Array.isArray(post.comments) && post.comments.length > 0 ? (
                  post.comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-author">
                        <img
                          src="https://placehold.co/30x30?text=User"
                          alt={`Avatar of ${safeRender(comment.author.username || 'User')}`}
                          className="comment-avatar"
                        />
                        <span className="comment-username">{safeRender(comment.author.username || 'User')}</span>
                        <span className="comment-time">
                          {new Date(comment.created_at.toString()).toLocaleString()}
                        </span>
                      </div>
                      <div className="comment-content">
                        {safeRender(comment.content)}
                      </div>
                      
                      {/* Render replies if they exist */}
                      {comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <div className="comment-replies">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="reply-item">
                              <div className="comment-author">
                                <img
                                  src="https://placehold.co/25x25?text=User"
                                  alt={`Avatar of ${safeRender(reply.author.username || 'User')}`}
                                  className="comment-avatar"
                                />
                                <span className="comment-username">{safeRender(reply.author.username || 'User')}</span>
                                <span className="comment-time">
                                  {new Date(reply.created_at.toString()).toLocaleString()}
                                </span>
                              </div>
                              <div className="comment-content">
                                {safeRender(reply.content)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  !loadingComments[post.id] && (
                    <div className="no-comments-message">
                      No comments yet. Be the first to comment!
                    </div>
                  )
                )}
              </div>
              
              {/* Add Comment Form */}
              {addingComment[post.id] ? (
                <div className="add-comment-form">
                  <div className="comment-input-container">
                    <img 
                      src="https://randomuser.me/api/portraits/men/76.jpg" 
                      alt="Sam's profile" 
                      className="comment-user-avatar" 
                    />
                    <textarea
                      className="comment-input"
                      placeholder="Write a comment as Sam..."
                      value={commentText[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                    />
                  </div>
                  <div className="comment-actions">
                    <button 
                      className="cancel-comment-button"
                      onClick={() => {
                        setAddingComment(prev => ({...prev, [post.id]: false}));
                        setCommentText(prev => ({...prev, [post.id]: ''}));
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="submit-comment-button"
                      onClick={() => handleSubmitComment(post.id)}
                      disabled={!commentText[post.id] || commentText[post.id].trim() === ''}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="add-comment-button"
                  onClick={() => handleAddCommentClick(post.id)}
                >
                  Add a comment as Sam...
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Share Post Modal */}
      {postToShare && (
        <SharePostModal
          post={postToShare}
          onClose={handleCloseShareModal}
          onShareSuccess={handleShareSuccess}
        />
      )}
    </div>
  );
};

export default PostList;