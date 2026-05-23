--Datos de ejemplo sobre el arbol usando las carpetas
INSERT INTO nodes (id, name, type, position, parent_id) VALUES
('1', 'Facultad de Ingenieria', 'FACULTAD', 0, null),
('2', 'Semestre 1', 'SEMESTRE', 0, '1'),
('3', 'Semestre 2', 'SEMESTRE', 1, '1'),
('4', 'Programacion', 'CURSO', 0, '2'),
('5', 'Calculo', 'CURSO', 1, '2'),
('6', 'Programacion 2', 'CURSO', 0, '3'),
('7', 'Tarea Listas', 'TAREA', 0, '4'),
('8', 'Tarea Derivadas', 'TAREA', 1, '5'),
('9', 'Tarea Arboles', 'TAREA', 2, '6'),
('10', 'tarea.pdf', 'ARCHIVO', 0, '7'),
('11', 'tarea.pdf', 'ARCHIVO', 0, '8'),
('12', 'tarea.pdf', 'ARCHIVO', 0, '9');

