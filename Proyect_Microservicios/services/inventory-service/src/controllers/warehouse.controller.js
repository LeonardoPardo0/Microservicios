import Warehouse from "../models/warehouse.model.js";

export const getAllWarehouses = async (req, res) => {
  const warehouses = await Warehouse.find();
  res.json({ success: true, data: warehouses });
};

export const createWarehouse = async (req, res) => {
  const { name, address } = req.body;
  const warehouse = new Warehouse({ name, address });
  await warehouse.save();
  res.json({ success: true, data: warehouse });
};

export const updateWarehouse = async (req, res) => {
  const { warehouseId } = req.params;
  const { name, address } = req.body;
  const warehouse = await Warehouse.findOneAndUpdate(
    { warehouseId },
    { name, address },
    { new: true }
  );
  if (!warehouse) return res.status(404).json({ success: false, message: "No encontrado" });
  res.json({ success: true, data: warehouse });
};

export const deleteWarehouse = async (req, res) => {
  const { warehouseId } = req.params;
  const warehouse = await Warehouse.findOneAndDelete({ warehouseId });
  if (!warehouse) return res.status(404).json({ success: false, message: "No encontrado" });
  res.json({ success: true, message: "Eliminado" });
};