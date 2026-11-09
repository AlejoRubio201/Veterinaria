# VeterinariaBack – API segura (Node + Express + MySQL)

## Estructura
```
VeterinariaBack/
├── app.js                         # Servidor Express + cadena de middlewares
├── config/            env.js (variables obligatorias) · db.js (pool + tablas)
├── middlewares/       auth · seguridad (rate limit, JSON, saneo) · error
├── routes/            auth · usuario · mascota · cita · registro
├── controllers/       capa HTTP
├── services/          validaciones y reglas de negocio
├── models/            SQL (acceso a datos)
└── utils/             validar.js (tipos/longitudes/formatos) · HttpError · asyncHandler
```
Flujo: `routes → middlewares → controller → service → model → db`

## Puesta en marcha
1. MySQL/MariaDB en ejecución y base creada: `CREATE DATABASE veterinaria;` (o `database/schema.sql`).
2. `cp .env.example .env` y completar. **`JWT_SECRET` es obligatorio** (≥32 caracteres):
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
3. `npm install` → `npm run dev` → http://localhost:3000
4. (Opcional) `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env` crean un administrador al iniciar.

## Autenticación
- **Registro / login** → devuelve `accessToken` (JWT, 15 min) en el cuerpo y un **refresh token** en cookie `httpOnly`, `SameSite=Strict`.
- Peticiones protegidas: `Authorization: Bearer <accessToken>`.
- **Refresh con rotación**: cada refresh token sirve una sola vez; si se reutiliza uno viejo se cierran todas las sesiones del usuario.
- Contraseñas con **bcrypt** (costo 12). En BD solo se guarda el hash; los refresh tokens se guardan como SHA-256.

## Endpoints
| Método | Ruta | Acceso |
|---|---|---|
| POST | /api/auth/registro · /login | Público (límite 20/15 min) |
| POST | /api/auth/refresh · /logout | Cookie de sesión |
| GET | /api/auth/me | Autenticado |
| PUT | /api/auth/password | Autenticado (cierra otras sesiones) |
| GET, POST | /api/usuarios | Solo admin |
| GET, PUT, DELETE | /api/usuarios/:id | Dueño o admin |
| CRUD | /api/mascotas, /api/citas, /api/registros | Autenticado, solo datos propios |

`/api/citas?periodo=proximas|historial&mascotaId=` · `/api/registros?categoria=cuidado|nota|alergia|condicion|recordatorio|vacuna|historial|foto&periodo=proximas|pasadas&mascotaId=`

Códigos: 200, 201, 400 (validación), 401 (sin/inválido token), 403 (sin permiso), 404, 409, 413, 415, 429, 500.

## Medidas de seguridad implementadas
| Riesgo | Medida |
|---|---|
| Fuerza bruta | Rate limit global y estricto en auth + bloqueo de cuenta 15 min tras 5 fallos |
| Enumeración de usuarios | Mensaje genérico y comparación bcrypt con hash falso |
| Robo de contraseñas en BD | bcrypt; `password_hash` nunca se devuelve |
| Robo de tokens (XSS) | Access token solo en memoria; refresh en cookie `httpOnly` |
| CSRF | `SameSite=Strict`, cookie limitada a `/api/auth`, CORS con lista blanca, exige `application/json` |
| Token falsificado | JWT con algoritmo, emisor y audiencia fijados; se verifica que el usuario siga existiendo |
| Escalada de privilegios | El rol nunca viene del cliente; solo un admin cambia roles; lista blanca de campos |
| Acceso a datos ajenos (IDOR) | Todas las consultas filtran por `usuario_id` del token |
| Inyección SQL | Consultas parametrizadas (`?`) |
| Datos mal formados | Validación de tipo/longitud/formato; cuerpos `null`, arrays o JSON roto → 400 |
| Prototype pollution / cuerpos enormes | Saneo de claves y límite de 10 KB |
| URLs peligrosas | Solo `http(s)` (bloquea `javascript:`) |
| Fugas de información | Errores 500 genéricos, `x-powered-by` off, cabeceras de `helmet` |

## Reglas de negocio de fechas
- Las fechas se guardan en UTC (`DATETIME`) y viajan en ISO-8601.
- **No se permiten citas ni recordatorios con fecha pasada** (al crear ni al reprogramar).
- Notas, cuidados, vacunas e historial no admiten fechas futuras.
- El estado "Completada" se **calcula** (fecha < ahora); no se guarda.

## Datos de ejemplo (para la demo)
`npm run seed` crea el usuario `demo@petcare.com` / `Demo12345` con 2 mascotas, citas, recordatorios, notas, etc.
Las fechas se calculan respecto a hoy, por lo que no quedan vencidas. Es idempotente (no duplica).
