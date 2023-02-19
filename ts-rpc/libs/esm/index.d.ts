import type { Handler } from "express";
import type { AxiosInstance } from "axios";
export interface HandlerMap extends Record<string, (...args: any[]) => any> {
}
export declare function generateServerHandler(handlerMap: HandlerMap, errorMap?: Record<number, any>): Handler;
export declare function generateClientHandler<T extends (...args: any) => any>(name: string, agent: AxiosInstance): (...args: Parameters<T>) => Promise<ReturnType<T>>;
