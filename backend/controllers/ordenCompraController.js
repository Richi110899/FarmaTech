const { OrdenCompra } = require('../models');

exports.getAll = async (req, res) => {
  const data = await OrdenCompra.findAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await OrdenCompra.findByPk(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    // Corregir la fecha para evitar problemas de zona horaria
    let fechaEmision = req.body.fechaEmision;
    if (fechaEmision) {
      // Si la fecha viene como YYYY-MM-DD, agregar la hora local
      if (fechaEmision.length === 10) {
        const [year, month, day] = fechaEmision.split('-');
        // Crear fecha en zona horaria local
        fechaEmision = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }
    
    const data = await OrdenCompra.create({
      ...req.body,
      fechaEmision: fechaEmision
    });
    res.status(201).json(data);
  } catch (error) {
    console.error('Error al crear orden de compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await OrdenCompra.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    
    // Corregir la fecha para evitar problemas de zona horaria
    let fechaEmision = req.body.fechaEmision;
    if (fechaEmision) {
      // Si la fecha viene como YYYY-MM-DD, agregar la hora local
      if (fechaEmision.length === 10) {
        const [year, month, day] = fechaEmision.split('-');
        // Crear fecha en zona horaria local
        fechaEmision = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }
    
    await data.update({
      ...req.body,
      fechaEmision: fechaEmision
    });
    res.json(data);
  } catch (error) {
    console.error('Error al actualizar orden de compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.delete = async (req, res) => {
  const data = await OrdenCompra.findByPk(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  await data.destroy();
  res.json({ message: 'Eliminado' });
};