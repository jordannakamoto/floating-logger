export type LogFunctionType = (levelOrMessage: 'info' | 'warn' | 'error' | 'debug' | 'api' | string, message?: string) => void;
export declare const addLog: LogFunctionType;
declare global {
    var addLog: LogFunctionType;
}
export declare const configureServerLogger: (aliasName: string) => void;
declare global {
    var configureServerLogger: (aliasName: string) => void;
}
