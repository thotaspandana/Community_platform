import axios from 'axios';

// Interface for request body
export interface CreateCommunityRequest {
  name: string;
  description?: string;
}

// Interface for response data
export interface CreateCommunityResponse {
  id: number;
  name: string;
  description: string;
  owner: string;
}

// Interface for community list item
export interface Community {
  id: number;
  name: string;
  description: string;
  owner: string;
  members_count?: number;
  created_at?: string;
}

/**
 * Creates a new community.
 * @param data - Request body containing the name and description of the community.
 * @param token - Optional JWT token for authentication.
 * @returns Promise<CreateCommunityResponse>
 */
export const createCommunity = async (
  data: CreateCommunityRequest,
  token?: string
): Promise<CreateCommunityResponse> => {
  const response = await axios.post<CreateCommunityResponse>('http://localhost:8090/communities/create/', data, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};

/**
 * Gets all communities.
 * @param token - Optional JWT token for authentication.
 * @returns Promise<Community[]>
 */
export const getAllCommunities = async (token?: string): Promise<Community[]> => {
  const response = await axios.get<Community[]>('http://localhost:8090/communities/communities/', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return response.data;
};