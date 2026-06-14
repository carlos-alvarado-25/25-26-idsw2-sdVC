-- IdSw 2: Migración para la rama de Exámenes y Calendario

CREATE TABLE IF NOT EXISTS Examen (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    fecha DATE NULL,
    hora VARCHAR(5) NULL, -- "HH:MM"
    duracion INT NOT NULL,     -- en minutos
    tipo ENUM('Ordinaria', 'Extraordinaria') NOT NULL,
    asignaturaId INT NOT NULL,
    aulaId INT NULL,
    profesorId INT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asignaturaId) REFERENCES Asignatura(id) ON DELETE CASCADE,
    FOREIGN KEY (aulaId) REFERENCES Aula(id) ON DELETE SET NULL,
    FOREIGN KEY (profesorId) REFERENCES Profesor(id) ON DELETE SET NULL
);
