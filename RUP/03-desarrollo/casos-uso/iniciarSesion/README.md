# IdSw 2 > iniciarSesion > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/iniciarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/iniciarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [auth.controller.ts](/src/backend/src/modules/auth/auth.controller.ts) · [auth.service.ts](/src/backend/src/modules/auth/auth.service.ts) · [usuario.entity.ts](/src/backend/src/entities/usuario.entity.ts)
- **Frontend:** [login.component.ts](/src/frontend/src/app/features/auth/login/login.component.ts) · [auth.service.ts](/src/frontend/src/app/core/services/auth.service.ts)

## Descripción
Autenticación de usuarios mediante JWT (JSON Web Tokens). El sistema valida las credenciales (email y password) contra la base de datos MySQL y genera un token de acceso para las peticiones subsecuentes.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/auth/login`
Autentica al usuario y retorna el token JWT y datos básicos del perfil.

**Request:**
```json
{
  "email": "admin@idsw2.edu",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGci...",
  "user": {
    "id": 1,
    "email": "admin@idsw2.edu",
    "rol": "Admin"
  }
}
```

### Implementación
- **Framework**: NestJS v11
- **Seguridad**: Passport JWT + Bcrypt para hashing.
- **Persistencia**: TypeORM con MySQL.
- **Validación**: DTOs con class-validator.

---

## Frontend

### Implementación
- **Framework**: Angular v21
- **Gestión de Estado**: RxJS BehaviorSubject en AuthService.
- **UI**: CSS Puro (minimalista para validación funcional).

#### LoginComponent
- Formulario reactivo con validaciones de lado cliente.
- Manejo de estados de carga (loading) y errores.
- Redirección automática tras éxito.

#### AuthService
- Centraliza las peticiones de login/logout.
- Persistencia del token y datos de usuario en `localStorage`.

---

## Testing

### Backend (cURL)
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@idsw2.edu", "password": "idsw2_2026"}' | jq
```

## Notas de implementación
- Se ha configurado un interceptor de seguridad para el manejo de sesiones en futuras iteraciones.
- La contraseña se almacena hasheada en la base de datos (Bcrypt).
