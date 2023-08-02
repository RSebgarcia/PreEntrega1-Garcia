import fs from 'fs';

class CartManager {
    constructor() {
        this.pathCarts = './public/storage/carts.json';
        this.pathProducts ='./public/storage/products.json';
    }

    async readCartsData() {
        try {
            const data = await fs.promises.readFile(this.pathCarts, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeCartsData(carts) {
        try {
            await fs.promises.writeFile(this.pathCarts, JSON.stringify(carts, null, '\t'));
        } catch (error) {
            console.error('Error writing carts data:', error);
        }
    }

    async createCart() {
        const carts = await this.readCartsData();
        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };
        carts.push(newCart);
        await this.writeCartsData(carts);
        return newCart;
    }

    async getCartById(cartId) {
        const carts = await this.readCartsData();
        return carts.find((c) => c.id === parseInt(cartId));
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.readCartsData();
        const products = await this.readProductsData();

        const cart = carts.find((c) => c.id === parseInt(cartId));
        const product = products.find((p) => p.id === parseInt(productId));

        if (!cart) {
            throw new Error(`Cart with id ${cartId} not found`);
        }

        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }

        const isInCart = cart.products.find((p) => p.id === parseInt(productId));
        if (!isInCart) {
            const addProduct = {
                id: product.id,
                quantity: 1
            };
            cart.products.push(addProduct);
        } else {
            const findProductIndex = cart.products.findIndex((p) => p.id === parseInt(productId));
            cart.products[findProductIndex].quantity = cart.products[findProductIndex].quantity + 1;
        }

        await this.writeCartsData(carts);
        return cart;
    }

    // Add any additional methods you need for managing carts here

    async readProductsData() {
        try {
            const data = await fs.promises.readFile(this.pathProducts, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }
}

export default CartManager;
