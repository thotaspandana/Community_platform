import React, { useState, useRef } from 'react';
import '../../styles/CreateGroupModal.css';
import { createCommunity } from '../../services/communities.services';

interface CreateGroupModalProps {
  onClose: () => void;
}

// Helper function to generate a color from text
const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 65%)`;
};

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [privacyType, setPrivacyType] = useState('public');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{name?: string, description?: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  
  const validateForm = () => {
    const newErrors: {name?: string, description?: string} = {};
    let isValid = true;
    
    if (!groupName.trim()) {
      newErrors.name = "Community name is required";
      isValid = false;
    } else if (groupName.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
      isValid = false;
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setCoverImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleClearCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const requestData = {
      name: groupName,
      description: description,
      privacy_type: privacyType
    };
    
    try {
      const response = await createCommunity(requestData);
      console.log('Community Created:', response);
      setSuccessMessage(`Community "${response.name}" has been created successfully by Sam!`);
      
      // Close the modal after a delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating community:', error);
      setErrors({
        name: "Failed to create community. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreate();
  };

  return (
    <div className="create-group-modal-overlay">
      <div className="create-group-modal">
        <div className="modal-header">
          <h2>Create New Community</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {successMessage ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit}>
              {/* Community preview/icon section */}
              <div className="community-preview">
                {groupName ? (
                  <div 
                    className="community-icon-preview" 
                    style={{ backgroundColor: generateColorFromString(groupName) }}
                  >
                    <span>{groupName.charAt(0).toUpperCase()}</span>
                  </div>
                ) : (
                  <div className="community-icon-placeholder">
                    <span>?</span>
                  </div>
                )}
                <div className="community-preview-info">
                  <h3>{groupName || 'Your Community'}</h3>
                  <p className="preview-privacy">
                    {privacyType === 'public' ? 'Public Community' : 'Private Community'}
                  </p>
                </div>
              </div>
              
              <label className="group-label" htmlFor="groupName">
                Community Name*
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                className={`group-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Enter a unique name for your community"
                required
              />
              {errors.name && <div className="error-message">{errors.name}</div>}

              <label className="group-label" htmlFor="description">
                Description*
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`group-input ${errors.description ? 'input-error' : ''}`}
                placeholder="Describe what your community is about..."
                rows={3}
              />
              {errors.description && <div className="error-message">{errors.description}</div>}
              
              <label className="group-label" htmlFor="privacyType">
                Privacy Setting
              </label>
              <select
                id="privacyType"
                value={privacyType}
                onChange={e => setPrivacyType(e.target.value)}
                className="group-select"
              >
                <option value="public">Public - Anyone can see and join</option>
                <option value="private">Private - Only members can see content</option>
              </select>
              <p className="privacy-info">
                {privacyType === 'public' 
                  ? 'Anyone can find this community and see its posts.'
                  : 'Only approved members can see content posted in this community.'}
              </p>
              
              <label className="group-label" htmlFor="coverImage">
                Community Cover Image (Optional)
              </label>
              <div className="image-upload-container">
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="image-input"
                  ref={fileInputRef}
                />
                {coverImagePreview && (
                  <div className="image-preview-container">
                    <img src={coverImagePreview} alt="Cover Preview" className="cover-image-preview" />
                    <button 
                      type="button" 
                      className="clear-image-button"
                      onClick={handleClearCoverImage}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="create-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Community'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;