import express from 'express';
import userRouter from './user.route.js';
import productRouter from './product.routes.js';
import saleRouter from './sale.routes.js';
import voucherRouter from './voucher.router.js';
import invoiceRouter from './invoice.routes.js';

const router = express.Router();

router.get('/health',(req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server up and running'
    })
});

router.use('/user', userRouter);
router.use('/product', productRouter);
router.use('/bill', saleRouter);
router.use('/voucher', voucherRouter);
router.use('/invoice', invoiceRouter);

export default router;