import { Router } from "express";
import { isAdmin, verifyToken } from "../middleware/authHandler.js";
import { allInvoices, invoiceDetails } from "../controllers/invoice.controller.js";

const invoiceRouter = Router();

invoiceRouter.use(verifyToken);
invoiceRouter.use(isAdmin);

invoiceRouter.get('/', allInvoices);
invoiceRouter.get('/:id', invoiceDetails);

export default invoiceRouter;