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
      myCustomLog('api', 'Testing API route'); // Log the action of testing API route
      const response = await fetch('/api/test-route', {
        method: 'GET',
      });
      const data = await response.json();
      myCustomLog('api', `API Response: ${JSON.stringify(data)}`);
    } catch (error) {
      myCustomLog('error', `API Request failed: ${error}`);
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