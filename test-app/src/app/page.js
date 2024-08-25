'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { increment } from './redux/store';

const Home = () => {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.count);

  useEffect(() => {
    myCustomLog('Home page loaded'); // Using the custom alias set by configureLogger
  }, []);

  const handleIncrement = () => {
    dispatch(increment());
    myCustomLog('warn', 'Incremented count'); // Use the custom alias for a different level
  };
  const test = () => {
    myCustomLog('warn', 'test'); // Use the custom alias for a different level
  }

  return (
    <div style={{height:'100vh'}}>
      <h1>Floating Logger Test App</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={test}> Test </button>
    </div>
  );
};

export default Home;