import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const productsRouter = Router();
const productManager = new ProductManager();

productsRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getAllProducts(limit);
        res.send({ status: 'success', payload: products });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ status: 'Error', error: 'Failed to retrieve products' });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        if (!product) {
            res.status(404).send({ status: 'Error', error: `Product with id ${pid} not found, please try another.` });
        } else {
            res.status(200).send({ status: 'success', payload: product });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const { body } = req;
        const newProduct = await productManager.addProduct(body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

productsRouter.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedFields = req.body;
        const updatedProduct = await productManager.updateProduct(pid, updatedFields);
        res.status(200).json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const remainingProducts = await productManager.deleteProduct(pid);
        res.status(200).json({ status: 'success', payload: remainingProducts });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

export default productsRouter;
