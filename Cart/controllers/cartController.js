const { json } = require('express');
const CartModel = require('../models/cartModel');
const fetch = require('node-fetch');

const getCartProducts = async (req, res) => {
    try {
        console.log("Fetching cart for user:", req.user.id);
        
        const cartProducts = await CartModel.find({ UserId: req.user.id });
        console.log("Cart products found:", cartProducts.length);
        
        if (cartProducts.length === 0) {
            return res.json({ Products: [], total: 0 });
        }

        const cartProductIds = [];
        cartProducts.forEach(cartProduct => {
            cartProductIds.push(cartProduct.ProductId);
        });

        console.log("Product IDs in cart:", cartProductIds);

        // Fetch product details from Product API (proper microservices approach)
        const productApiUrl = process.env.PRODUCT_API_URL || 'http://product:3002';
        const Products = [];
        let total = 0;
        
        try {
            // Fetch each product from Product service
            for (const productId of cartProductIds) {
                try {
                    const response = await fetch(`${productApiUrl}/products/${productId}`);
                    if (response.ok) {
                        const product = await response.json();
                        Products.push(product);
                        total += product.price;
                    } else {
                        console.log(`Product ${productId} not found in Product service`);
                    }
                } catch (fetchError) {
                    console.error(`Error fetching product ${productId}:`, fetchError);
                }
            }
        } catch (error) {
            console.error("Error fetching products from Product API:", error);
            return res.status(500).json({ error: "Failed to fetch product details" });
        }

        console.log("Products fetched from Product API:", Products.length);
        console.log("Total calculated:", total);
        res.json({Products, total});
    } catch (error) {
        console.error("Error fetching cart products:", error);
        res.status(500).json({ error: "Failed to fetch cart products" });
    }
}
const addCartProduct = async (req, res) => {
    try {
        console.log("Adding product to cart:", req.params.productid, "for user:", req.user.id);
        
        // Check if product exists by calling Product API
        const productApiUrl = process.env.PRODUCT_API_URL || 'http://product:3002';
        try {
            const productResponse = await fetch(`${productApiUrl}/products/${req.params.productid}`);
            if (!productResponse.ok) {
                console.log("Product not found:", req.params.productid);
                return res.status(404).json({ error: "Product not found" });
            }
        } catch (fetchError) {
            console.error("Error checking product existence:", fetchError);
            return res.status(500).json({ error: "Failed to verify product" });
        }

        // Check if product is already in cart
        const existingCartItem = await CartModel.findOne({
            UserId: req.user.id,
            ProductId: req.params.productid
        });

        if (existingCartItem) {
            console.log("Product already in cart");
            return res.json({ message: "Product already in cart", cartProduct: existingCartItem });
        }

        const cartProduct = await CartModel.create({
            UserId: req.user.id,
            ProductId: req.params.productid
        });

        console.log("Product added to cart successfully:", cartProduct);
        res.json(cartProduct);
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: "Failed to add product to cart" });
    }
}

const deleteCartProduct = async (req, res) => {
    const cartProduct = await CartModel.findOneAndDelete(
        {
            UserId: req.user.id,
            ProductId: req.params.productid
        }
    );
    res.json(cartProduct);  
}

const checkout = async (req, res) => {
    const cartProducts = await CartModel.deleteMany({ UserId: req.user.id });
    // console.log(cartProducts);
    let total = 0;
    res.json({cartProducts});

}

module.exports = {
    getCartProducts,
    addCartProduct,
    deleteCartProduct,
    checkout
}