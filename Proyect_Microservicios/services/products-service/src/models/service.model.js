import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'El stock no puede ser negativo']
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: ['electronics', 'clothing', 'food', 'books', 'other'],
        message: 'Categoría no válida'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model('Product', ProductSchema);
