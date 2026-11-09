# PetCare – Front (React + Vite)

```
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:3000/api
npm run dev              # http://localhost:5173
```
Requiere el backend en marcha (ver `VeterinariaBack/README.md`). Crea tu cuenta en `/#/registro`.

## Arquitectura
- `services/` un servicio por dominio (auth, usuario, mascota, cita, registro) sobre `api.js` (token en memoria + refresh automático).
- `context/AuthProvider` + `ProtectedRoute`: todas las pantallas excepto login/registro exigen sesión.
- `hooks/useAsync` + `components/Estado`: estados de carga, error con reintento y ausencia de datos en cada pantalla.
- `components/`: `FormularioCampos` (validación de tipo/longitud/formato), `ListItem`, `Tabs`, `Avatar`, `Campo`, `BotonEliminar`.
- `styles/components.css` y `styles/pages.css`: estilos compartidos (ya no hay `<style>` dentro de los componentes).
- `utils/fechas.js`: formato y cálculo de estados/edades a partir de fechas ISO.
