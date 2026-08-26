const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    image: {
      type: String, // Cloudinary URL
      required: [true, 'Please add an image'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    // seller: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User',
    // },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
