-- IdSw 2: Esquema de Base de Datos Inicial (MySQL)

CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Profesor', 'Alumno') NOT NULL,
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Grado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fechaActualizacion DATETIME ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Asignatura (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    creditos INT NOT NULL,
    idGrado INT,
    FOREIGN KEY (idGrado) REFERENCES Grado(id)
);

-- Usuario Administrador por defecto (admin@idsw2.edu / idsw2_2026)
INSERT INTO Usuario (email, password, rol) VALUES 
('admin@idsw2.edu', '$2b$10$YpW2u9U8Xj6yP6wBqXpGzu7RzGvYvI1u9YpW2u9U8Xj6yP6wBqXpG', 'Admin');
