//models/index.js
const Product = require('./product');
const Image = require('./image');
const Brand = require('./brand');
const Category = require('./category');
const User = require('./user');
const Cart = require('./cart');
const Token = require('./token');
const Favourite = require('./favourite');
const Order = require('./order');
const Order_product = require('./order_product');
const Order_delivery = require('./order_delivery');
const Product_quantity = require('./product_quantity');

Product.hasMany(Image, {foreignKey: 'product_id', as: 'Images'});
Image.belongsTo(Product, {foreignKey: 'product_id', as: 'Product'});

User.hasOne(Brand, {foreignKey: 'user_id'});
Brand.belongsTo(User, {foreignKey: 'user_id'});

Product.belongsTo(Category, {foreignKey: 'category_id'});
Category.hasMany(Product, {foreignKey: 'category_id'});

Product.belongsTo(Brand, {foreignKey: 'brand_id'});
Brand.hasMany(Product, {foreignKey: 'brand_id'});

Product.hasMany(Image, {foreignKey: 'product_id'});
Image.belongsTo(Product, {foreignKey: 'product_id'});

Category.hasMany(Category, {foreignKey: 'parent_id'});
Category.belongsTo(Category, {foreignKey: 'parent_id'});

User.hasOne(Cart, {foreignKey: 'user_id'});
Cart.belongsTo(User, {foreignKey: 'user_id'});

User.hasOne(Order, {foreignKey: 'user_id'});
Order.belongsTo(User, {foreignKey: 'user_id'});

Order_delivery.hasOne(Order, {foreignKey: 'delivery_id'});
Order.belongsTo(Order_delivery, {foreignKey: 'delivery_id'});

Order.hasMany(Order_product, {as: 'Order_product', foreignKey: 'order_id'});
Order_product.belongsTo(Order, {foreignKey: 'order_id'});

Order_product.belongsTo(Product, {foreignKey: 'product_id', as: 'Product'});
Product.hasMany(Order_product, {foreignKey: 'product_id', as: 'Order_product'});

Cart.belongsTo(Product, {foreignKey: 'product_id'});
Product.hasMany(Cart, {foreignKey: 'product_id'});

User.hasOne(Token, {foreignKey: 'user_id'});
Token.belongsTo(User, {foreignKey: 'user_id'});

User.hasMany(Favourite, {foreignKey: 'user_id'});
Favourite.belongsTo(User, {foreignKey: 'user_id'});

Product.hasMany(Favourite, {foreignKey: 'product_id'});
Favourite.belongsTo(Product, {foreignKey: 'product_id'});

Product.hasMany(Product_quantity, {foreignKey: 'product_id', as: 'Product_quantities'});
Product_quantity.belongsTo(Product, {foreignKey: 'product_id', as: 'Product'});

module.exports = {
    Product,
    Image,
    Brand,
    Category,
    User,
    Cart,
    Token,
    Favourite,
    Order,
    Order_product,
    Order_delivery,
    Product_quantity
};