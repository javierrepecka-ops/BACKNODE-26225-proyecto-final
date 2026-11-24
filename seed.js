// Carga productos de ejemplo en Firestore (opcional).
// Uso: npm run seed   (requiere el .env con las credenciales de Firebase)
import "dotenv/config";
import * as ProductModel from "./src/models/product.model.js";

const products = [
  { name: "Mouse inalámbrico", description: "Mouse óptico 1600 DPI", price: 15999.99, stock: 25, category: "Periféricos" },
  { name: "Teclado mecánico", description: "Switches red, retroiluminado", price: 54999, stock: 10, category: "Periféricos" },
  { name: "Monitor 24\"", description: "Full HD IPS 75 Hz", price: 189999, stock: 5, category: "Monitores" },
];

try {
  for (const p of products) {
    const created = await ProductModel.create(p);
    console.log("Creado:", created.id, "-", created.name);
  }
  console.log("Seed terminado.");
  process.exit(0);
} catch (error) {
  console.error("Error en el seed:", error.message);
  process.exit(1);
}
