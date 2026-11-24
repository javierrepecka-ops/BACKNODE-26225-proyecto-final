// Capa de controladores: recibe la petición, llama al servicio y arma la respuesta
import * as ProductsService from "../services/products.service.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductsService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await ProductsService.getProductById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await ProductsService.createProduct(req.body);
    res.status(201).json({ message: "Producto creado", product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await ProductsService.updateProduct(req.params.id, req.body);
    res.status(200).json({ message: "Producto actualizado", product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await ProductsService.deleteProduct(req.params.id);
    res.status(200).json({ message: "Producto eliminado", id: req.params.id });
  } catch (error) {
    next(error);
  }
};
