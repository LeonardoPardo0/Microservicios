import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Cambiar 'mongodb' por 'localhost' cuando corres fuera de Docker
    const MONGO_URI = "mongodb://127.0.0.1:27017/";
    const DB_NAME = "inventorydb";

    await mongoose.connect(`${MONGO_URI}${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado - Base de datos: ${DB_NAME}`);
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;