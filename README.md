# API de Productos – TechLab (Proyecto Final)

API REST para administrar el catálogo de productos de la tienda: leer, crear, actualizar y eliminar productos guardados en **Firestore (Firebase)**, con autenticación **JWT** (JSON Web Token).

## Tecnologías

- **Node.js** con **ESModules** (`"type": "module"`).
- **Express**: servidor web y ruteo.
- **cors**: habilita peticiones de origen cruzado para los frontends.
- **body-parser**: interpreta los body en formato JSON.
- **dotenv**: carga las variables de entorno desde el `.env`.
- **firebase**: SDK para conectarse a Firestore, la base de datos en la nube.
- **jsonwebtoken**: genera y verifica los tokens JWT.

## Estructura (arquitectura en capas)

```
proyecto-final-api/
├── index.js                    # Punto de entrada: configuración del servidor Express
├── .env / .env.example         # Variables de entorno (el .env NO se sube al repo)
├── seed.js                     # (Opcional) carga productos de ejemplo
├── requests.http               # Peticiones de prueba para cada endpoint
└── src/
    ├── routes/                 # Capa de rutas
    │   ├── products.routes.js
    │   └── auth.routes.js
    ├── controllers/            # Capa de controladores (req -> res)
    │   ├── products.controller.js
    │   └── auth.controller.js
    ├── services/               # Capa de servicios (lógica de negocio y validaciones)
    │   ├── products.service.js
    │   └── auth.service.js
    ├── models/                 # Capa de modelos (acceso a Firestore)
    │   └── product.model.js
    ├── middlewares/            # Autenticación, 404 y manejo global de errores
    │   ├── auth.middleware.js
    │   ├── notFound.middleware.js
    │   └── errorHandler.middleware.js
    ├── config/                 # Configuración de servicios externos
    │   └── firebase.js
    └── utils/
        └── httpError.js        # Error con código de estado HTTP
```

Flujo de una petición: **ruta → (middleware de auth) → controlador → servicio → modelo → Firestore**.

## Endpoints

| Método | Ruta | Protegida | Descripción |
|---|---|---|---|
| POST | `/auth/login` | No | Recibe `email` y `password`. Devuelve el Bearer token o 401 |
| GET | `/api/products` | No | Devuelve todos los productos |
| GET | `/api/products/:id` | No | Devuelve el producto con ese ID (404 si no existe) |
| POST | `/api/products/create` | Sí | Crea un producto con los datos del body |
| PUT | `/api/products/:id` | Sí | Actualiza uno o más campos del producto |
| DELETE | `/api/products/:id` | Sí | Elimina el producto con ese ID |

En las rutas protegidas hay que enviar el header `Authorization: Bearer <token>`.

> El `PUT` se agregó para cubrir el "Actualizar" que pide la premisa del CRUD, aunque el Requerimiento #4 no lo lista.

### Modelo de producto

```json
{
  "name": "Mouse inalámbrico",      // string, obligatorio
  "description": "Mouse óptico",    // string, opcional
  "price": 15999.99,                // number >= 0, obligatorio
  "stock": 25,                      // entero >= 0, obligatorio
  "category": "Periféricos"         // string, obligatorio
}
```

`createdAt` y `updatedAt` los completa la API automáticamente.

## Manejo de errores

| Código | Cuándo |
|---|---|
| **400** | Body con JSON mal formado, datos faltantes o inválidos, o login sin email/password |
| **401** | Falta el token, viene con formato incorrecto o las credenciales del login son inválidas |
| **403** | El token es inválido o está vencido |
| **404** | La ruta no existe o el producto no existe |
| **500** | Firestore no responde o falla (timeout configurable con `DB_TIMEOUT_MS`), o falta configurar la autenticación |

## Puesta en marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear el proyecto en Firebase

1. Entrá a https://console.firebase.google.com y creá un proyecto. Google Analytics no hace falta.
2. En el menú, andá a **Compilación → Firestore Database → Crear base de datos**. Elegí una ubicación (por ejemplo `southamerica-east1`) e iniciá en **modo de prueba**.
3. En **Firestore → Reglas**, dejalas así y publicá:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   Hace falta porque la API usa el SDK cliente de Firebase (`firebase`, como pide la consigna). La seguridad la controla la propia API con JWT.
4. Creá la colección **`products`** y su **primer documento** a mano. Usá un ID automático y estos campos con sus tipos:
   - `name` (string)
   - `description` (string)
   - `price` (number)
   - `stock` (number)
   - `category` (string)

   Esto le da estructura y tipos de datos a la colección (Requerimiento #6).
5. En **⚙️ Configuración del proyecto → General → Tus apps**, registrá una app **Web (`</>`)** y copiá los valores de `firebaseConfig`.

### 3. Configurar el `.env`

Completá los valores marcados como `COMPLETAR` en el `.env`. Si no existe, copialo desde `.env.example`.

- **Firebase**: van los valores de `firebaseConfig` del paso anterior.
- **`JWT_SECRET`**: una cadena larga y aleatoria. Podés generarla con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- **`AUTH_USER_EMAIL` / `AUTH_USER_PASSWORD`**: el usuario habilitado para hacer login.

### 4. Levantar el servidor

```bash
npm run start
```

El servidor queda en `http://localhost:3000`.

Opcionalmente, podés cargar productos de ejemplo con `npm run seed`.

### 5. Probar

Abrí `requests.http` en VS Code con la extensión **REST Client**, o copiá las peticiones a Postman.

1. Hacé login y copiá el token.
2. Pegalo en la variable `@token`.
3. Probá cada endpoint, incluidos los casos de error.
