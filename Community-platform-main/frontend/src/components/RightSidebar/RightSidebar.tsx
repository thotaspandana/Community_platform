import React, { useEffect, useState } from 'react';
import '../../styles/RightSidebar.css';
import {
  getNewsUpdates,
  getFriendRequests,
  getContacts,
} from '../../services/fbDataService';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
  time: string;
}

interface FriendRequest {
  id: number;
  name: string;
  mutualFriends: number;
  imageUrl: string;
  alt: string;
  time: string;
}

interface Contact {
  id: number;
  name: string;
  status: string;
  imageUrl: string;
  alt: string;
}

const RightSidebar: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSideData = async () => {
      try {
        const [newsUpdates, requests, contactsData] = await Promise.all([
          getNewsUpdates(),
          getFriendRequests(),
          getContacts(),
        ]);
        setNews(newsUpdates);
        setFriendRequests(requests);
        setContacts(contactsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load right sidebar data');
      }
    };
    fetchSideData();
  }, []);

  return (
    <div className="right-sidebar-container">
      {error && <div className="error-msg">{error}</div>}

      <div className="news-section">
        <div className="section-header">
          <h3>News Update</h3>
          <a className="see-all-link" href="#see-all-news">See All</a>
        </div>
        {news.map((item) => (
          <div key={item.id} className="news-item">
            <img src={item.imageUrl} alt={item.alt} className="news-img" />
            <div className="news-info">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <span className="time-link">{item.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="friend-requests-section">
        <div className="section-header">
          <h3>Friend Requests</h3>
          <a className="see-all-link" href="#see-all-requests">See All</a>
        </div>
        {friendRequests.map((req) => (
          <div key={req.id} className="friend-request-item">
            <img src={req.imageUrl} alt={req.alt} className="friend-req-img" />
            <div className="friend-req-info">
              <h4>{req.name}</h4>
              <p>{req.mutualFriends} mutual friend</p>
              <small>{req.time}</small>
              <div className="friend-req-actions">
                <button className="confirm-btn">Confirm</button>
                <button className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="contacts-section">
        <h3>Contacts</h3>
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-item">
            <img
              src={contact.imageUrl}
              alt={contact.alt}
              className="contact-img"
            />
            <div className="contact-info">
              <span className="contact-name">{contact.name}</span>
              <small className="contact-status">{contact.status}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;