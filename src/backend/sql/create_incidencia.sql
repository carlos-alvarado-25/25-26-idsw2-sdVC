-- IdSw 2: Migración para la creación de la tabla de Incidencias de Profesores

CREATE TABLE IF NOT EXISTS Incidencia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    estado ENUM('PENDIENTE', 'RESUELTA', 'RECHAZADA') DEFAULT 'PENDIENTE',
    examenId INT NOT NULL,
    profesorId INT NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (examenId) REFERENCES Examen(id) ON DELETE CASCADE,
    FOREIGN KEY (profesorId) REFERENCES Profesor(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
