 // Integration.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const IntegrationPage = () => {
  const [connected, setConnected] = useState(false);
  const [connectedPageName, setConnectedPageName] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const initFacebookSDK = () => {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId: '1212714693082352',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v19.0'
        });
      };

      (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    };

    initFacebookSDK();
  }, []);

  const fetchConnectedPages = (accessToken) => {
    window.FB.api('/me/accounts', { access_token: accessToken, fields: 'id,name' }, (accountsResponse) => {
      if (accountsResponse && accountsResponse.data && accountsResponse.data.length > 0) {
        setConnectedPageName(accountsResponse.data[0].name);
      }
    });
  };

  const handleConnect = () => {
    window.FB.getLoginStatus(response => {
      console.log('Facebook login status response:', response);
  
      if (response.status === 'connected') {
        const accessToken = response.authResponse.accessToken;
        localStorage.setItem('fbAccessToken', accessToken);
        setConnected(true);
        fetchConnectedPages(accessToken);
      } else {
        window.FB.login(loginResponse => {
          console.log('Facebook login response:', loginResponse);
  
          if (loginResponse.status === 'connected') {
            const accessToken = loginResponse.authResponse.accessToken;
            localStorage.setItem('fbAccessToken', accessToken);
            setConnected(true);
            fetchConnectedPages(accessToken);
          }
        }, { scope: 'pages_show_list,pages_messaging,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_engagement' });
      }
    });
  };
  

  const handleDeleteIntegration = () => {
    const fbAccessToken = localStorage.getItem('fbAccessToken');
    
    if (fbAccessToken) {
      window.FB.logout(response => {
        console.log('User logged out from Facebook:', response);
      });
    }
  
    localStorage.removeItem('fbAccessToken');
    setConnected(false);
    setConnectedPageName('');
    navigate('/integration');
  };
  

  const handleReplyToMessages = () => {
    navigate('/dashboard');
  };

  return (
    <div className="body">
      <div className="card">
        <h4>Facebook Page Integration</h4>
        {connected ? (
          <>
            <p>Connected Page: {connectedPageName}</p>
            <button className="button delete-button" onClick={handleDeleteIntegration}>
              Delete Integration
            </button>
            <button className="button" onClick={handleReplyToMessages}>
              Reply to Messages
            </button>
          </>
        ) : (
          <>
            <div id="fb-root"></div>
            <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v19.0&appId=370145125963653" nonce="v1kAhtLC"></script>
            <button className="button" onClick={handleConnect}>
              Connect Page
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IntegrationPage;
