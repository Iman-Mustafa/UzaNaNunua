const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/productController');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getProducts)
  .post(upload.single('image'), createProduct);

module.exports = router;
