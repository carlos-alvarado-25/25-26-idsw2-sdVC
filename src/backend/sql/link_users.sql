-- IdSw 2: Migración para enlazar físicamente las tablas Alumno y Profesor con Usuario

-- 1. Modificar tabla Alumno
ALTER TABLE Alumno 
ADD COLUMN usuarioId INT UNIQUE NULL,
ADD CONSTRAINT FK_Alumno_Usuario FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE SET NULL;

-- 2. Modificar tabla Profesor
ALTER TABLE Profesor 
ADD COLUMN usuarioId INT UNIQUE NULL,
ADD CONSTRAINT FK_Profesor_Usuario FOREIGN KEY (usuarioId) REFERENCES Usuario(id) ON DELETE SET NULL;
