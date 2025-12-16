import User from "./user.model.js";
import Product from "./product.model.js";
import Sale from "./sale.model.js";
import SaleItem from "./saleItem.model.js";
import Voucher from "./voucher.model.js";

const init_models = async () => {

    // SALE ↔ SALEITEM
    Sale.hasMany(SaleItem, {
        foreignKey: "sale_id",
        as: "items"
    });

    SaleItem.belongsTo(Sale, {
        foreignKey: "sale_id",
    });
};

export default init_models;