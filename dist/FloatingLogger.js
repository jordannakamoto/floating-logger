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
import { useLog } from './LogContext';
import { useSelector } from 'react-redux';
// Wrapper around the Draggable component to manage dragging and refs
const DraggableWrapper = forwardRef((props, ref) => {
    const nodeRef = ref;
    const { children, position } = props, rest = __rest(props, ["children", "position"]);
    return (React.createElement(Draggable, Object.assign({}, rest, { nodeRef: nodeRef, position: position }),
        React.createElement("div", { ref: ref }, children)));
});
const FloatingLogger = ({ logSelector }) => {
    const [hasMounted, setHasMounted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('isMinimized') || 'false') : false);
    const [showSettings, setShowSettings] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('showSettings') || 'false') : false);
    const [showTimestamp, setShowTimestamp] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('showTimestamp') || 'true') : true);
    const [isDarkTheme, setIsDarkTheme] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('isDarkTheme') || 'false') : false);
    const { logs, log } = useLog();
    const logsEndRef = useRef(null);
    const reduxState = useSelector(logSelector);
    const draggableRef = useRef(null);
    const [defaultPosition, setDefaultPosition] = useState(() => typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('loggerPosition') || 'null') : null);
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
        return () => { };
    }, [log, hasMounted]);
    useEffect(() => {
        if (!hasMounted)
            return;
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
    const handleDragStop = (e, data) => {
        const newPosition = { x: data.x, y: data.y };
        setDefaultPosition(newPosition);
        if (typeof window !== 'undefined') {
            localStorage.setItem('loggerPosition', JSON.stringify(newPosition));
        }
    };
    if (!hasMounted || !defaultPosition) {
        return null;
    }
    return (React.createElement(DraggableWrapper, { ref: draggableRef, handle: ".logger-header", defaultPosition: defaultPosition, onStop: handleDragStop },
        React.createElement("div", { className: `floating-logger ${isMinimized ? 'minimized' : ''} ${isDarkTheme ? 'dark' : ''}` },
            React.createElement("div", { className: "logger-header" },
                React.createElement("span", null, "Logger"),
                React.createElement("div", { className: "header-buttons" },
                    React.createElement("button", { onClick: toggleMinimize }, isMinimized ? '⛶' : '−'),
                    React.createElement("button", { onClick: toggleSettings }, "\u2699 "))),
            !isMinimized && (React.createElement("div", { className: "logger-content" }, showSettings ? (React.createElement("div", { className: "settings" },
                React.createElement("h4", null, "Settings"),
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", checked: showTimestamp, onChange: toggleTimestamp }),
                    "Show Timestamps"),
                React.createElement("label", null,
                    React.createElement("input", { type: "checkbox", checked: isDarkTheme, onChange: toggleTheme }),
                    "Dark Theme"))) : (React.createElement(React.Fragment, null,
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
