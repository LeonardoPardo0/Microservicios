/**
 * Orders Service
 * Gestión de órdenes (creación, consulta, actualización)
 */

import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import orderRoutes from "./routes/orders.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🧾 Orders Service corriendo en el puerto ${PORT}`);
});
