# IdSw 2 > importarAulas > Desarrollo

> |[🏠️](/README.md)|[ 📊](/RUP/00-requisitos/01-casos-de-uso/2-DiagramaDeContexto/README.md)|[Detalle](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)|[🔍 Análisis](/RUP/01-analisis/casos-uso/importarAulas/README.md)|[📂 Diseño](/RUP/02-diseño/casos-uso/importarAulas/README.md)|**Desarrollo**|Pruebas|
> |-|-|-|-|-|-|-|

- **Backend:** [aulas.controller.ts](/src/backend/src/modules/aulas/aulas.controller.ts) · [aulas.service.ts](/src/backend/src/modules/aulas/aulas.service.ts) · [import-result.dto.ts](/src/backend/src/modules/aulas/dto/import-result.dto.ts)
- **Frontend:** [importar-aulas.component.ts](/src/frontend/src/app/features/admin/aulas/importar-aulas/importar-aulas.component.ts) · [aula.service.ts](/src/frontend/src/app/core/services/aula.service.ts)

## Descripción
Implementación de la carga masiva de aulas mediante archivos CSV y Excel (.xlsx). El sistema procesa cada línea validando la unicidad del código del aula antes de la persistencia atómica en el motor de base de datos.

## Estado
✅ **Completado** - Iteración 2

## Backend

### Endpoints
#### POST `/aulas/importar`
Procesa un archivo multipart/form-data con la lista de aulas.
- **Formato**: `codigo, nombre, capacidad, edificio, planta, tipo`.

### Lógica de Negocio
- **Validación de Identidad**: Se comprueba fila por fila que el código no exista previamente en el inventario.
- **Persistencia Atómica**: El lote de aulas válidas se guarda en una única operación de repositorio.
- **Reporte Detallado**: Retorno de estadísticas de éxito/fallo con descripciones de error por cada línea fallida.

---

## Frontend

### Implementación
#### ImportarAulasComponent
- **UX Consistente**: Interfaz de arrastrar y soltar archivo basada en el estándar del sistema.
- **Panel de Resultados**: Visualización reactiva del balance final de la importación y detalles de errores técnicos.

---

## Testing

### Preparación del Archivo (test-aulas.csv)
```csv
codigo, nombre, capacidad, edificio, planta, tipo
A-101, Aula 101, 30, Central, 1ª, Teoría
LAB-01, Lab Redes, 15, Sistemas, Bajo, Laboratorio
```

### Ejecución (cURL)
```bash
curl -X POST http://localhost:3000/aulas/importar \
  -F "file=@test-aulas.csv"
```
