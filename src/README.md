# IdSw 2 - Código Fuente

Este directorio contiene la implementación técnica del sistema de generación de exámenes.

## Estructura

- **/backend**: API REST desarrollada con NestJS v11 y TypeORM.
- **/frontend**: Aplicación SPA desarrollada con Angular v21.

## Estándares de Codificación

1. **Modularidad**: Sigue el patrón modular nativo de NestJS.
2. **Validación**: Todos los inputs deben usar DTOs con class-validator.
3. **Persistencia**: MySQL gestionado mediante Entities de TypeORM (CamelCase).
4. **Seguridad**: Autenticación basada en JWT.

Para más detalles, consulta el [Documento de Configuración](../RUP/02-diseño/configuracion-proyecto.md).
