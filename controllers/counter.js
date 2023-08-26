import mongoose from "mongoose";

import Counter from '../models/Counter.js';
//shift the counter functionality inside notes controller then it will work

export const getCounter = async () => {
    try {
        const counter = await Counter.findById("1").lean().exec();
        return counter.count;
    } catch (error) {
        console.log(error);
    }
};


export const initCounter = async (init_value = 0) => {
    try {
        const count = init_value;
        const counterObject = { count, "_id": "1" };
        const counter = await Counter.create(counterObject);
        return counter.count;
    } catch (error) {
        console.log(error);
    }
};

export const incCounter = async (inc_val = 1) => {
    try {
        const counter = await Counter.findById("1").exec();
        counter.count += inc_val;
        const updatedCounter = counter.save();
        // return counter.count;
    } catch (error) {
        console.log(error);
    }
};

// export const decCounter = async (dec_val = 1) => {
//     try {
//         const counter = await Counter.findById("1").exec();
//         counter.count -= dec_val;
//         const updatedCounter = counter.save();
//         // return counter.count;
//     } catch (error) {
//         console.log(error);
//     }
// };


// export const deleteCounter = async () => {
//     try {
//         const counter = await Counter.findById("1").exec();
//         const result = await counter.deleteOne();
//         return result;
//     } catch (error) {
//         console.log(error);
//     }
// };
