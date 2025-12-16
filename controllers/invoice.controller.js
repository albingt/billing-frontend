import { Op } from "sequelize";
import Sale from "../models/sale.model.js";
import SaleItem from "../models/saleItem.model.js";

export const allInvoices = async (req, res, next) => {
    try {
        const { searchquery, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (searchquery) {
            where[Op.or] = [
                { invoice_number: { [Op.like]: `%${searchquery}%` } },
                { customer_name: { [Op.like]: `%${searchquery}%` } },
            ];
        }

        const { rows, count } = await Sale.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            attributes: { exclude: ["createdAt", "updatedAt"] }
        });

        res.status(200).json({
            success: true,
            total: count,
            page: Number(page),
            pages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        next(error)
    }
};

export const invoiceDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const invoice = await Sale.findByPk(id, {
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: SaleItem,
                    as: "items",
                    attributes: { exclude: ["createdAt", "updatedAt", "sale_id"] }
                }
            ]
        });

        if (!invoice) {
            throw { statusCode: 404, message: "Invoice not found!" };
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error)
    }
}