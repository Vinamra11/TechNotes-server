import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    count: { type: Number },
    _id: { type: String }
}, { _id: false });

const Counter = mongoose.model('Counter', counterSchema);

export default Counter;