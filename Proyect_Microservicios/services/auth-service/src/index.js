/**
 * Auth Service
 * Servicio de autenticación: registro, login y validación JWT
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Conexión a MongoDB
connectDB();

// Rutas
app.use("/auth", authRoutes);

// Puerto
const PORT = process.env.PORT || 3000;

// Servidor
app.listen(PORT, () => {
  console.log(`🧍 Auth Service corriendo en el puerto ${PORT}`);
});
