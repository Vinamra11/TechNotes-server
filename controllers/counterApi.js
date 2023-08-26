// For manual Reseting of changing the counter

import mongoose from "mongoose";
import asyncHandler from 'express-async-handler';

import Counter from '../models/Counter.js';

const init_value = 500;
const inc_val = 1;
const dec_val = 1;


export const getCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.findById("1").lean().exec();
    res.json(counter);
});


export const initCounter = asyncHandler(async (req, res) => {
    const count = init_value;
    const counterObject = { count, "_id": "1" };
    const counter = await Counter.create(counterObject);
    res.status(201).json(counter);
});

export const incCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.findById("1").exec();
    counter.count += inc_val;
    const updatedCounter = counter.save();
    res.json(counter);
});

export const decCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.findById("1").exec();
    counter.count -= dec_val;
    const updatedCounter = counter.save();
    res.json(counter);
});


export const deleteCounter = asyncHandler(async (req, res) => {
    const counter = await Counter.findById("1").exec();
    const result = await counter.deleteOne();;
    res.json(result);
});
