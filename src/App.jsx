import React from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const baseUrl = process.env.REACT_APP_API_SERVER_URL;
const vapidKey = process.env.REACT_APP_FCM_VAPID_KEY;
const accessToken = process.env.REACT_APP_ACCESSTOKEN;

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FCM_API_KEY,
  authDomain: process.env.REACT_APP_FCM_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FCM_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FCM_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FCM_APP_ID,
  measurementId: process.env.REACT_APP_FCM_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// 권한 요청
Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
    else {
      console.log('not granted');
    }
  });

// 토큰 요청
getToken(messaging, { vapidKey: `${vapidKey}` }).then((currentToken) => {
  if (currentToken) {
    console.log(currentToken);
    saveToken(currentToken);
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});

// 토큰 저장
const saveToken = async (token) => {
  const postData = {
    fcmToken: token
  };

  try {
    console.log("토큰 저장 요청");
    
    const response = await fetch(`${baseUrl}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(postData)
    });

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error('POST 요청 중 에러 발생:', error);
  }
};

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  alert(payload.notification.body);
  // ...
});

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}

export default App;
