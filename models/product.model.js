import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    selling_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount_percentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
});

export default Product;