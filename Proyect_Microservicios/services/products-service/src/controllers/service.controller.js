import Product from '../models/service.model.js';

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los productos',
      error: error.message,
    });
  }
};

// Obtener producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el producto',
      error: error.message,
    });
  }
};

// Crear nuevo producto
export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    // Validación mínima
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'El nombre y el precio son obligatorios',
      });
    }

    const product = new Product(req.body);
    const savedProduct = await product.save();

    return res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: savedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message,
    });
  }
};

// Actualizar producto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // asegura validaciones del esquema
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error al actualizar el producto',
      error: error.message,
    });
  }
};

// Eliminar producto (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el producto',
      error: error.message,
    });
  }
};
