<<<<<<< HEAD
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
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> f07299732d4d49260762e4f908dbfd0c91a7cf2a
