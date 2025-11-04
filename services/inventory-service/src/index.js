/**
 * Inventory Service
 * Control de inventario y stock
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import inventoryRoutes from "./routes/inventory.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.use("/inventory", inventoryRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`🏬 Inventory Service corriendo en el puerto ${PORT}`);
});
