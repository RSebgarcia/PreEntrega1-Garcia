import fs from 'fs';

class ProductManager {
    constructor() {
        this.path ='./public/storage/products.json';
    }

    async readProductsData() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async writeProductsData(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch (error) {
            console.error('Error writing products data:', error);
        }
    }

    async getAllProducts(limit) {
        const products = await this.readProductsData();
        return Number.isInteger(limit) ? products.slice(0, limit) : products;
    }

    async getProductById(productId) {
        const products = await this.readProductsData();
        return products.find((p) => p.id === parseInt(productId));
    }

    async addProduct(newProduct) {
        const products = await this.readProductsData();
        const codeExist = products.find((e) => e.code === newProduct.code);
        if (codeExist) {
            throw new Error(`This code is already being used`);
        }

        const fieldTypes = {
            price: 'number',
            status: 'boolean',
            title: 'string',
            description: 'string',
            code: 'string',
            stock: 'number',
            category: 'string'
        };

        for (const field in fieldTypes) {
            if (typeof newProduct[field] !== fieldTypes[field]) {
                throw new Error(`Field "${field}" must be type "${fieldTypes[field]}".`);
            }
        }

        if (products.length === 0) {
            newProduct.id = 1;
        } else {
            newProduct.id = products[products.length - 1].id + 1;
        }

        products.push(newProduct);
        await this.writeProductsData(products);
        return newProduct;
    }

    async updateProduct(productId, updatedFields) {
        const products = await this.readProductsData();
        const productIndex = products.findIndex((product) => product.id === parseInt(productId));

        if (productIndex === -1) {
            throw new Error(`Product with id ${productId} not found`);
        }

        const product = products[productIndex];

        for (const field in updatedFields) {
            if (field in product) {
                product[field] = updatedFields[field];
            }
        }

        await this.writeProductsData(products);
        return product;
    }

    async deleteProduct(productId) {
        const products = await this.readProductsData();
        const productIndex = products.findIndex((product) => product.id === parseInt(productId));

        if (productIndex === -1) {
            throw new Error(`Product with id ${productId} not found`);
        }

        products.splice(productIndex, 1);
        await this.writeProductsData(products);
        return products;
    }
}

export default ProductManager;
