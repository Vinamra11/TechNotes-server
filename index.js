import express from 'express';
import path from "path";
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { fileDirName } from './utils.js';
import { logger, logEvents } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import corsOptions from './config/corsOptions.js';
import connectDB from './config/dbConn.js';

import rootRoutes from './routes/root.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import noteRoutes from './routes/notes.js';
import counterRoutes from './routes/counter.js';

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3500;
connectDB();

//logger
app.use(logger);

// app.use(bodyParser.json({ limit: "30mb", extended: true })); // app.use(express.json()); // can also be used // use express.json ref "https://deepajarout.medium.com/bodyparser-json-vs-express-json-express-urlencoded-vs-express-json-b12a89f90331"
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
// app.use(express.urlencoded({  extended: true })); // use for extended urlencoded
app.use(cookieParser());

app.use(cors(corsOptions));

const { __dirname, __filename } = fileDirName(import.meta);
//Defining path for static files like html css
app.use('/', express.static(path.join(__dirname, 'public'))); // app.use(express.static('public')); //"This willl work to as its relative to the path from index.js"

// Routes
app.use('/', rootRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);
app.use('/counter', counterRoutes);// use for manual reseting or changing counter //should not be there for production 


// handling 404
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
});

// errorHandler and Logger
app.use(errorHandler);

// Listening for request once mongoConnection is made
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
});

// Listening for mongo Errors
mongoose.connection.on('error', (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});