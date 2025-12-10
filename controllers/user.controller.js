import User from "../models/user.model.js";
import { comparePasswords, hashPassword } from "../utils/bcrypt.js";
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { Op } from "sequelize";

export const register = async (req, res, next) => {
    try {
        const { name, password, role } = req.body;

        const existingUser = await User.findOne({ where: { name: name } });

        if (existingUser) throw { statusCode: 401, message: "User already exists!" };

        const hashed = await hashPassword(password);

        const newUser = await User.create({ name, password: hashed, role });

        res.status(201).json({
            success: true,
            message: "User created successfully!",
            data: newUser
        })
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { name, password } = req.body;

        const existingUser = await User.findOne({ where: { name } });

        if (!existingUser) throw { statusCode: 404, message: "User not found!" };

        const isMatch = await comparePasswords(password, existingUser.password);

        if (!isMatch) throw { statusCode: 401, message: "Invalid password!" };

        const token = await jwt.sign({ id: existingUser.id, role: existingUser.role }, config.secret_key, { expiresIn: config.expiry });

        const userDetails = {
            id: existingUser.id,
            name: existingUser.name,
            role: existingUser.role,
            token: token
        };

        res.status(200).json({
            success: true,
            data: userDetails
        })
    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const { searchquery, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (searchquery) where.name = { [Op.like]: `%${searchquery}%` };

        const { rows, count } = await User.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        });

        res.status(200).json({
            success: true,
            total: count,
            page: Number(page),
            pages: Math.ceil(count / limit),
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const user = req.user

        const userData = await User.findByPk(user.id, {
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        });


        res.status(200).json({
            success: true,
            data: userData
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) throw { statusCode: 404, message: "User not found" };

        user.name = name || user.name;
        user.role = role || user.role;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) throw { statusCode: 404, message: "User not found" };

        await user.destroy();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) throw { statusCode: 400, message: "New password required" };

        const user = await User.findByPk(id);
        if (!user) throw { statusCode: 404, message: "User not found" };

        const hashed = await hashPassword(newPassword);

        user.password = hashed;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        next(error);
    }
};
