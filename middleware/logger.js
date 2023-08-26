import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs, { promises as fsPromises } from 'fs';
import path from 'path';

import { fileDirName } from '../utils.js';
import allowedOrigins from '../config/allowedOrigins.js';

export const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        const { __dirname, __filename } = fileDirName(import.meta);
        //checking ig log folder doesn't exists
        const logsDir = path.join(__dirname, '..', 'logs')
        if (!fs.existsSync(logsDir)) {
            //making one
            await fsPromises.mkdir(logsDir)
        }
        // appending log to log flie // TODO : find a better ways to path
        await fsPromises.appendFile(path.join(logsDir, logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
};

export const logger = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin !== undefined && allowedOrigins.indexOf(origin) === -1) { // Requests not from allowed sources but not undefined sources eg. Localhost , Postman // For production //maybe loging similar things to errLogs
        logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'UnauthReqLog.log');
        console.log(`${req.method}\t${req.path}`);
    } else if ((process.env.ENVIRONMENT === "dev") || (origin === undefined || allowedOrigins.indexOf(origin) !== -1)) { // Requests from allowed sources or undefined sources eg. Localhost , Postman or dev Environment
        logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'devReqLog.log');
        console.log(`${req.method}\t${req.path}`);
    }
    next();
};