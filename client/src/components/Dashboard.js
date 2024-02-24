// Dashboard.js
import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');

  const initFacebookSDK = () => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1212714693082352',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v19.0',
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  };

  useEffect(() => {
    initFacebookSDK();
    // Fetch conversations when the component mounts
    fetchConversations();
  }, []);                                          

  const fetchConversations = async () => {
    try {
      const fbAccessToken = 'EAARO9SRZBvPABOxwc72POrPOFRQtnnq73FiyxmgUpmERQ15UX7r8GJvsyWyFLIU4PqnwbMG4IvCUqVAuwzreXluiRv6pK7WZAQCdG1yWFvSLOgVcmupRv9GlxU5lzFoFEhbcl1gSHwyHvzI6Cr9ZBnoAO7ZAk0Nlmdt2iQBvEqhG9ZCb2cMskUD7eXu3R3Ks7obVVAPXD';
      const response = await fetch(`https://graph.facebook.com/v19.0/me/conversations?access_token=${fbAccessToken}&fields=id,participants,snippet`);
  
      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (responseData && responseData.data && responseData.data.length > 0) {
        setConversations(
          responseData.data.map((conversation) => {
            const sender = conversation.participants.data.find(participant => participant.id !== '61556576464672');
            return {
              id: conversation.id,
              participant: sender,
              snippet: conversation.snippet,
            };
          }).filter(conversation => conversation.participant) 
        );
      } else {
        console.log('No conversations found or no recent conversations on the Page.');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessagesForConversation = async (conversationId) => {
    try {
      const fbAccessToken = 'EAARO9SRZBvPABO8Yo2UwZBSsvv0soVZCGxRAW0MqZBCAH6TUXYdDg8mZARZAy59LMZBvmDOxyZByaMuXMFqDmCthp4XLokZAyR6b1G9ZBnXIZB2l2px7p9DonGj0f3p3bqYoA9QqJ9FEDL8ZB6k6LD292nhV8ejZADTp7ZCtWgnp2Nme8PaO5qJrqwoXYMYYdsFLqSZCyJryU1phdYO';
      const response = await window.FB.api(`/${conversationId}/messages`, {
        access_token: fbAccessToken,
        fields: 'id,messages{message,from,created_time}',
      });
       
      console.log('Messages for conversation fetched successfully:', response);

      if (response && response.data && response.data.length > 0) {
        setSelectedConversation({
          id: conversationId,
          messages: response.data,
          participantName: response.data[0].from.name,
        });
        console.log('Selected Conversation:', selectedConversation);
      }
    } catch (error) {
      console.error('Error fetching messages for conversation:', error);
    }
  };

  const handleReply = async () => {
    try {
      const fbAccessToken = 'EAARO9SRZBvPABOxwc72POrPOFRQtnnq73FiyxmgUpmERQ15UX7r8GJvsyWyFLIU4PqnwbMG4IvCUqVAuwzreXluiRv6pK7WZAQCdG1yWFvSLOgVcmupRv9GlxU5lzFoFEhbcl1gSHwyHvzI6Cr9ZBnoAO7ZAk0Nlmdt2iQBvEqhG9ZCb2cMskUD7eXu3R3Ks7obVVAPXD';
      const recipientId = selectedConversation.participant.id;

    await window.FB.api(`/${recipientId}/messages`, 'POST', {
      access_token: fbAccessToken,
      message: replyText,
    });
       
    
    // After replying, refresh the messages for the selected conversation
    fetchMessagesForConversation(selectedConversation.id);
    // Optionally, clear the reply text input
    setReplyText('');
  } catch (error) {
    console.error('Error replying to message:', error);
  }
};

return (
  <div className="dashboard-container">
    <h1>Dashboard</h1>
    {conversations.length > 0 ? (
      <div className="conversations-container">
        <h2>Conversations</h2>
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id} className="conversation-item">
              <button onClick={() => fetchMessagesForConversation(conversation.id)}>
                <div className="participant-name">{conversation.participant.name}</div>
                <div className="last-message">{conversation.snippet}</div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <p>No conversations available.</p>
    )}

    {selectedConversation && (
      <div className="selected-conversation-container">
        <h2>Conversation with {selectedConversation.participant.name}</h2>
        <ul>
          {selectedConversation.messages.map((message) => (
            <li key={message.id} className="message-item">
              <p className="message-text">{message.message}</p>
              <p className="message-sender">From: {message.from.name}</p>
            </li>
          ))}
        </ul>

        
        <div className="reply-form-container">
          <textarea
            rows="4"
            cols="50"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply here"
          />
          <button onClick={handleReply}>Reply</button>
        </div>
      </div>
    )}
  </div>
);
};

export default Dashboard;


