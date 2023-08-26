import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
    origin: (origin, callback) => {

        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { //!orgin -> from localhost:3500, postman etc
            callback(null, true);
        } else {
            callback(new Error('not allowed by CORS'));
        }
    },
    credentials: true,
    optionSuccessStatus: 200
};

export default corsOptions;