# IdSw 2 > cerrarSesion > Desarrollo

> |[🏠️](/RUP/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/cerrarSesion/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/cerrarSesion/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|

- **Backend:** [auth.controller.ts](/src/backend/src/modules/auth/auth.controller.ts) · [auth.service.ts](/src/backend/src/modules/auth/auth.service.ts)
- **Frontend:** [auth.service.ts](/src/frontend/src/app/core/services/auth.service.ts) · [home.component.ts](/src/frontend/src/app/features/home/home.component.ts)

## Descripción
Protocolo de desconexión segura que invalida el contexto de autenticación en el cliente y notifica al servidor sobre el fin de la sesión.

## Estado
✅ **Completado** - Iteración 1

## Backend

### Endpoints

#### POST `/auth/logout`
Informa al servidor sobre el cierre de sesión. En el esquema actual de JWT stateless, este endpoint confirma la intención de salida.

**Request:**
```http
POST /auth/logout
```

**Response (200 OK):**
```json
{
  "message": "Sesión cerrada correctamente"
}
```

## Frontend

### Implementación

#### AuthService (`auth.service.ts`)
- Realiza la llamada HTTP al servidor.
- Utiliza el operador `finalize` para asegurar que el `localStorage` se limpie independientemente de la respuesta del servidor.
- Resetea el `BehaviorSubject` del usuario a `null`.

#### HomeComponent (`home.component.ts`)
- Provee el botón de acción para disparar el flujo de logout.
- Redirige al usuario a la pantalla de login tras la limpieza de sesión.

---

## Testing

1. Iniciar sesión exitosamente.
2. Hacer clic en el botón "Cerrar Sesión" en la pantalla de inicio.
3. Verificar que se realiza la petición `POST /auth/logout` en la pestaña Network de las herramientas de desarrollador.
4. Verificar que se eliminan las entradas `accessToken` y `user` de `localStorage`.
5. Verificar la redirección automática a `/login`.
