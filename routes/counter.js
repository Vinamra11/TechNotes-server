import express from "express";

import { getCounter, initCounter, incCounter, decCounter, deleteCounter } from '../controllers/counterApi.js'

const router = express.Router();

router.route('/')
    .get(getCounter)
    .post(initCounter)
    .patch(incCounter)
    .put(decCounter)
    .delete(deleteCounter);

export default router;