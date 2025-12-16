import { Op } from "sequelize";
import Voucher from "../models/voucher.model.js";

export const createVoucher = async (req, res, next) => {
    try {
        const { name, discount_percentage } = req.body;

        if (!name || !discount_percentage) {
            throw { statusCode: 401, message: "name and discount percentage required!" };
        }

        const newVoucher = Voucher.create({
            name,
            discount_percentage
        });

        res.status(201).json({
            success: true,
            message: "New voucher created!"
        })
    } catch (error) {
        next(error);
    }
};

export const getAllVouchers = async (req, res, next) => {
    try {
        const { searchquery, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (searchquery) where.name = { [Op.like]: `%${searchquery}%` };

        const { rows, count } = await Voucher.findAndCountAll({
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

export const deleteVoucher = async (req, res, next) => {
    try {
        const { id } = req.params;

        const voucher = await Voucher.findByPk(id);
        if (!voucher) throw { statusCode: 404, message: "Voucher not found" };

        await voucher.destroy();

        res.status(200).json({
            success: true,
            message: "Voucher deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};