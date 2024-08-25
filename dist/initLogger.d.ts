export type LogFunctionType = (levelOrMessage: 'info' | 'warn' | 'error' | 'debug' | string, message?: string) => void;
export declare let externalAddLog: LogFunctionType;
export declare const setLogFunction: (fn: LogFunctionType) => void;
export declare const addLog: LogFunctionType;
export declare const configureLogger: (aliasName: string) => void;
declare global {
    var addLog: LogFunctionType;
    var addInfoLog: (message: string) => void;
}
