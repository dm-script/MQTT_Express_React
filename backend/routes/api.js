import express from "express";
import { logingGardenData } from "../controllers/logGardenController.js";
import { authMQTT } from "../controllers/authMQTTController.js";

const router = express.Router();

router.post('/api/logSens', logingGardenData);
router.post('/api/authKey', authMQTT);

export default router;