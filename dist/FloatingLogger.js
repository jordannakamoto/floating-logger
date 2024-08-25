var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import './FloatingLogger.css';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useLog } from './LogContext'; // Import the custom hook from LogProvider
import { useSelector } from 'react-redux';
// Wrapper around the Draggable component to manage dragging and refs
const DraggableWrapper = forwardRef((props, ref) => {
    const nodeRef = ref;
    // Extract position and children from props to apply them correctly
    const { children, position } = props, rest = __rest(props, ["children", "position"]);
    return (React.createElement(Draggable, Object.assign({}, rest, { nodeRef: nodeRef, position: position }),
        React.createElement("div", { ref: ref }, children)));
});
const FloatingLogger = ({ logSelector }) => {
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
    const logsEndRef = useRef(null);
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);
    const reduxState = useSelector(logSelector); // Select the necessary slice of Redux state
    const draggableRef = useRef(null); // Ref for draggable container
    const [defaultPosition, setDefaultPosition] = useState(() => {
        if (typeof window !== 'undefined') {
            return JSON.parse(localStorage.getItem('loggerPosition') || 'null');
        }
        return null; // Default value for SSR
    });
    // Effect to handle component mount/unmount logging
    useEffect(() => {
        if (hasMounted) { // Only log on client side
            console.log('FloatingLogger component mounted');
            log('info', 'FloatingLogger mounted');
        }
        return () => {
            console.log('FloatingLogger component unmounted');
        };
    }, [log, hasMounted]); // Log function from context is stable due to memoization
    // Effect to set initial position and update on resize
    useEffect(() => {
        if (!hasMounted)
            return; // Only run on client
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
    const handleDragStop = (e, data) => {
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
    return (React.createElement(DraggableWrapper, { ref: draggableRef, handle: ".logger-header", defaultPosition: defaultPosition, onStop: handleDragStop },
        React.createElement("div", { className: `floating-logger ${isMinimized ? 'minimized' : ''}` },
            React.createElement("div", { className: "logger-header" },
                React.createElement("span", null, "Logger"),
                React.createElement("button", { onClick: toggleMinimize }, isMinimized ? 'Maximize' : 'Minimize'),
                React.createElement("button", { onClick: toggleSettings }, showSettings ? 'View Logs' : 'Settings')),
            !isMinimized && (React.createElement("div", { className: "logger-content" }, showSettings ? (
            // Settings View
            React.createElement("div", { className: "settings" },
                React.createElement("h4", null, "Settings"),
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", checked: showTimestamp, onChange: toggleTimestamp }),
                    "Show Timestamps"))) : (
            // Logs View
            React.createElement(React.Fragment, null,
                React.createElement("div", { className: "logs", style: { height: '200px', overflowY: 'auto' } },
                    logs.map((log, index) => (React.createElement("div", { key: index, className: `log-entry ${log.level}` },
                        showTimestamp && (React.createElement("span", null,
                            "[",
                            log.timestamp.toLocaleTimeString(),
                            "]")),
                        " ",
                        log.message))),
                    React.createElement("div", { ref: logsEndRef })),
                React.createElement("div", { className: "redux-state" },
                    React.createElement("h4", null, "Redux State"),
                    React.createElement("pre", null, JSON.stringify(reduxState, null, 2))))))))));
};
export default FloatingLogger;
