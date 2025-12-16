import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Voucher = sequelize.define("Voucher", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    discount_percentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
});

export default Voucher;