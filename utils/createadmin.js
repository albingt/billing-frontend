import User from "../models/user.model.js"
import { hashPassword } from "./bcrypt.js";

const createadmin = async () => {
    try {
        const admin = await User.findOne({ where: { name: 'admin' } });

        if (!admin) {
            const hashed = await hashPassword('admin123')
            await User.create({
                name: 'admin',
                password: hashed,
                role: 'admin'
            });
            console.log('admin user created');
            return;
        }

        console.log('admin already exists');
    } catch (error) {
        console.log('Error while creating admin!');
        console.log(error);
    }
};

export default createadmin;