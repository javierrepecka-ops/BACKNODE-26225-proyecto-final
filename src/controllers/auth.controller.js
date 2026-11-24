// Controlador de login: valida la identidad y devuelve un Bearer token
import * as AuthService from "../services/auth.service.js";

export const login = (req, res, next) => {
  try {
    const result = AuthService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
