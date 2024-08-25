import { LogFunctionType } from './initLogger';
import React, { ReactNode } from 'react';
interface LogEntry {
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    timestamp: Date;
}
interface LogContextType {
    logs: LogEntry[];
    log: LogFunctionType;
}
export declare const LogProvider: React.FC<{
    children: ReactNode;
}>;
export declare const useLog: () => LogContextType;
export {};
