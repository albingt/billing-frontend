import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Sale = sequelize.define("Sale", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
});

export default Sale;