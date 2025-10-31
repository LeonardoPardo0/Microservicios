/**
 * Products Service
 * Gestión de productos (CRUD)
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/products.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Conexión DB
connectDB();

// Rutas
app.use("/products", productRoutes);

// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`📦 Products Service corriendo en el puerto ${PORT}`);
});
