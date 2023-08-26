import mongoose from "mongoose";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';

import User from '../models/User.js';
import Note from '../models/Note.js';

// @desc GET all users
// @route GET /user
// @access Private
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found.' });
    }
    res.json(users);
});

// @desc Create new user
// @route POST /user
// @access Private
export const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    //Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required." });
    }
    // Duplicate check
    const existingUser = await User.findOne({ username }).lean().exec();
    if (existingUser) {
        return res.status(409).json({ message: "Duplicate user." });
    }
    //hash Password
    const hashedPassword = await bcrypt.hash(password, 12); //Salt

    const userObject = { username, roles, "password": hashedPassword };
    const user = await User.create(userObject);

    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: "Invalid user data recived" })
    }

});

// @desc Update a user
// @route PATCH /user
// @access Private
export const updateUser = asyncHandler(async (req, res) => {
    const { username, password, roles, id, active } = req.body;

    //Confirm data// TODO(DONE): change to allow single field change like password
    if (!id) {
        return res.status(400).json({ message: "ID is required." });
    }

    if (!(username || roles || typeof active !== 'undefined' || password)) {
        return res.status(400).json({ message: "A field is Required for Update." });
    }

    // Finding Exesting user
    const existingUser = await User.findById(id).exec();
    if (!existingUser) {
        return res.status(404).json({ message: "User not found." });
    }

    //Changing Username
    if (username) {
        // Duplicate check
        const duplicate = await User.findOne({ username }).lean().exec();
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: "Duplicate username." });
        }
        existingUser.username = username;
    }

    //changing roles
    if (roles) {
        if (!Array.isArray(roles) || !roles.length) {
            return res.status(400).json({ message: "Roles Require Array with roles." });
        }
        existingUser.roles = roles;
    }

    // changing active
    if (typeof active !== 'undefined') {
        if (typeof active !== 'boolean') {
            return res.status(400).json({ message: "Active Should be Boolean" });
        }
        existingUser.active = active;
    }

    // changing password
    if (password) {
        existingUser.password = await bcrypt.hash(password, 12); //Salt
    }

    //updating user
    const updatedUser = existingUser.save();

    res.json({ message: `${updatedUser.username || existingUser.username} updated.` });
});

// @desc Delete a user
// @route DELETE /user 
// @access Private
export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // confirm data
    if (!id) {
        return res.status(400).json({ message: "User ID required." });
    }

    // cannot delete a user with notes
    const note = await Note.findOne({ userId: id }).lean().exec();
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes.' });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    const result = await user.deleteOne();
    const message = `Username ${result.username} with ID ${result._id} deleted`;
    res.json({ message })
});