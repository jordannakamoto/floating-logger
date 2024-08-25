import './FloatingLogger.css';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useLog } from './LogContext'; // Import the custom hook from LogProvider
import { useSelector } from 'react-redux';
// Wrapper around the Draggable component to manage dragging and refs
const DraggableWrapper = forwardRef((props, ref) => {
    const nodeRef = ref;
    return (React.createElement(Draggable, Object.assign({}, props, { nodeRef: nodeRef }),
        React.createElement("div", { ref: ref }, props.children)));
});
const FloatingLogger = ({ logSelector }) => {
    const [isMinimized, setIsMinimized] = useState(false); // State to control if the logger is minimized
    const reduxState = useSelector(logSelector); // Select the necessary slice of Redux state
    const draggableRef = useRef(null); // Ref for draggable container
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
    return (React.createElement(DraggableWrapper, { ref: draggableRef, handle: ".logger-header", defaultPosition: defaultPosition },
        React.createElement("div", { className: `floating-logger ${isMinimized ? 'minimized' : ''}` },
            React.createElement("div", { className: "logger-header" },
                React.createElement("span", null, "Logger"),
                React.createElement("button", { onClick: toggleMinimize }, isMinimized ? 'Maximize' : 'Minimize')),
            !isMinimized && (React.createElement("div", { className: "logger-content" },
                React.createElement("div", { className: "logs" }, logs.map((log, index) => (React.createElement("div", { key: index, className: `log-entry ${log.level}` },
                    React.createElement("span", null,
                        "[",
                        log.timestamp.toLocaleTimeString(),
                        "]"),
                    " ",
                    log.message)))),
                React.createElement("div", { className: "redux-state" },
                    React.createElement("h4", null, "Redux State"),
                    React.createElement("pre", null, JSON.stringify(reduxState, null, 2))))))));
};
export default FloatingLogger;
