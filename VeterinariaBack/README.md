# VeterinariaBack – API de Usuarios (Node + Express + MySQL)

## Estructura
```
VeterinariaBack/
├── config/db.js                      # Pool MySQL + creación de tabla
├── controllers/usuario.controller.js # Capa HTTP
├── models/usuario.model.js           # SQL (acceso a datos)
├── routes/usuario.routes.js          # Rutas /api/usuarios
├── services/usuario.service.js       # Validaciones y reglas de negocio
├── database/schema.sql               # Script SQL opcional
├── app.js                            # Servidor Express
└── package.json
```
Flujo: `routes → controller → service → model → db`

## Puesta en marcha
1. Tener MySQL/MariaDB en ejecución (XAMPP, Workbench, etc.).
2. `cp .env.example .env` y ajustar `DB_USER`, `DB_PASSWORD`.
3. `npm install`
4. `npm run dev` (o `npm start`) → http://localhost:3000
   La base `veterinaria` debe existir (`CREATE DATABASE veterinaria;` o ejecutar `database/schema.sql`); la tabla `usuarios` se crea sola.

## Endpoints
| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/usuarios | Listar |
| GET | /api/usuarios/:id | Obtener uno |
| POST | /api/usuarios | Crear |
| PUT | /api/usuarios/:id | Actualizar |
| DELETE | /api/usuarios/:id | Eliminar |

Body (POST/PUT): `{ "nombre", "apellido", "email", "telefono"?, "avatar"? }`
Códigos: 200, 201, 400 (validación), 404, 409 (email duplicado), 500.
