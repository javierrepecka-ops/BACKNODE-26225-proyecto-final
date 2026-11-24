import { Router } from "express";
import { login } from "../controllers/auth.controller.js";

const router = Router();

// POST /auth/login -> devuelve Bearer token si las credenciales son válidas
router.post("/login", login);

export default router;
