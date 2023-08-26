import { logEvents } from "./logger.js";

export const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
    console.log(`${err.stack}`);

    // checking if already have a status code assign to the response
    const status = res.statusCode ? res.statusCode : 500; //serverError
    res.status(status);
    res.json({ message: err.message });
    next();// did he forget to do next
}