// Punto de entrada de la aplicación
import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import productsRouter from "./src/routes/products.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import { notFound } from "./src/middlewares/notFound.middleware.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- Middlewares globales ----------
// CORS: habilita peticiones de origen cruzado para los frontends de la empresa
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  })
);

// body-parser: interpreta los body en formato JSON
app.use(bodyParser.json());

// ---------- Rutas ----------
app.get("/", (req, res) => {
  res.json({
    message: "API de productos - TechLab",
    endpoints: {
      login: "POST /auth/login",
      products: "GET /api/products",
      product: "GET /api/products/:id",
      create: "POST /api/products/create (requiere token)",
      update: "PUT /api/products/:id (requiere token)",
      delete: "DELETE /api/products/:id (requiere token)",
    },
  });
});

app.use("/api/products", productsRouter);
app.use("/auth", authRouter);

// ---------- Manejo de errores ----------
// Rutas desconocidas -> 404 (siempre después de todas las rutas)
app.use(notFound);

// Manejador global de errores (400, 401, 403, 404, 500)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
