// posts.service.ts

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8090';

// Interface for Post
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  community_id: number;
  created_at: string;
  likes?: number;
  likes_count?: number; // Adding likes_count
  like_count?: number; // Adding like_count (singular) to match backend response
  comments?: number;
  shares?: number;
  image_url?: string;
  is_liked_by_user?: boolean; // Adding is_liked_by_user property
}

// Function to create a new post
export const createPost = async (title, content, community_id, image = null) => {
    try {
        // Add author name 'Sam' to all post requests
        const authorData = {
            title,
            content,
            community_id,
            author: 'Sam'  // Always set the author to 'Sam'
        };
        
        // If there's an image, use FormData to handle multipart/form-data
        if (image) {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('community_id', community_id);
            formData.append('author', 'Sam');  // Add author to FormData
            formData.append('image', image);

            const response = await axios.post(`${API_BASE_URL}/posts/create/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } else {
            // Regular JSON payload if no image
            const response = await axios.post(`${API_BASE_URL}/posts/create/`, authorData);
            return response.data;
        }
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// Function to get posts for a specific community
export const getCommunityPosts = async (communityId: number): Promise<Post[]> => {
    try {
        console.log('Fetching posts for community:', communityId);
        const response = await axios.get(`${API_BASE_URL}/posts/?community_id=${communityId}`);
        
        // Log raw response for debugging
        console.log('Raw community posts API response:', response.data);
        
        // Handle the case where response.data might be a string representation of QuerySet
        if (typeof response.data === 'string' && response.data.includes('<QuerySet')) {
            console.warn('Received QuerySet string instead of JSON. The API has a breakpoint or debug statement.');
            return [];
        }
        
        // Handle the case where the response might not be an array
        if (!Array.isArray(response.data)) {
            console.warn('Response data is not an array:', response.data);
            return Array.isArray(response.data.results) ? response.data.results : [];
        }
        
        // Ensure likes_count is properly set for each post
        const postsWithLikesCount = response.data.map(post => {
            // The backend sends like_count (singular), so prioritize that
            const likesCount = post.like_count !== undefined ? post.like_count : 
                              (post.likes_count !== undefined ? post.likes_count : 
                              (post.likes || 0));
                              
            console.log(`Post ${post.id} likes data:`, {
                original_like_count: post.like_count,
                original_likes_count: post.likes_count,
                original_likes: post.likes,
                computed_likes_count: likesCount
            });
            
            return {
                ...post,
                // Set both like_count and likes_count for consistency
                like_count: likesCount,
                likes_count: likesCount
            };
        });
        
        console.log('Processed community posts:', postsWithLikesCount);
        return postsWithLikesCount;
    } catch (error) {
        console.error('Error fetching community posts:', error);
        throw error;
    }
};

// Function to like a post
export const likePost = async (postId: number): Promise<{ detail: string; like_count?: number; likes_count?: number }> => {
    try {
        console.log('Liking post:', postId);
        const response = await axios.post(`${API_BASE_URL}/posts/${postId}/like/`);
        console.log('Like post API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

// Function to unlike a post
export const unlikePost = async (postId: number): Promise<{ detail: string; like_count?: number; likes_count?: number }> => {
    try {
        console.log('Unliking post:', postId);
        const response = await axios.post(`${API_BASE_URL}/posts/${postId}/unlike/`);
        console.log('Unlike post API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error unliking post:', error);
        throw error;
    }
};

// Function to share a post - increment share count
export const sharePost = async (postId: number, userIds?: number[]): Promise<{ detail: string; shares?: number }> => {
    try {
        console.log('Sharing post:', postId, userIds ? `with ${userIds.length} users` : 'publicly');
        const payload = userIds && userIds.length > 0 ? { userIds } : {};
        const response = await axios.post(`${API_BASE_URL}/posts/${postId}/share/`, payload);
        console.log('Share post API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sharing post:', error);
        throw error;
    }
};