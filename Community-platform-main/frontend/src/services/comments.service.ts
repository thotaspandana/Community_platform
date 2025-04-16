import axios from 'axios';
let API_BASE_URL = "http://localhost:8090";

// Define the Comment interface
export interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    email?: string;
  };
  created_at: string;
  updated_at?: string;
  like_count?: number;
  is_liked_by_user?: boolean;
  parent?: number | null;
  replies?: Comment[];
}

// Define the response interface for comments
export interface CommentsResponse {
  post_id: number;
  post_title: string;
  comment_count: number;
  comments: Comment[];
}

// Get comments for a specific post
export const getPostComments = async (postId: number): Promise<CommentsResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}/comments/`);
    
    // If the response is an array of comments, transform it to match the expected interface
    if (Array.isArray(response.data)) {
      return {
        post_id: postId,
        post_title: "",
        comment_count: response.data.length,
        comments: response.data
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Add a new comment to a post
export const addComment = async (postId: number, content: string): Promise<Comment> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts/${postId}/comments/`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
