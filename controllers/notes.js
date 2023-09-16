import mongoose from "mongoose";
import asyncHandler from 'express-async-handler';

import User from '../models/User.js';
import Note from '../models/Note.js';

import { getCounter, initCounter, incCounter } from './counter.js';

// @desc GET all notes
// @route GET /note
// @access Private
export const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    if (!notes.length) {
        return res.status(404).json({ message: "No Notes found." });
    }

    // Add username to each note before sending the response    
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.userId).lean().exec();
        return { ...note, username: user.username };
    }));

    res.json(notesWithUser)
});

// @desc Create a note
// @route POST /note
// @access Private
export const createNewNote = asyncHandler(async (req, res) => {
    const { userId, title, text } = req.body;

    // console.log(req.body)

    //confirm data // can create a post without a title
    if (!userId || !text || !title) {
        return res.status(400).json({ message: "All fields are Required" });
    }

    // Check for duplicate title 
    const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    //confirming user
    const existingUser = await User.findById(userId).exec();
    if (!existingUser) {
        return res.status(404).json({ message: "User not found." });
    }

    //counter
    let count = await getCounter();
    let ticket_num;
    if (!count) {
        count = await initCounter(500);//init_val =500 for this project
    }
    ticket_num = count;

    // Creating Note
    const noteObject = { userId, text, title, ticket_num };
    const note = await Note.create(noteObject);

    if (note) {
        await incCounter(); // only increment counter if a note is created
        res.status(201).json({ message: `New Note ${note._id} by ${existingUser.username} created` });
    } else {
        res.status(400).json({ message: "Invalid note data recived" })
    }
});


// @desc Update a note
// @route PATCH /note
// @access Private
export const updateNote = asyncHandler(async (req, res) => {
    //FORFUTURE : can we change a notes ownership, or the ticket_number
    //TODO: get id from params 
    const { id, text, title, completed } = req.body;
    console.log(req.body)
    //confirm data
    if (!id) {
        return res.status(400).json({ message: "ID is required." });
    }

    if (!(text || typeof completed !== 'undefined' || title)) {
        return res.status(400).json({ message: "A field is Required for Update." });
    }

    //Finding Exesting Note
    const existingNote = await Note.findById(id).exec();
    if (!existingNote) {
        res.status(404).json({ message: "No note found," });
    }

    //updating note
    if (text) {
        existingNote.text = text;
    }

    if (title) {
        // Check for duplicate title
        const duplicate = await Note.findOne({ title }).collation({ locale: 'en', strength: 2 }).lean().exec()

        // Allow renaming of the original note 
        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: 'Duplicate note title' })
        }
        existingNote.title = title;
    }

    if (typeof completed !== 'undefined') {
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ message: "Completed Should be Boolean" });
        }
        existingNote.completed = completed;
    }

    const updatedNote = existingNote.save();

    res.json({ message: `note ${updatedNote.title || existingNote.title} updated.` });
});

// @desc Delete a note
// @route DELETE /note
// @access Private
export const deleteNote = asyncHandler(async (req, res) => {
    //FORFUTURE : can we delete a incomplete Note, yes we can
    //TODO: get id from params
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "ID is required." });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(404).json({ message: 'Note not found.' });
    }

    const result = await note.deleteOne();
    const message = `Note ${result.title} with ID ${result._id} deleted`;
    res.json({ message })
});
