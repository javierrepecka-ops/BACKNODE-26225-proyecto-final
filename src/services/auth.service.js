// Capa de servicios: autenticación de usuarios y emisión de JWT
import jwt from "jsonwebtoken";
import { badRequest, unauthorized, serverError } from "../utils/httpError.js";

// Usuario habilitado (definido en el .env)
const getValidUser = () => ({
  email: process.env.AUTH_USER_EMAIL,
  password: process.env.AUTH_USER_PASSWORD,
});

export const login = (body) => {
  const { email, password } = body || {};

  if (!email || !password) {
    throw badRequest("Debés enviar 'email' y 'password' en el body");
  }
  if (typeof email !== "string" || typeof password !== "string") {
    throw badRequest("'email' y 'password' deben ser textos");
  }

  const validUser = getValidUser();
  if (!validUser.email || !validUser.password || !process.env.JWT_SECRET) {
    throw serverError("Autenticación no configurada: revisá AUTH_USER_EMAIL, AUTH_USER_PASSWORD y JWT_SECRET en el .env");
  }

  if (email !== validUser.email || password !== validUser.password) {
    throw unauthorized("Credenciales inválidas");
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn });

  return { token: `Bearer ${token}`, expiresIn };
};
