import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL);
    } catch (err) {
        console.log(err);
    }
};

export default connectDB;