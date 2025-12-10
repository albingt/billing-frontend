import dotenv from 'dotenv';
dotenv.config();

export const config = {
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        db_name: process.env.DB_NAME,
        db_host: process.env.DB_HOST
    },
    port: process.env.PORT,
    expiry: process.env.EXPIRY,
    secret_key: process.env.SECRET_KEY
};