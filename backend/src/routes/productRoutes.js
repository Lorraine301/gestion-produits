const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');

// /api/products
router.route('/').get(getProducts).post(createProduct);

// /api/products/categories — déclarée avant /:id pour éviter que "categories"
// soit interprété comme un identifiant de produit
router.route('/categories').get(getCategories);

// /api/products/:id
router
  .route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
