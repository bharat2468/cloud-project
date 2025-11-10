const express = require('express');
const router = express.Router();
const {
    categoryFilter,
    priceFilter,
    priceRangeFilter,
    categoryPriceFilter,
    getCategories
} = require("../controllers/filterController");

// Get available categories
router.get("/categories", getCategories);

// Filter by category
router.get("/category/:category", categoryFilter);

// Filter by maximum price
router.get("/price/:maxPrice", priceFilter);

// Filter by price range
router.get("/price/:minPrice/:maxPrice", priceRangeFilter);

// Filter by category and maximum price
router.get("/category/:category/price/:maxPrice", categoryPriceFilter);

module.exports = router;