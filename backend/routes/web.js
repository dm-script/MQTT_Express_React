import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(express.static(path.join(__dirname, '../resources')));

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../resources', 'index.html'));
});

export default router;