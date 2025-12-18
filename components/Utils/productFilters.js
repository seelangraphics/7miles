// utils/productFilters.js

export const filterProducts = {
    // Get Best Sellers
    getBestSellers: (products) => {
        return products.filter(product => product.bestSeller === 'yes');
    },

    // Get Trending Products
    getTrending: (products) => {
        return products.filter(product => product.Trending === 'yes');
    },

    // Get New Products
    getNewProducts: (products) => {
        return products.filter(product => product.Newproducts === 'yes');
    },

    // Get Powder Products
    getPowderProducts: (products) => {
        return products.filter(product => product.powder === 'yes');
    },

    // Get Products by Category
    getByCategory: (products, category) => {
        return products.filter(product => product.category === category);
    },

    // Get All Products (for All Products tab)
    getAllProducts: (products) => {
        return products;
    }
};