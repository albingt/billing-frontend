import { Router } from "express";
import { verifyToken } from "../middleware/authHandler.js";
import { createSale } from "../controllers/bill.controller.js";

const saleRouter = Router();

saleRouter.use(verifyToken);
saleRouter.post('/', createSale);

export default saleRouter;