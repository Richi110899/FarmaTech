-- ESPECIALIDAD
INSERT INTO Especialidad (descripcionEsp) VALUES
('Cardiología'), ('Pediatría'), ('Dermatología'), ('Neurología'), ('Oncología'),
('Ginecología'), ('Traumatología'), ('Oftalmología'), ('Psiquiatría'), ('Urología'),
('Endocrinología'), ('Gastroenterología'), ('Nefrología'), ('Neumología'), ('Reumatología'),
('Otorrinolaringología'), ('Hematología'), ('Infectología'), ('Alergología'), ('Cirugía');

-- TIPOMEDIC
INSERT INTO TipoMedic (descripcion) VALUES
('Antibiótico'), ('Analgésico'), ('Antiinflamatorio'), ('Antipirético'), ('Antihistamínico'),
('Antidepresivo'), ('Anticonvulsivo'), ('Antipsicótico'), ('Antiviral'), ('Antifúngico'),
('Broncodilatador'), ('Corticoide'), ('Diurético'), ('Hipoglucemiante'), ('Inmunosupresor'),
('Laxante'), ('Mucolítico'), ('Sedante'), ('Vasodilatador'), ('Vacuna');

-- LABORATORIO
INSERT INTO Laboratorio (razonSocial, direccion, telefono, email, contacto) VALUES
('Lab Alfa', 'Calle 1', '123456', 'alfa@lab.com', 'Juan Pérez'),
('Lab Beta', 'Calle 2', '234567', 'beta@lab.com', 'Ana Gómez'),
('Lab Gamma', 'Calle 3', '345678', 'gamma@lab.com', 'Luis Torres'),
('Lab Delta', 'Calle 4', '456789', 'delta@lab.com', 'Marta Ruiz'),
('Lab Epsilon', 'Calle 5', '567890', 'epsilon@lab.com', 'Carlos Díaz'),
('Lab Zeta', 'Calle 6', '678901', 'zeta@lab.com', 'Lucía Fernández'),
('Lab Eta', 'Calle 7', '789012', 'eta@lab.com', 'Pedro López'),
('Lab Theta', 'Calle 8', '890123', 'theta@lab.com', 'Sofía Martínez'),
('Lab Iota', 'Calle 9', '901234', 'iota@lab.com', 'Miguel Castro'),
('Lab Kappa', 'Calle 10', '012345', 'kappa@lab.com', 'Paula Romero'),
('Lab Lambda', 'Calle 11', '112233', 'lambda@lab.com', 'Jorge Silva'),
('Lab Mu', 'Calle 12', '223344', 'mu@lab.com', 'Andrea Ríos'),
('Lab Nu', 'Calle 13', '334455', 'nu@lab.com', 'Diego Soto'),
('Lab Xi', 'Calle 14', '445566', 'xi@lab.com', 'Valeria León'),
('Lab Omicron', 'Calle 15', '556677', 'omicron@lab.com', 'Emilio Vera'),
('Lab Pi', 'Calle 16', '667788', 'pi@lab.com', 'Natalia Peña'),
('Lab Rho', 'Calle 17', '778899', 'rho@lab.com', 'Gabriel Ortiz'),
('Lab Sigma', 'Calle 18', '889900', 'sigma@lab.com', 'Marina Salas'),
('Lab Tau', 'Calle 19', '990011', 'tau@lab.com', 'Ricardo Paredes'),
('Lab Upsilon', 'Calle 20', '101112', 'upsilon@lab.com', 'Cecilia Bravo');

-- USUARIO
INSERT INTO Usuario (password, nombre, apellido, email, rol, activo) VALUES
('pass1', 'Juan', 'Pérez', 'juan1@correo.com', 'Administrador', true),
('pass2', 'Ana', 'Gómez', 'ana2@correo.com', 'Vendedor', true),
('pass3', 'Luis', 'Torres', 'luis3@correo.com', 'Comprador', true),
('pass4', 'Marta', 'Ruiz', 'marta4@correo.com', 'Vendedor', true),
('pass5', 'Carlos', 'Díaz', 'carlos5@correo.com', 'Administrador', true),
('pass6', 'Lucía', 'Fernández', 'lucia6@correo.com', 'Vendedor', true),
('pass7', 'Pedro', 'López', 'pedro7@correo.com', 'Comprador', true),
('pass8', 'Sofía', 'Martínez', 'sofia8@correo.com', 'Vendedor', true),
('pass9', 'Miguel', 'Castro', 'miguel9@correo.com', 'Administrador', true),
('pass10', 'Paula', 'Romero', 'paula10@correo.com', 'Vendedor', true),
('pass11', 'Jorge', 'Silva', 'jorge11@correo.com', 'Comprador', true),
('pass12', 'Andrea', 'Ríos', 'andrea12@correo.com', 'Vendedor', true),
('pass13', 'Diego', 'Soto', 'diego13@correo.com', 'Administrador', true),
('pass14', 'Valeria', 'León', 'valeria14@correo.com', 'Vendedor', true),
('pass15', 'Emilio', 'Vera', 'emilio15@correo.com', 'Comprador', true),
('pass16', 'Natalia', 'Peña', 'natalia16@correo.com', 'Vendedor', true),
('pass17', 'Gabriel', 'Ortiz', 'gabriel17@correo.com', 'Administrador', true),
('pass18', 'Marina', 'Salas', 'marina18@correo.com', 'Vendedor', true),
('pass19', 'Ricardo', 'Paredes', 'ricardo19@correo.com', 'Comprador', true),
('pass20', 'Cecilia', 'Bravo', 'cecilia20@correo.com', 'Vendedor', true);

-- MEDICAMENTO
INSERT INTO Medicamento (descripcionMed, fechaFabricacion, fechaVencimiento, Presentacion, stock, stockMinimo, precioVentaUni, CodTipoMed, Marca, CodEspec, alertaStock, alertaVencimiento, diasAlertaVencimiento)
VALUES
('Paracetamol', '2023-01-01', '2025-01-01', 'Tabletas', 100, 10, 5.00, 1, 'Genfar', 1, true, true, 30),
('Ibuprofeno', '2023-02-01', '2025-02-01', 'Cápsulas', 80, 10, 7.00, 2, 'Bayer', 2, true, true, 30),
('Amoxicilina', '2023-03-01', '2025-03-01', 'Jarabe', 60, 10, 12.00, 3, 'Pfizer', 3, true, true, 30),
('Loratadina', '2023-04-01', '2025-04-01', 'Tabletas', 90, 10, 8.00, 4, 'Genfar', 4, true, true, 30),
('Metformina', '2023-05-01', '2025-05-01', 'Tabletas', 70, 10, 10.00, 5, 'Merck', 5, true, true, 30),
('Omeprazol', '2023-06-01', '2025-06-01', 'Cápsulas', 50, 10, 6.00, 6, 'Sandoz', 6, true, true, 30),
('Aspirina', '2023-07-01', '2025-07-01', 'Tabletas', 120, 10, 4.00, 7, 'Bayer', 7, true, true, 30),
('Azitromicina', '2023-08-01', '2025-08-01', 'Tabletas', 40, 10, 15.00, 8, 'Pfizer', 8, true, true, 30),
('Prednisona', '2023-09-01', '2025-09-01', 'Tabletas', 30, 10, 9.00, 9, 'Genfar', 9, true, true, 30),
('Salbutamol', '2023-10-01', '2025-10-01', 'Inhalador', 25, 10, 20.00, 10, 'GSK', 10, true, true, 30),
('Cefalexina', '2023-11-01', '2025-11-01', 'Cápsulas', 60, 10, 13.00, 11, 'Sandoz', 11, true, true, 30),
('Clonazepam', '2023-12-01', '2025-12-01', 'Tabletas', 15, 10, 18.00, 12, 'Roche', 12, true, true, 30),
('Insulina', '2023-01-15', '2025-01-15', 'Vial', 35, 10, 25.00, 13, 'Novo Nordisk', 13, true, true, 30),
('Furosemida', '2023-02-15', '2025-02-15', 'Tabletas', 45, 10, 11.00, 14, 'Sanofi', 14, true, true, 30),
('Diazepam', '2023-03-15', '2025-03-15', 'Tabletas', 55, 10, 14.00, 15, 'Roche', 15, true, true, 30),
('Simvastatina', '2023-04-15', '2025-04-15', 'Tabletas', 65, 10, 16.00, 16, 'Merck', 16, true, true, 30),
('Enalapril', '2023-05-15', '2025-05-15', 'Tabletas', 75, 10, 17.00, 17, 'Pfizer', 17, true, true, 30),
('Amlodipino', '2023-06-15', '2025-06-15', 'Tabletas', 85, 10, 19.00, 18, 'Sandoz', 18, true, true, 30),
('Levotiroxina', '2023-07-15', '2025-07-15', 'Tabletas', 95, 10, 21.00, 19, 'Merck', 19, true, true, 30),
('Omeprazol', '2023-08-15', '2025-08-15', 'Cápsulas', 105, 10, 22.00, 20, 'Sandoz', 20, true, true, 30);

-- ORDENVENTA
INSERT INTO OrdenVenta (fechaEmision, Motivo, Situacion) VALUES
('2024-01-01', 'Venta mostrador', 'Completada'),
('2024-01-02', 'Venta online', 'Pendiente'),
('2024-01-03', 'Venta mostrador', 'Completada'),
('2024-01-04', 'Venta online', 'Pendiente'),
('2024-01-05', 'Venta mostrador', 'Completada'),
('2024-01-06', 'Venta online', 'Pendiente'),
('2024-01-07', 'Venta mostrador', 'Completada'),
('2024-01-08', 'Venta online', 'Pendiente'),
('2024-01-09', 'Venta mostrador', 'Completada'),
('2024-01-10', 'Venta online', 'Pendiente'),
('2024-01-11', 'Venta mostrador', 'Completada'),
('2024-01-12', 'Venta online', 'Pendiente'),
('2024-01-13', 'Venta mostrador', 'Completada'),
('2024-01-14', 'Venta online', 'Pendiente'),
('2024-01-15', 'Venta mostrador', 'Completada'),
('2024-01-16', 'Venta online', 'Pendiente'),
('2024-01-17', 'Venta mostrador', 'Completada'),
('2024-01-18', 'Venta online', 'Pendiente'),
('2024-01-19', 'Venta mostrador', 'Completada'),
('2024-01-20', 'Venta online', 'Pendiente');

-- ORDENCOMPRA
INSERT INTO OrdenCompra (fechaEmision, Situacion, Total, CodLab, NrofacturaProv) VALUES
('2024-01-01', 'Recibida', 1000.00, 1, 'FAC-001'),
('2024-01-02', 'Pendiente', 2000.00, 2, 'FAC-002'),
('2024-01-03', 'Recibida', 1500.00, 3, 'FAC-003'),
('2024-01-04', 'Pendiente', 2500.00, 4, 'FAC-004'),
('2024-01-05', 'Recibida', 1200.00, 5, 'FAC-005'),
('2024-01-06', 'Pendiente', 2200.00, 6, 'FAC-006'),
('2024-01-07', 'Recibida', 1300.00, 7, 'FAC-007'),
('2024-01-08', 'Pendiente', 2300.00, 8, 'FAC-008'),
('2024-01-09', 'Recibida', 1400.00, 9, 'FAC-009'),
('2024-01-10', 'Pendiente', 2400.00, 10, 'FAC-010'),
('2024-01-11', 'Recibida', 1100.00, 11, 'FAC-011'),
('2024-01-12', 'Pendiente', 2100.00, 12, 'FAC-012'),
('2024-01-13', 'Recibida', 1600.00, 13, 'FAC-013'),
('2024-01-14', 'Pendiente', 2600.00, 14, 'FAC-014'),
('2024-01-15', 'Recibida', 1700.00, 15, 'FAC-015'),
('2024-01-16', 'Pendiente', 2700.00, 16, 'FAC-016'),
('2024-01-17', 'Recibida', 1800.00, 17, 'FAC-017'),
('2024-01-18', 'Pendiente', 2800.00, 18, 'FAC-018'),
('2024-01-19', 'Recibida', 1900.00, 19, 'FAC-019'),
('2024-01-20', 'Pendiente', 2900.00, 20, 'FAC-020');

-- DETALLEORDENVTA
INSERT INTO DetalleOrdenVta (NroOrdenVta, CodMedicamento, descripcionMed, cantidadRequerida) VALUES
(1, 1, 'Paracetamol', 2),
(2, 2, 'Ibuprofeno', 1),
(3, 3, 'Amoxicilina', 3),
(4, 4, 'Loratadina', 2),
(5, 5, 'Metformina', 1),
(6, 6, 'Omeprazol', 2),
(7, 7, 'Aspirina', 1),
(8, 8, 'Azitromicina', 2),
(9, 9, 'Prednisona', 1),
(10, 10, 'Salbutamol', 2),
(11, 11, 'Cefalexina', 1),
(12, 12, 'Clonazepam', 2),
(13, 13, 'Insulina', 1),
(14, 14, 'Furosemida', 2),
(15, 15, 'Diazepam', 1),
(16, 16, 'Simvastatina', 2),
(17, 17, 'Enalapril', 1),
(18, 18, 'Amlodipino', 2),
(19, 19, 'Levotiroxina', 1),
(20, 20, 'Omeprazol', 2);

-- DETALLEORDENCOMPRA
INSERT INTO DetalleOrdenCompra (NroOrdenC, CodMedicamento, descripcion, cantidad, precio, montouni) VALUES
(1, 1, 'Paracetamol', 10, 5.00, 50.00),
(2, 2, 'Ibuprofeno', 20, 7.00, 140.00),
(3, 3, 'Amoxicilina', 15, 12.00, 180.00),
(4, 4, 'Loratadina', 12, 8.00, 96.00),
(5, 5, 'Metformina', 18, 10.00, 180.00),
(6, 6, 'Omeprazol', 14, 6.00, 84.00),
(7, 7, 'Aspirina', 16, 4.00, 64.00),
(8, 8, 'Azitromicina', 11, 15.00, 165.00),
(9, 9, 'Prednisona', 13, 9.00, 117.00),
(10, 10, 'Salbutamol', 17, 20.00, 340.00),
(11, 11, 'Cefalexina', 19, 13.00, 247.00),
(12, 12, 'Clonazepam', 15, 18.00, 270.00),
(13, 13, 'Insulina', 10, 25.00, 250.00),
(14, 14, 'Furosemida', 20, 11.00, 220.00),
(15, 15, 'Diazepam', 18, 14.00, 252.00),
(16, 16, 'Simvastatina', 12, 16.00, 192.00),
(17, 17, 'Enalapril', 14, 17.00, 238.00),
(18, 18, 'Amlodipino', 16, 19.00, 304.00),
(19, 19, 'Levotiroxina', 13, 21.00, 273.00),
(20, 20, 'Omeprazol', 11, 22.00, 242.00);