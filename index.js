import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import router from './routes/router.js';
import morgan from 'morgan';
import helmet from 'helmet';
import sequelize from './config/db.js';
import init_models from './models/index.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

app.use('/api', router);

app.use(errorHandler);

const startServer = async () => {
    try {
        await init_models();
        
        await sequelize.sync();

        app.listen(config.port, () => {
            console.log(`server running on port: ${config.port}`);
        });
    } catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
};

startServer();