const express = require('express');
const productModel = require('../models/productModel');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const getProducts = async (req, res) => {
    try {
        const products = await productModel.find().sort({ createdAt: -1 });
        
        if (!products || products.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No products found',
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: `Found ${products.length} products`,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID format',
                error: 'INVALID_PRODUCT_ID'
            });
        }

        const product = await productModel.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
                error: 'PRODUCT_NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product found',
            data: product
        });
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
            error: error.message
        });
    }
};

const getProductByName = async (req, res) => {
    try {
        const { name } = req.params;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Product name is required',
                error: 'MISSING_PRODUCT_NAME'
            });
        }

        const products = await productModel.find({ 
            name: { $regex: name.trim(), $options: 'i' } 
        });
        
        if (!products || products.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No products found with name containing: ${name}`,
                error: 'PRODUCT_NOT_FOUND'
            });
        }

        res.status(200).json({
            success: true,
            message: `Found ${products.length} products`,
            data: products
        });
    } catch (error) {
        console.error('Error fetching product by name:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search products',
            error: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, image } = req.body;

        // Basic validation
        if (!name || !price || !description || !category || !image) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (name, price, description, category, image)',
                error: 'MISSING_REQUIRED_FIELDS'
            });
        }

        const product = await productModel.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: error.message
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Product with this name already exists',
                error: 'DUPLICATE_PRODUCT'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create product',
            error: error.message
        });
    }
};

const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required',
                error: 'MISSING_SEARCH_QUERY'
            });
        }

        const products = await productModel.find({
            $or: [
                { name: { $regex: q.trim(), $options: 'i' } },
                { description: { $regex: q.trim(), $options: 'i' } }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: `Found ${products.length} products matching: ${q}`,
            data: products,
            searchQuery: q
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search products',
            error: error.message
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductByName,
    createProduct,
    searchProducts
};
