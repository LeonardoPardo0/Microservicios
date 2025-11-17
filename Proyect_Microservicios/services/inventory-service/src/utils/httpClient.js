import axios from "axios";

const PRODUCTS_SERVICE_URL = process.env.PRODUCTS_SERVICE_URL || "http://products-service:3001";

/**
 * Valida si un producto existe en Products Service
 * @param {string} productId - ID del producto
 * @returns {Promise<boolean>}
 */
export const validateProduct = async (productId) => {
  try {
    const response = await axios.get(`${PRODUCTS_SERVICE_URL}/products/${productId}`);
    return response.status === 200 && response.data.success;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    }
    console.error("Error validando producto:", error.message);
    throw new Error("Error al comunicarse con Products Service");
  }
};

/**
 * Obtiene información de un producto
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>}
 */
export const getProductInfo = async (productId) => {
  try {
    const response = await axios.get(`${PRODUCTS_SERVICE_URL}/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo información del producto:", error.message);
    return null;
  }
};