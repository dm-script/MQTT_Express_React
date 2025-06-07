import { response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const authMQTT = async (req, res) => {
    try {
        const { key } = req.body;

        if (key === process.env.AUTH_KEY) {
            res.json({
                brokerUrl: process.env.MQTT_BROKER_URL,
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD,
                topicControl: process.env.TOPIC_CONTROL,
                topicMonitor: process.env.TOPIC_MONITOR,
            });
        } else {
            res.status(401).json({ "msg": "Invalid key" });
        }
    } catch (error) {
        console.error('Gagal simpan:', error);
        res.status(500).json({ "msg": "Terjadi Kesalahan" });
    }
};