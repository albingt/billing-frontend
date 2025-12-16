import { Router } from "express";
import { isAdmin, verifyToken } from "../middleware/authHandler.js";
import { createVoucher, deleteVoucher, getAllVouchers } from "../controllers/voucher.controller.js";

const voucherRouter = Router();

voucherRouter.use(verifyToken);

voucherRouter.post('/', isAdmin, createVoucher);
voucherRouter.get('/', getAllVouchers);
voucherRouter.delete('/:id', isAdmin, deleteVoucher);

export default voucherRouter;