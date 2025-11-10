const productModel = require('../models/productModel');

const categoryFilter = async (req, res) => {
    try {
        const { category } = req.params;
        
        if (!category || category.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Category is required',
                error: 'MISSING_CATEGORY'
            });
        }

        // Validate category exists in our enum
        const validCategories = ['Action', 'Adventure', 'Survival', 'Shooter', 'Simulation', 'Casual', 'Open World', 'Horror'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Valid categories: ${validCategories.join(', ')}`,
                error: 'INVALID_CATEGORY'
            });
        }

        const filteredProducts = await productModel.find({ category: category }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            message: `Found ${filteredProducts.length} products in ${category} category`,
            data: filteredProducts,
            category: category
        });
    } catch (error) {
        console.error('Error filtering by category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to filter products by category',
            error: error.message
        });
    }
};

const priceFilter = async (req, res) => {
    try {
        const { maxPrice } = req.params;
        
        if (!maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Maximum price is required',
                error: 'MISSING_PRICE'
            });
        }

        const price = parseFloat(maxPrice);
        if (isNaN(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price. Must be a positive number',
                error: 'INVALID_PRICE'
            });
        }

        const filteredProducts = await productModel.find({ 
            price: { $lte: price } 
        }).sort({ price: 1 });

        res.status(200).json({
            success: true,
            message: `Found ${filteredProducts.length} products under $${price}`,
            data: filteredProducts,
            maxPrice: price
        });
    } catch (error) {
        console.error('Error filtering by price:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to filter products by price',
            error: error.message
        });
    }
};

const priceRangeFilter = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.params;
        
        if (!minPrice || !maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Both minimum and maximum prices are required',
                error: 'MISSING_PRICE_RANGE'
            });
        }

        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price range. Both prices must be positive and min must be less than max',
                error: 'INVALID_PRICE_RANGE'
            });
        }

        const filteredProducts = await productModel.find({
            price: { $gte: min, $lte: max }
        }).sort({ price: 1 });

        res.status(200).json({
            success: true,
            message: `Found ${filteredProducts.length} products between $${min} - $${max}`,
            data: filteredProducts,
            priceRange: { min: min, max: max }
        });
    } catch (error) {
        console.error('Error filtering by price range:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to filter products by price range',
            error: error.message
        });
    }
};

const categoryPriceFilter = async (req, res) => {
    try {
        const { category, maxPrice } = req.params;
        
        if (!category || !maxPrice) {
            return res.status(400).json({
                success: false,
                message: 'Both category and maximum price are required',
                error: 'MISSING_PARAMETERS'
            });
        }

        // Validate category
        const validCategories = ['Action', 'Adventure', 'Survival', 'Shooter', 'Simulation', 'Casual', 'Open World', 'Horror'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Valid categories: ${validCategories.join(', ')}`,
                error: 'INVALID_CATEGORY'
            });
        }

        const price = parseFloat(maxPrice);
        if (isNaN(price) || price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid price. Must be a positive number',
                error: 'INVALID_PRICE'
            });
        }

        const filteredProducts = await productModel.find({
            category: category,
            price: { $lte: price }
        }).sort({ price: 1 });

        res.status(200).json({
            success: true,
            message: `Found ${filteredProducts.length} ${category} products under $${price}`,
            data: filteredProducts,
            filters: { category: category, maxPrice: price }
        });
    } catch (error) {
        console.error('Error filtering by category and price:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to filter products by category and price',
            error: error.message
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await productModel.distinct('category');
        
        res.status(200).json({
            success: true,
            message: 'Available categories retrieved',
            data: categories.sort()
        });
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve categories',
            error: error.message
        });
    }
};

module.exports = {
    categoryFilter,
    priceFilter,
    priceRangeFilter,
    categoryPriceFilter,
    getCategories
};