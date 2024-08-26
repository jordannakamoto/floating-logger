import './FloatingLogger.css';

import { DraggableData, DraggableEvent } from 'react-draggable';
import React, { forwardRef, useEffect, useRef, useState } from 'react';

import Draggable from 'react-draggable';
import { useLog } from './LogContext';
import { useSelector } from 'react-redux';

// Define the props expected by the FloatingLogger component
interface FloatingLoggerProps {
  logSelector: (state: any) => any; 
}

// Wrapper around the Draggable component to manage dragging and refs
const DraggableWrapper = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Draggable>>((props, ref) => {
  const nodeRef = ref as React.RefObject<HTMLDivElement>;
  const { children, position, ...rest } = props;

  return (
    <Draggable {...rest} nodeRef={nodeRef} position={position}>
      <div ref={ref}>{children}</div>
    </Draggable>
  );
});

const FloatingLogger: React.FC<FloatingLoggerProps> = ({ logSelector }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('isMinimized') || 'false') : false);
  const [showSettings, setShowSettings] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('showSettings') || 'false') : false);
  const [showTimestamp, setShowTimestamp] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('showTimestamp') || 'true') : true);
  const [isDarkTheme, setIsDarkTheme] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('isDarkTheme') || 'false') : false);

  const { logs, log } = useLog(); 
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  const reduxState = useSelector(logSelector);
  const draggableRef = useRef<HTMLDivElement>(null);
  const [defaultPosition, setDefaultPosition] = useState<{ x: number; y: number } | null>(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('loggerPosition') || 'null') : null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    if (hasMounted) {
      log('info', 'FloatingLogger mounted');
    }
    return () => {};
  }, [log, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;

    const updatePosition = () => {
      if (typeof window !== 'undefined') {
        const newPosition = {
          x: -(window.innerWidth - 400),
          y: window.innerHeight
        };
        setDefaultPosition(newPosition);
        localStorage.setItem('loggerPosition', JSON.stringify(newPosition));
      }
    };

    if (!defaultPosition) {
      updatePosition();
    }

    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [defaultPosition, hasMounted]);

  const toggleMinimize = () => {
    const newMinimizedState = !isMinimized;
    setIsMinimized(newMinimizedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isMinimized', JSON.stringify(newMinimizedState));
    }
  };

  const toggleSettings = () => {
    const newSettingsState = !showSettings;
    setShowSettings(newSettingsState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('showSettings', JSON.stringify(newSettingsState));
    }
  };

  const toggleTimestamp = () => {
    const newTimestampState = !showTimestamp;
    setShowTimestamp(newTimestampState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('showTimestamp', JSON.stringify(newTimestampState));
    }
  };

  const toggleTheme = () => {
    const newThemeState = !isDarkTheme;
    setIsDarkTheme(newThemeState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('isDarkTheme', JSON.stringify(newThemeState));
    }
  };

  const handleDragStop = (e: DraggableEvent, data: DraggableData) => {
    const newPosition = { x: data.x, y: data.y };
    setDefaultPosition(newPosition);
    if (typeof window !== 'undefined') {
      localStorage.setItem('loggerPosition', JSON.stringify(newPosition));
    }
  };

  if (!hasMounted || !defaultPosition) {
    return null;
  }

  return (
    <DraggableWrapper
      ref={draggableRef}
      handle=".logger-header"
      defaultPosition={defaultPosition}
      onStop={handleDragStop}
    >
      <div className={`floating-logger ${isMinimized ? 'minimized' : ''} ${isDarkTheme ? 'dark' : ''}`}>
        <div className="logger-header">
          <span>Logger</span>
          <div className="header-buttons">
            <button onClick={toggleMinimize}>
              {isMinimized ? '⛶' : '−'}
            </button>
            <button onClick={toggleSettings}>
            &#9881; {/* Unicode for gear */}
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className="logger-content">
            {showSettings ? (
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
                <label>
                  <input 
                    type="checkbox" 
                    checked={isDarkTheme} 
                    onChange={toggleTheme}
                  />
                  Dark Theme
                </label>
              </div>
            ) : (
              <>
                <div className="logs" style={{ height: '200px', overflowY: 'auto' }}>
                  {logs.map((log, index) => (
                    <div key={index} className={`log-entry ${log.level}`}>
                      {showTimestamp && (
                        <span>[{log.timestamp.toLocaleTimeString()}]</span>
                      )}{" "}
                      {log.message}
                    </div>
                  ))}
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