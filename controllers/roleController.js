const Role = require("../models/Role");

exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name)
      return res.status(400).json({ message: "Role name is required" });

    const exists = await Role.findOne({ name: name.toLowerCase() });
    if (exists) return res.status(400).json({ message: "Role already exists" });

    const role = await Role.create({ name: name.toLowerCase(), description });
    res.status(201).json({ success: true, role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json({ success: true, count: roles.length, roles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { ...(name ? { name: name.toLowerCase() } : {}), description },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ success: true, role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ success: true, message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
