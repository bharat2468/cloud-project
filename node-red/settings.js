/**
 * Node-RED Configuration for E-Commerce Application
 */
module.exports = {
    // Web Server Settings
    uiPort: process.env.PORT || 1880,
    
    
    
    // Enable projects for version control
    editorTheme: {
        projects: {
            enabled: true
        },
        palette: {
            editable: true
        }
    },
    
    // Function timeout
    functionGlobalContext: {
        // E-Commerce API endpoints
        USER_API: "http://user:3001",
        PRODUCT_API: "http://product:3002", 
        CART_API: "http://cart:3003"
    },
    
    // Logging
    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false
        }
    },
    
    // Export settings
    exportGlobalContextKeys: false
};