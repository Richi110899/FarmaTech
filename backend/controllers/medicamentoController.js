const { Medicamento } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const data = await Medicamento.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error en getAll medicamentos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Medicamento.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    res.json(data);
  } catch (error) {
    console.error('Error en getById medicamentos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Medicamento.create(req.body);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error en create medicamentos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Medicamento.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    await data.update(req.body);
    res.json(data);
  } catch (error) {
    console.error('Error en update medicamentos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await Medicamento.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    await data.destroy();
    res.json({ message: 'Eliminado' });
  } catch (error) {
    console.error('Error en delete medicamentos:', error);
    res.status(500).json({ error: error.message });
  }
};