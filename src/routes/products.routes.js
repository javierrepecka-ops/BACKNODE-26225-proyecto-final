import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (lectura)
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Rutas protegidas (escritura) -> requieren Bearer token
router.post("/create", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
