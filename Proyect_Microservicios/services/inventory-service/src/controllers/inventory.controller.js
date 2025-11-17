import Inventory from "../models/inventory.model.js";
import { validateProduct } from "../utils/httpClient.js";

// Obtener todos los inventarios
export const getAllInventories = async (req, res) => {
  try {
    const { status, location } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (location) filter.location = location;

    const inventories = await Inventory.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: inventories.length,
      data: inventories
    });
  } catch (error) {
    console.error("Error al obtener inventarios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener inventarios",
      error: error.message
    });
  }
};

// Obtener inventario por productId
export const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const inventory = await Inventory.findOne({ productId });
    
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventario no encontrado para este producto"
      });
    }

    res.json({
      success: true,
      data: inventory
    });
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener inventario",
      error: error.message
    });
  }
};

// Crear nuevo inventario
export const createInventory = async (req, res) => {
  try {
    const { productId, productName, quantity, minStock, maxStock, location } = req.body;

    /*lo descomentas cuando integres con el modulo producto
    const productExists = await validateProduct(productId);
    
    if (!productExists) {
      return res.status(400).json({
        success: false,
        message: "El producto no existe en el catálogo"
      });
    }
    */
    // Verificar si ya existe inventario para ese producto
    const existingInventory = await Inventory.findOne({ productId });
    if (existingInventory) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un inventario para este producto"
      });
    }

    const inventory = new Inventory({
      productId,
      productName,
      quantity,
      location,
      lastRestockDate: Date.now()
    });

    await inventory.save();

    res.status(201).json({
      success: true,
      message: "Inventario creado exitosamente",
      data: inventory
    });
  } catch (error) {
    console.error("Error al crear inventario:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear inventario",
      error: error.message
    });
  }
};

// Actualizar stock (aumentar o disminuir)
export const updateStock = async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { quantity } = req.body;
    const operation = Number(req.body.operation); // <-- convierte a número

    const inventory = await Inventory.findOne({ productId });

    if (!inventory) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    if (operation === 1) { // add
      inventory.quantity += quantity;
    } else if (operation === 2) { // subtract
      if (inventory.quantity < quantity) {
        return res.status(400).json({ success: false, message: "Stock insuficiente" });
      }
      inventory.quantity -= quantity;
    } else {
      return res.status(400).json({ success: false, message: "Operación no válida" });
    }

    inventory.updateStatus();
    await inventory.save();

    res.json({ success: true, message: "Stock actualizado", data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al actualizar stock" });
  }
};

// Verificar disponibilidad de stock 
export const checkStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.query;

    const inventory = await Inventory.findOne({ productId });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        available: false,
        message: "Producto no encontrado en inventario"
      });
    }

    const requestedQty = parseInt(quantity) || 1;
    const isAvailable = inventory.quantity >= requestedQty;

    res.json({
      success: true,
      available: isAvailable,
      currentStock: inventory.quantity,
      requestedQuantity: requestedQty,
      status: inventory.status
    });
  } catch (error) {
    console.error("Error al verificar stock:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar stock",
      error: error.message
    });
  }
};

// Obtener productos con stock bajo
export const getLowStock = async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lt: ["$quantity", "$minStock"] }
    }).sort({ quantity: 1 });

    res.json({
      success: true,
      count: lowStockItems.length,
      data: lowStockItems
    });
  } catch (error) {
    console.error("Error al obtener productos con stock bajo:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos con stock bajo",
      error: error.message
    });
  }
};

// Eliminar inventario
export const deleteInventory = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await Inventory.findOneAndDelete({ productId });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventario no encontrado"
      });
    }

    res.json({
      success: true,
      message: "Inventario eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error al eliminar inventario:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar inventario",
      error: error.message
    });
  }
};

/**
 * Descuenta stock de un producto.
 * @param {number} productId - ID del producto.
 * @param {number} quantity - Cantidad a descontar.
 * @returns {Promise<{success: boolean, message: string, data?: object}>}
 */
export async function discountStock(productId, quantity) {
  if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) {
    return { success: false, message: "Datos inválidos" };
  }

  const inventory = await Inventory.findOne({ productId });
  if (!inventory) {
    return { success: false, message: "Producto no encontrado" };
  }
  if (inventory.quantity === 0) {
    return { success: false, message: "Sin stock disponible" };
  }
  if (inventory.quantity < quantity) {
    return { success: false, message: `Stock insuficiente. Disponible: ${inventory.quantity}` };
  }

  inventory.quantity -= quantity;
  inventory.updateStatus && inventory.updateStatus();
  await inventory.save();

  return { success: true, message: "Stock descontado correctamente", data: inventory };
}

/* Endpoint para descontar stock */
export const discountStockEndpoint = async (req, res) => {
  const productId = Number(req.params.productId);
  const quantity = Number(req.body.quantity);

  const result = await discountStock(productId, quantity);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
};