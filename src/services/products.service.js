// Capa de servicios: lógica de negocio y validaciones de productos
import * as ProductModel from "../models/product.model.js";
import { badRequest, notFoundError, HttpError } from "../utils/httpError.js";

const DB_TIMEOUT_MS = Number(process.env.DB_TIMEOUT_MS) || 8000;

// Ejecuta una operación contra Firestore con timeout.
// Si el servicio externo falla o no responde -> 500
const runDb = async (operation) => {
  let timer;
  try {
    return await Promise.race([
      operation(),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("timeout")),
          DB_TIMEOUT_MS
        );
      }),
    ]);
  } catch (error) {
    if (error instanceof HttpError) throw error;
    console.error("[Firestore]", error.message);
    throw new HttpError(
      500,
      "Error al comunicarse con la base de datos. Intentá nuevamente más tarde."
    );
  } finally {
    clearTimeout(timer);
  }
};

// Campos permitidos y sus validaciones
const FIELDS = {
  name: (v) => typeof v === "string" && v.trim().length > 0 || "debe ser un texto no vacío",
  description: (v) => typeof v === "string" || "debe ser un texto",
  price: (v) => (typeof v === "number" && Number.isFinite(v) && v >= 0) || "debe ser un número mayor o igual a 0",
  stock: (v) => (Number.isInteger(v) && v >= 0) || "debe ser un número entero mayor o igual a 0",
  category: (v) => typeof v === "string" && v.trim().length > 0 || "debe ser un texto no vacío",
};
const REQUIRED = ["name", "price", "stock", "category"];

// Valida el body. partial=true para actualizaciones (no exige todos los campos)
const validateProduct = (body, { partial = false } = {}) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw badRequest("El body debe ser un objeto JSON con los datos del producto");
  }

  const errors = [];

  const unknown = Object.keys(body).filter((k) => !(k in FIELDS));
  if (unknown.length) errors.push(`Campos no permitidos: ${unknown.join(", ")}`);

  if (!partial) {
    for (const field of REQUIRED) {
      if (body[field] === undefined) errors.push(`El campo '${field}' es obligatorio`);
    }
  } else if (Object.keys(body).length === 0) {
    errors.push("Enviá al menos un campo para actualizar");
  }

  for (const [field, check] of Object.entries(FIELDS)) {
    if (body[field] !== undefined) {
      const result = check(body[field]);
      if (result !== true) errors.push(`'${field}' ${result}`);
    }
  }

  if (errors.length) throw badRequest("Datos del producto inválidos", errors);

  // Devuelve solo los campos permitidos, con textos sin espacios sobrantes
  const clean = {};
  for (const field of Object.keys(FIELDS)) {
    if (body[field] !== undefined) {
      clean[field] = typeof body[field] === "string" ? body[field].trim() : body[field];
    }
  }
  return clean;
};

const validateId = (id) => {
  if (!id || typeof id !== "string" || id.includes("/")) {
    throw badRequest("ID de producto inválido");
  }
};

export const getAllProducts = () => runDb(() => ProductModel.getAll());

export const getProductById = async (id) => {
  validateId(id);
  const product = await runDb(() => ProductModel.getById(id));
  if (!product) throw notFoundError(`No existe un producto con id '${id}'`);
  return product;
};

export const createProduct = (body) => {
  const product = validateProduct(body);
  return runDb(() => ProductModel.create(product));
};

export const updateProduct = async (id, body) => {
  validateId(id);
  const data = validateProduct(body, { partial: true });
  const updated = await runDb(() => ProductModel.update(id, data));
  if (!updated) throw notFoundError(`No existe un producto con id '${id}'`);
  return updated;
};

export const deleteProduct = async (id) => {
  validateId(id);
  const deleted = await runDb(() => ProductModel.remove(id));
  if (!deleted) throw notFoundError(`No existe un producto con id '${id}'`);
};
