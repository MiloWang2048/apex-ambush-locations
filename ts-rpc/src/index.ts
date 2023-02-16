import type { Handler } from "express";
import type { AxiosInstance } from "axios";

export interface HandlerMap extends Record<string, (...args: any[]) => any> {}

const defaultErrorMap = {
  400: { result: undefined, error: "Invalid rpc request." },
  500: {
    result: undefined,
    error:
      "Thrown object has unsupported type 'Error', please check your handler.",
  },
};

function verifyRequest(body: any) {
  if (!body || typeof body !== "object") return false;
  if (typeof body.method !== "string") return false;
  if (!Array.isArray(body.params) && typeof body.params !== "undefined")
    return false;
  return true;
}

interface RpcRequest {
  method: string;
  params?: any[];
}

export function generateServerHandler(
  handlerMap: HandlerMap,
  errorMap: Record<number, any> = defaultErrorMap
) {
  const middleware: Handler = async function (req, res, next) {
    if (req.method !== "POST") {
      next();
      return;
    }

    if (!verifyRequest(req.body)) {
      res
        .status(400)
        .json(errorMap[400] || defaultErrorMap[400])
        .end();
      return;
    }

    const callData = req.body as RpcRequest;
    const handler = handlerMap[callData.method];
    let result, error: any;
    try {
      result = await handler?.(...(callData.params ?? []));
    } catch (err: any) {
      error = err;
      if (err instanceof Error) {
        // 系统抛出的Error对象具有stacktrace，不能直接返回给客户端
        // logger.error(err);
        res.json(errorMap[500] || defaultErrorMap[500]).end();
      }
    }
    res.json({ result, error }).end();
  };
  return middleware;
}

export function generateClientHandler<T extends (...args: any) => any>(
  name: string,
  agent: AxiosInstance
) {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const res = await agent.post("/", { method: name, params: args });
    if (res.data.error) throw res.data.error;
    return res.data.result;
  };
}
