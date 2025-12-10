import { col, fn, literal, Op } from "sequelize";
import Product from "../models/product.model.js";
import SaleItem from "../models/saleItem.model.js";

export const addProduct = async (req, res, next) => {
    try {
        const { name, sku_code, selling_price, cost_price, discount_percentage, quantity } = req.body;

        const existingProduct = await Product.findOne({ where: { sku_code: sku_code } });

        if (existingProduct) throw { statusCode: 401, message: "Product with same id already exists!" };

        const newProduct = await Product.create({
            name, sku_code, selling_price, cost_price, discount_percentage, quantity
        });

        res.status(200).json({
            success: true,
            data: newProduct
        });
    } catch (error) {
        next(error);
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchquery } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (searchquery) {
            where[Op.or] = [
                { name: { [Op.like]: `%${searchquery}%` } },
                { sku_code: { [Op.like]: `%${searchquery}%` } },
            ];
        }

        const { rows, count } = await Product.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            total: count,
            page: Number(page),
            pages: Math.ceil(count / limit),
            data: rows,
        });
    } catch (error) {
        next(error);
    }
};

export const searchProducts = async (req, res, next) => {
    try {
        const { searchquery } = req.query;

        const where = {};

        if (searchquery) {
            where[Op.or] = [
                { name: { [Op.like]: `%${searchquery}%` } },
                { sku_code: { [Op.like]: `%${searchquery}%` } },
            ];
        }

        const products = await Product.findAll({
            where,
            limit: 5,
            order: [["name", "ASC"]],
        });

        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error)
    }
}

export const productProfitReport = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, searchquery } = req.query;

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        const where = {};

        if (searchquery) {
            where[Op.or] = [
                { name: { [Op.like]: `%${searchquery}%` } },
                { sku_code: { [Op.like]: `%${searchquery}%` } },
            ];
        }

        const result = await Product.findAll({
            where,
            attributes: [
                "id",
                "name",
                "sku_code",
                "selling_price",
                "cost_price",
                [fn("SUM", col("saleItems.quantity")), "total_sold"],
                [
                    fn(
                        "SUM",
                        literal(`"saleItems"."quantity" * "Product"."selling_price"`)
                    ),
                    "total_revenue",
                ],
                [
                    fn(
                        "SUM",
                        literal(`"saleItems"."quantity" * "Product"."cost_price"`)
                    ),
                    "total_cost",
                ],
                [
                    literal(`
                        SUM("saleItems"."quantity" * "Product"."selling_price") -
                        SUM("saleItems"."quantity" * "Product"."cost_price")
                    `),
                    "profit",
                ],
            ],
            include: [
                {
                    model: SaleItem,
                    attributes: [],
                    as: "saleItems",
                    required: false,
                },
            ],
            group: ["Product.id"],
            subQuery: false,
            limit: limitNumber,
            offset,
            raw: true,
        });

        res.status(200).json({
            success: true,
            total: result.length,
            page: pageNumber,
            limit: limitNumber,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, sku_code, selling_price, cost_price, discount_percentage, quantity } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            throw { statusCode: 404, message: "Product not found!" };
        }

        product.name = name || product.name;
        product.sku_code = sku_code || product.sku_code;
        product.selling_price = selling_price || product.selling_price;
        product.cost_price = cost_price || product.cost_price;
        product.discount_percentage =
            discount_percentage !== undefined
                ? discount_percentage
                : product.discount_percentage;
        product.quantity = quantity || product.quantity;

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            throw { statusCode: 404, message: "Product not found!" };
        }

        await product.destroy();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully!",
        });
    } catch (error) {
        next(error);
    }
};