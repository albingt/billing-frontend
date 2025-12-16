import { col, fn, literal, Op } from 'sequelize';
import sequelize from '../config/db.js';
import Sale from '../models/sale.model.js';
import SaleItem from '../models/saleItem.model.js';
import Product from '../models/product.model.js';

export const createSale = async (req, res, next) => {
    const { customer_name, items } = req.body;

    if (!items || items.length === 0) {
        throw { statusCode: 400, message: "No items provided!" };
    }

    try {
        const result = await sequelize.transaction(async (t) => {
            const sale = await Sale.create({
                invoice_number: 'TEMP',
                customer_name: customer_name || null,
                total_amount: 0
            }, { transaction: t });

            const invoice_number = `INV-${String(sale.id).padStart(6, '0')}`;
            await sale.update({ invoice_number }, { transaction: t });

            let total_amount = 0;

            for (const item of items) {
                const product = await Product.findByPk(item.product_id, { transaction: t });

                if (!product) {
                    throw { statusCode: 404, message: "Product not found!" }
                }

                if (product.quantity < item.quantity) {
                    throw { statusCode: 401, message: "Insufficient stock for product: ${product.name}" };
                }

                const effective_selling_price = product.selling_price;
                const effective_discount = product.discount_percentage;
                const item_total = effective_selling_price * item.quantity * (1 - effective_discount / 100);
                total_amount += item_total;

                await SaleItem.create({
                    sale_id: sale.id,
                    product_id: product.id,
                    product_name: product.name,
                    selling_price: effective_selling_price,
                    cost_price: product.cost_price,
                    quantity: item.quantity
                }, { transaction: t });

                await product.update({
                    quantity: product.quantity - item.quantity
                }, { transaction: t });
            }

            await sale.update({ total_amount }, { transaction: t });

            return { sale, invoice_number };
        });

        res.status(201).json({
            success: true,
            data: result.invoice_number,
            message: 'Sale created successfully'
        });
    } catch (error) {
        next(error)
    }
};

export const productProfitReport = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchquery, sort } = req.query;

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        const where = {};
        if (searchquery) {
            where.product_name = { [Op.like]: `%${searchquery}%` };
        }

        const result = await SaleItem.findAll({
            attributes: [
                'product_id',
                'product_name',
                [fn('SUM', col('quantity')), 'total_sold'],
                [fn('SUM', literal('selling_price * quantity')), 'revenue'],
                [fn('SUM', literal('cost_price * quantity')), 'cost'],
                [fn('SUM', literal('(selling_price - cost_price) * quantity')), 'profit'],
                [fn('AVG', col('selling_price')), 'selling_price'],
                [fn('AVG', col('cost_price')), 'cost_price'],
            ],
            where,
            group: ['product_id', 'product_name'],
            order: [['product_name', 'ASC']],
            limit: limitNumber,
            offset,
            raw: true
        });

        const total = await SaleItem.findAll({
            attributes: ['product_id'],
            where,
            group: ['product_id'],
            raw: true
        });

        res.status(200).json({
            success: true,
            total: total.length,
            page: pageNumber,
            limit: limitNumber,
            data: result
        });
    } catch (error) {
        next(error);
    }
};