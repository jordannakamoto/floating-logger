import './FloatingLogger.css';

import { DraggableData, DraggableEvent } from 'react-draggable'; // Import necessary types
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

  // Extract position and children from props to apply them correctly
  const { children, position, ...rest } = props;

  return (
    <Draggable {...rest} nodeRef={nodeRef} position={position}>
      <div ref={ref}>{children}</div>
    </Draggable>
  );
});

const FloatingLogger: React.FC<FloatingLoggerProps> = ({ logSelector }) => {
  // Add a hydration flag to ensure the component only renders on the client
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Set the flag to true on client-side
  }, []);

  // Handle Component minimization
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('isMinimized') || 'false');
    }
    return false; // Default value for SSR
  });

  // SETTINGS //
  const [showSettings, setShowSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('showSettings') || 'false');
    }
    return false; // Default value for SSR
  });

  const [showTimestamp, setShowTimestamp] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('showTimestamp') || 'true');
    }
    return true; // Default value for SSR
  });

  // END SETTINGS //
  
  // Ref to track the last log to set the scroll view of the logs container
  const { logs, log } = useLog(); // Get logs from useLog Context

  // Auto scrolling the logs area when a new one is added
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);


  const reduxState = useSelector(logSelector); // Select the necessary slice of Redux state
  const draggableRef = useRef<HTMLDivElement>(null); // Ref for draggable container

  const [defaultPosition, setDefaultPosition] = useState<{ x: number; y: number } | null>(
    () => {
      if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('loggerPosition') || 'null');
      }
      return null; // Default value for SSR
    }
  );

  // Effect to handle component mount/unmount logging
  useEffect(() => {
    if (hasMounted) { // Only log on client side
      // console.log('FloatingLogger component mounted');
      log('info', 'FloatingLogger mounted');
    }

    return () => {
      // console.log('FloatingLogger component unmounted');
    };
  }, [log, hasMounted]); // Log function from context is stable due to memoization

  // Effect to set initial position and update on resize
  useEffect(() => {
    if (!hasMounted) return; // Only run on client

    const updatePosition = () => {
      if (typeof window !== 'undefined') {
        const newPosition = {
          x: -(window.innerWidth - 400), // Align to the left edge
          y: window.innerHeight // Calculate the bottom position considering logger height
        };
        setDefaultPosition(newPosition);
        localStorage.setItem('loggerPosition', JSON.stringify(newPosition)); // Save position to localStorage
      }
    };

    // If position isn't already set from localStorage, initialize it
    if (!defaultPosition) {
      updatePosition();
    }

    // Update position on window resize
    window.addEventListener('resize', updatePosition);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [defaultPosition, hasMounted]); // Re-run if defaultPosition changes

  // Function to toggle the minimized state of the logger
  const toggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isMinimized', JSON.stringify(newMinimizedState)); // Save state to localStorage
    }
  };

  const toggleSettings = () => {
    const newSettingsState = !showSettings;
    setShowSettings(newSettingsState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('showSettings', JSON.stringify(newSettingsState)); // Save state to localStorage
    }
  };

  const toggleTimestamp = () => {
    const newTimestampState = !showTimestamp;
    setShowTimestamp(newTimestampState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('showTimestamp', JSON.stringify(newTimestampState)); // Save state to localStorage
    }
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    const newPosition = { x: data.x, y: data.y };
    setDefaultPosition(newPosition);
    if (typeof window !== 'undefined') {
      localStorage.setItem('loggerPosition', JSON.stringify(newPosition)); // Save position to localStorage
    }
  };

  // **Ensure component only renders on the client**
  if (!hasMounted || !defaultPosition) {
    return null; // Render nothing until the component has mounted and position is set
  }

  return (
    <DraggableWrapper
      ref={draggableRef}
      handle=".logger-header"
      defaultPosition={defaultPosition} // Dynamically setting position based on state
      onStop={handleDragStop} // Save position when drag stops
    >
      <div className={`floating-logger ${isMinimized ? 'minimized' : ''}`}>
        <div className="logger-header">
          <span>Logger</span>
          <button onClick={toggleMinimize}>
            {isMinimized ? 'Maximize' : 'Minimize'}
          </button>
          <button onClick={toggleSettings}>
            {showSettings ? 'View Logs' : 'Settings'}
          </button>
        </div>
        {!isMinimized && (
          <div className="logger-content">
            {showSettings ? (
              // Settings View
              <div className="settings">
                <h4>Settings</h4>
                <label>
                  <input 
                    type="checkbox" 
                    checked={showTimestamp} 
                    onChange={toggleTimestamp}
                  />
                  Show Timestamps
                </label>
              </div>
            ) : (
              // Logs View
              <>
                <div className="logs" style={{ height: '200px', overflowY: 'auto' }}>
                {/* Display all log messages */}
                {logs.map((log, index) => (
                  <div key={index} className={`log-entry ${log.level}`}>
                    {showTimestamp && (
                      <span>[{log.timestamp.toLocaleTimeString()}]</span>
                    )}{" "}
                    {log.message}
                  </div>
                ))}
                {/* This ghost div will be used to scroll to the bottom */}
                <div ref={logsEndRef} />
              </div>
                <div className="redux-state">
                  <h4>Redux State</h4>
                  <pre>{JSON.stringify(reduxState, null, 2)}</pre>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </DraggableWrapper>
  );
};

export default FloatingLogger;