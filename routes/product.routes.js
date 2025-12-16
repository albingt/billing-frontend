import { Router } from "express";
import { addProduct, deleteProduct, getProducts, searchProducts, updateProduct } from "../controllers/product.controller.js";
import { isAdmin, verifyToken } from "../middleware/authHandler.js";
import { productProfitReport } from "../controllers/bill.controller.js";

const productRouter = Router();

productRouter.use(verifyToken);
productRouter.post('/', isAdmin, addProduct);
productRouter.get("/", getProducts);
productRouter.get("/search", searchProducts);
productRouter.get("/report", isAdmin, productProfitReport);
productRouter.put("/:id", isAdmin, updateProduct);
productRouter.delete("/:id", isAdmin, deleteProduct);

export default productRouter;