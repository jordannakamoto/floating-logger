import './FloatingLogger.css';
import React from 'react';
interface FloatingLoggerProps {
    logSelector: (state: any) => any;
}
declare const FloatingLogger: React.FC<FloatingLoggerProps>;
export default FloatingLogger;
