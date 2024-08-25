import './FloatingLogger.css';

import React, { forwardRef, useEffect, useRef, useState } from 'react';

import Draggable from 'react-draggable';
import { useLog } from './LogContext'; // Import the custom hook from LogProvider
import { useSelector } from 'react-redux';

// Define the props expected by the FloatingLogger component
interface FloatingLoggerProps {
  logSelector: (state: any) => any; // Function to select the specific slice of Redux state needed
}

// Wrapper around the Draggable component to manage dragging and refs
const DraggableWrapper = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Draggable>>((props, ref) => {
  const nodeRef = ref as React.RefObject<HTMLDivElement>;

  return (
    <Draggable {...props} nodeRef={nodeRef}>
      <div ref={ref}>{props.children}</div>
    </Draggable>
  );
});

const FloatingLogger: React.FC<FloatingLoggerProps> = ({ logSelector }) => {
  const [isMinimized, setIsMinimized] = useState(false); // State to control if the logger is minimized
  const reduxState = useSelector(logSelector); // Select the necessary slice of Redux state
  const draggableRef = useRef<HTMLDivElement>(null); // Ref for draggable container
  const { logs, log } = useLog(); // Correctly destructure logs and log from the context

  const [defaultPosition, setDefaultPosition] = useState({ x: 300, y: 300 }); // Default position for the draggable component

  // Effect to handle component mount/unmount logging
  useEffect(() => {
    console.log('FloatingLogger component mounted');
    log('info', 'FloatingLogger mounted'); // Correct usage of the log function

    return () => {
      console.log('FloatingLogger component unmounted');
    };
  }, [log]); // Log function from context is stable due to memoization

  // Effect to update the default position of the draggable logger
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDefaultPosition({ x: 0, y: window.innerHeight - 200 });
    }
  }, []);

  // Function to toggle the minimized state of the logger
  const toggleMinimize = () => setIsMinimized(!isMinimized);

  return (
    <DraggableWrapper
      ref={draggableRef}
      handle=".logger-header"
      defaultPosition={defaultPosition}
    >
      <div className={`floating-logger ${isMinimized ? 'minimized' : ''}`}>
        <div className="logger-header">
          <span>Logger</span>
          <button onClick={toggleMinimize}>
            {isMinimized ? 'Maximize' : 'Minimize'}
          </button>
        </div>
        {!isMinimized && (
          <div className="logger-content">
            <div className="logs">
              {logs.map((log, index) => (
                <div key={index} className={`log-entry ${log.level}`}>
                  <span>[{log.timestamp.toLocaleTimeString()}]</span> {log.message}
                </div>
              ))}
            </div>
            <div className="redux-state">
              <h4>Redux State</h4>
              <pre>{JSON.stringify(reduxState, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </DraggableWrapper>
  );
};

export default FloatingLogger;