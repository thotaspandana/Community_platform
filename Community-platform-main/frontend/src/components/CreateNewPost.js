import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function CreateNewPost({ show, handleClose }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [communityId, setCommunityId] = useState('');

  const handleSubmit = () => {
    // Handle form submission, e.g., call API to create post
    console.log('Creating post:', title, content, communityId);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPostTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPostContent" className="mt-3">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCommunityId" className="mt-3">
            <Form.Label>Community ID</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter community ID"
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateNewPost;