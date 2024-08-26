'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { increment } from './redux/store';

const Home = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.count);

  useEffect(() => {
    myCustomLog('info', 'Home page loaded'); // Using the custom alias set by configureLogger
  }, []);

  const handleIncrement = () => {
    dispatch(increment());
    myCustomLog('warn', 'Incremented count'); // Use the custom alias for a different level
  };

  const testLog = () => {
    myCustomLog('warn', 'Test log from client'); // Log message to test client-side logging
  };

  const testApiRoute = async () => {
    try {
      const numberToSend = 5; // The number you want to send in the POST request
  
      myCustomLog('api', `Sending number ${numberToSend} to API route`); // Log the input
  
      const response = await fetch('/api/test-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ number: numberToSend })
      });
  
      const data = await response.json();
  
      myCustomLog('api', `API Response: ${JSON.stringify(data)}`); // Log the output
    } catch (error) {
      myCustomLog('error', `API Request failed: ${error.message}`);
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <h1>Floating Logger Test App</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={testLog}>Test Log</button>
      <button onClick={testApiRoute}>Test API Route</button>
    </div>
  );
};

export default Home;