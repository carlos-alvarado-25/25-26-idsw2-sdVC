-- IdSw 2: Migración para la rama de Profesores

CREATE TABLE IF NOT EXISTS Profesor (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ProfesorAsignatura (
    idProfesor INT,
    idAsignatura INT,
    PRIMARY KEY (idProfesor, idAsignatura),
    FOREIGN KEY (idProfesor) REFERENCES Profesor(id) ON DELETE CASCADE,
    FOREIGN KEY (idAsignatura) REFERENCES Asignatura(id) ON DELETE CASCADE
);

-- Insertar profesores de ejemplo
INSERT INTO Profesor (codigo, nombre, email, departamento) VALUES
('P001', 'Dr. Manuel García', 'manuel.garcia@idsw2.edu', 'Lenguajes y Sistemas Informáticos'),
('P002', 'Dra. Sofía Pérez', 'sofia.perez@idsw2.edu', 'Matemática Aplicada'),
('P003', 'Dr. Alberto Ruiz', 'alberto.ruiz@idsw2.edu', 'Ciencias de la Computación')
ON DUPLICATE KEY UPDATE codigo=codigo;
