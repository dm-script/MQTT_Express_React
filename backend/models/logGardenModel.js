import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const logGarden = db.define('log_garden', {
    tanggal_waktu: {
        type: DataTypes.DATE,
        allowNull: false
    },
    temperature: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    humidity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true,
    createdAt: false,
    updatedAt: false
});

export default logGarden;

const syncLogGarden = async () => {
    try {
        await db.sync();
    } catch (error) {
        console.error('Error create:', error);
    }
};

syncLogGarden();