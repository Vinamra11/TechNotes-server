import express from "express";
import path from "path";
import { fileDirName } from '../utils.js';

const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
    const { __dirname, __filename } = fileDirName(import.meta);
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
});

export default router;