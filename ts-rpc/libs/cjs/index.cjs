'use strict';

const defaultErrorMap = {
    400: { result: undefined, error: "Invalid rpc request." },
    500: {
        result: undefined,
        error: "Thrown object has unsupported type 'Error', please check your handler.",
    },
};
function verifyRequest(body) {
    if (!body || typeof body !== "object")
        return false;
    if (typeof body.method !== "string")
        return false;
    if (!Array.isArray(body.params) && typeof body.params !== "undefined")
        return false;
    return true;
}
function generateServerHandler(handlerMap, errorMap = defaultErrorMap) {
    const middleware = async function (req, res, next) {
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
        const callData = req.body;
        const handler = handlerMap[callData.method];
        let result, error;
        try {
            result = await handler?.(...(callData.params ?? []));
        }
        catch (err) {
            error = err;
            if (err instanceof Error) {
                // 系统抛出的Error对象具有stacktrace，不能直接返回给客户端
                // logger.error(err);
                res.json(errorMap[500] || defaultErrorMap[500]).end();
                return;
            }
        }
        res.json({ result, error }).end();
    };
    return middleware;
}
function generateClientHandler(name, agent) {
    return async (...args) => {
        const res = await agent.post("/", { method: name, params: args });
        if (res.data.error)
            throw res.data.error;
        return res.data.result;
    };
}

exports.generateClientHandler = generateClientHandler;
exports.generateServerHandler = generateServerHandler;
