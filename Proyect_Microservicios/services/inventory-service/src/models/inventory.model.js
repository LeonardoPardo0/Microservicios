import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    location: {
      type: Number,
    },
    status: {
      type: Number,
      enum: [1, 2, 3, 4], 
    },
    lastRestockDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Método para actualizar el estado según la cantidad
inventorySchema.methods.updateStatus = function () {
  if (this.quantity === 0) {
    this.status = 3;
  } else if (this.quantity <= 5) {
    this.status = 2;
  } else {
    this.status = 1;
  }
};

inventorySchema.pre("save", function (next) {
  this.updateStatus();
  next();
});

export default mongoose.model("Inventory", inventorySchema);