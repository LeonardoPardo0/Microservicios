import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB connection error:", err));

// Rutas
app.use("/api/auth", authRoutes);

// Iniciar servicio
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));

