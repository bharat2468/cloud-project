const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Product price cannot be negative']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxLength: [1000, 'Product description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true,
        enum: ['Action', 'Adventure', 'Survival', 'Shooter', 'Simulation', 'Casual', 'Open World', 'Horror'],
        message: 'Category must be one of: Action, Adventure, Survival, Shooter, Simulation, Casual, Open World, Horror'
    },
    image: {
        type: String,
        required: [true, 'Product image URL is required'],
        validate: {
            validator: function(v) {
                return /^(https?:\/\/)/.test(v);
            },
            message: 'Image must be a valid URL'
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create indexes for better performance
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);