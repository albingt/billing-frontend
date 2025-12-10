import express from 'express';
import userRouter from './user.route.js';
import productRouter from './product.routes.js';

const router = express.Router();

router.get('/health',(req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server up and running'
    })
});

router.use('/user', userRouter);
router.use('/product', productRouter);

export default router;