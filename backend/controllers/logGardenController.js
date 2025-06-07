import { response } from "express";
import { DateTime } from "luxon";
import logGarden from "../models/logGardenModel.js";

export const getDataLogGarden = async (req, res) => {
    try {
        const response = await logGarden.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
};

export const logingGardenData = async (req, res) => {
    try {
        const jakartaTime = DateTime.now().setZone("Asia/Jakarta");
        const current_dateTime = jakartaTime.toFormat("yyyy-MM-dd HH:mm:ss");
        const { temp, hum } = req.body;
        await logGarden.create({
            tanggal_waktu: current_dateTime,
            temperature: temp,
            humidity: hum
        });
        console.log(current_dateTime);
        res.status(201).send('Data MySQL Recorded');
    } catch (error) {
        console.log(error.message);
    }
};