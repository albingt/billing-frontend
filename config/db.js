import { Sequelize } from 'sequelize';
import { config } from './index.js';

const sequelize = new Sequelize(
    config.db.db_name,
    config.db.user,
    config.db.password,
    {
        host: config.db.db_host,
        dialect: 'postgres',
        logging: false
    }
);

const init_db = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }

    return sequelize;
}

init_db();

export default sequelize;