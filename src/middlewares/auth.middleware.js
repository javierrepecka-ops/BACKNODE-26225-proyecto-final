import jwt from "jsonwebtoken";
import { unauthorized, forbidden } from "../utils/httpError.js";

// Verifica el header "Authorization: Bearer <token>"
//  - Sin token o formato incorrecto -> 401 (no autenticado)
//  - Token inválido o vencido       -> 403 (acceso denegado)
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(unauthorized("Token no provisto. Enviá el header Authorization: Bearer <token>"));
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(unauthorized("Formato de token inválido. Usá: Bearer <token>"));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    const msg =
      error.name === "TokenExpiredError" ? "Token vencido" : "Token inválido";
    next(forbidden(msg));
  }
};
