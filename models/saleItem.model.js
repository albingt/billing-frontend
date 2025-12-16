import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const SaleItem = sequelize.define("SaleItem", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    sale_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

export default SaleItem;