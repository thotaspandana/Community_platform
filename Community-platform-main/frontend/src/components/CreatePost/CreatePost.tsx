import React, { useState, useRef } from 'react';
import '../../styles/CreatePost.css';
import { createPost } from '../../services/posts.service';

interface CreateNewModalProps {
  onClose: () => void;
}

const CreatePost: React.FC<CreateNewModalProps> = ({ onClose }) => {

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    try {
      const response = await createPost(title, content, communityId, image);
      console.log('Post Created:', response);
      
      // Show success message with proper formatting
      setSuccessMessage(`Post created successfully by Sam!`);
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      handleCreate();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="create-group-modal-overlay">
      <div className="create-group-modal">
        <div className="modal-header">
          <h2>Create New Post</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {successMessage ? (
            <div className="success-message">{successMessage}</div>
          ) : (
            <>
              {/* Author information section */}
              <div className="post-author-section">
                <img 
                  src="https://randomuser.me/api/portraits/men/76.jpg" 
                  alt="Sam's profile" 
                  className="author-avatar" 
                />
                <div className="author-info">
                  <span className="author-name">Sam</span>
                  <span className="post-privacy">Public</span>
                </div>
              </div>
              
              <form onSubmit={handleFormSubmit}>
                <label className="group-label" htmlFor="groupName">
                  Title
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="group-input"
                  required
                />

                <label className="group-label" htmlFor="description">
                  Content
                </label>
                <textarea
                  id="description"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="group-input"
                  placeholder="What's on your mind, Sam?"
                />

                <label className="group-label" htmlFor="communityid">
                  Community id
                </label>
                <input
                  id="communityid"
                  type="text"
                  value={communityId}
                  onChange={e => setCommunityId(e.target.value)}
                  className="group-input"
                  required
                />

                <label className="group-label" htmlFor="image">
                  Upload Image
                </label>
                <div className="image-upload-container">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                    ref={fileInputRef}
                  />
                  {imagePreview && (
                    <div className="image-preview-container">
                      <img src={imagePreview} alt="Preview" className="image-preview" />
                      <button 
                        type="button" 
                        className="clear-image-button"
                        onClick={handleClearImage}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="submit" className="create-button">
                    Post as Sam
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
