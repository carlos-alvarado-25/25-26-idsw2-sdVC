# Análisis - Disciplina de Análisis y Diseño

Esta sección contiene el análisis arquitectónico de los casos de uso especificados, aplicando el patrón MVC e identificando las clases de análisis necesarias para la implementación.

## Contenido de la disciplina

### [Casos de uso - Análisis MVC](casos-uso/README.md)
Análisis completo de cada caso de uso especificado mediante:
- **Clases de análisis**: Boundary, Control, Entity según patrón MVC.
- **Diagramas de colaboración**: Interacciones entre clases de análisis.
- **Responsabilidades definidas**: Separación clara de responsabilidades por estereotipo.

## Metodología de análisis aplicada

### Patrón MVC sistemático
- **Model (Entity)**: Entidades del dominio y repositorios de datos.
- **View (Boundary)**: Clases de interfaz que manejan interacción con actores.
- **Controller (Control)**: Coordinación de lógica de negocio y flujo de casos de uso.

### Estereotipos de análisis
- **Boundary (Vista)**: `#629EF9` - Clases de interfaz usuario-sistema.
- **Control (Controlador)**: `#b5bd68` - Clases de coordinación y lógica.
- **Entity (Entidad)**: `#F2AC4E` - Clases de dominio y persistencia.
- **Collaboration**: `#CDEBA5` - Referencias a estados o colaboraciones externas.

## Cobertura de análisis

### Gestión de Grados
- **Gestión académica**: abrirGrados(), crearGrado(), editarGrado(), eliminarGrado(), importarGrados()

## Trazabilidad

### De especificación a análisis
- **Cada caso de uso especificado** tiene su análisis MVC correspondiente.
- **Vocabulario consistente**: Mantenimiento del vocabulario del modelo del dominio.

### De análisis a diseño
- **Clases de análisis** serán la base para el diseño orientado a objetos y la arquitectura del sistema.

## Referencias

- [Casos de uso especificados](/RUP/00-requisitos/01-casos-de-uso/4-DetallarCasosDeUso/README.md)
- [Log de conversaciones](/conversation-log.md)
