import User from "./user.model.js";
import Product from "./product.model.js";
import Sale from "./sale.model.js";
import SaleItem from "./saleItem.model.js";

const init_models = async () => {

    // SALE ↔ SALEITEM
    Sale.hasMany(SaleItem, {
        foreignKey: "sale_id",
        as: "items"
    });

    SaleItem.belongsTo(Sale, {
        foreignKey: "sale_id",
    });

    // PRODUCT ↔ SALEITEM
    Product.hasMany(SaleItem, {
        foreignKey: "product_id",
        as: "saleItems"
    });

    SaleItem.belongsTo(Product, {
        foreignKey: "product_id",
    });
};

export default init_models;