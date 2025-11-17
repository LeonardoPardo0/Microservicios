import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const warehouseSchema = new mongoose.Schema({
  warehouseId: {
    type: Number,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  address: String
}, { timestamps: true });

const AutoIncrement = AutoIncrementFactory(mongoose);
warehouseSchema.plugin(AutoIncrement, { inc_field: "warehouseId" });

export default mongoose.model("Warehouse", warehouseSchema);