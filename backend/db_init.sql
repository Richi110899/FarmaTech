CREATE TABLE Especialidad (
  CodEspec INT AUTO_INCREMENT PRIMARY KEY,
  descripcionEsp VARCHAR(100)
);

CREATE TABLE TipoMedic (
  CodTipoMed INT AUTO_INCREMENT PRIMARY KEY,
  descripcion VARCHAR(100)
);

CREATE TABLE Laboratorio (
  CodLab INT AUTO_INCREMENT PRIMARY KEY,
  razonSocial VARCHAR(100),
  direccion VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  contacto VARCHAR(100)
);

CREATE TABLE Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  rol ENUM('Administrador', 'Vendedor', 'Comprador') NOT NULL DEFAULT 'Vendedor',
  activo BOOLEAN DEFAULT true,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Medicamento (
  CodMedicamento INT AUTO_INCREMENT PRIMARY KEY,
  descripcionMed VARCHAR(100),
  fechaFabricacion DATE,
  fechaVencimiento DATE,
  Presentacion VARCHAR(100),
  stock INT,
  stockMinimo INT NOT NULL DEFAULT 10,
  precioVentaUni DECIMAL(10,2),
  CodTipoMed INT,
  Marca VARCHAR(100),
  CodEspec INT,
  alertaStock BOOLEAN DEFAULT true,
  alertaVencimiento BOOLEAN DEFAULT true,
  diasAlertaVencimiento INT DEFAULT 30,
  FOREIGN KEY (CodTipoMed) REFERENCES TipoMedic(CodTipoMed),
  FOREIGN KEY (CodEspec) REFERENCES Especialidad(CodEspec)
);

CREATE TABLE OrdenVenta (
  NroOrdenVta INT AUTO_INCREMENT PRIMARY KEY,
  fechaEmision DATE,
  Motivo VARCHAR(100),
  Situacion VARCHAR(50)
);

CREATE TABLE DetalleOrdenVta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NroOrdenVta INT,
  CodMedicamento INT,
  descripcionMed VARCHAR(100),
  cantidadRequerida INT,
  FOREIGN KEY (NroOrdenVta) REFERENCES OrdenVenta(NroOrdenVta),
  FOREIGN KEY (CodMedicamento) REFERENCES Medicamento(CodMedicamento)
);

CREATE TABLE OrdenCompra (
  NroOrdenC INT AUTO_INCREMENT PRIMARY KEY,
  fechaEmision DATE,
  Situacion VARCHAR(50),
  Total DECIMAL(10,2),
  CodLab INT,
  NrofacturaProv VARCHAR(100),
  FOREIGN KEY (CodLab) REFERENCES Laboratorio(CodLab)
);

CREATE TABLE DetalleOrdenCompra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  NroOrdenC INT,
  CodMedicamento INT,
  descripcion VARCHAR(100),
  cantidad INT,
  precio DECIMAL(10,2),
  montouni DECIMAL(10,2),
  FOREIGN KEY (NroOrdenC) REFERENCES OrdenCompra(NroOrdenC),
  FOREIGN KEY (CodMedicamento) REFERENCES Medicamento(CodMedicamento)
);
