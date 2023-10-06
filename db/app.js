const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const Order = require('./models/Order');
const cron = require('node-cron');
const { createAndSaveOrder } = require('./utils/orderUtils');
const { fetchOrders } = require('./utils/orderQueryUtils');
const { deleteExpiredOrders } = require('./utils/orderCleanupUtils');
require('dotenv').config();

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = ['http://localhost:3000', 'https://forlootandglory.io'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || /^https:\/\/[\w-]+\.forlootandglory\.io$/.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

// Utilisez CORS avec les options
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// POST endpoint to create a new order
app.post('/orderbook/order', async (req, res) => {
    const { order, chainId, metadata } = req.body;
    if (!order) {
        return res.status(400).json({ error: 'order is undefined' });
    }

    if (!order || !order.signature) {
        return res.status(400).json({ error: 'Invalid order or signature missing' });
    }

    try {
        const savedOrder = await createAndSaveOrder(order, chainId, metadata);
        res.json({ success: true, order: savedOrder });
    } catch (error) {
        console.error('Error in POST /orderbook/order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route pour récupérer les ordres
app.get('/orderbook/orders', async (req, res) => {
    console.log('req.query', req.query);
    try {
        const orders = await fetchOrders(req.query);
        res.json({ orders });
    } catch (error) {
        console.error('Error in GET /orderbook/order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Planifiez une tâche pour s'exécuter tous les jours à minuit
cron.schedule('0 0 * * *', async () => {
    console.log('Exécution de la tâche de nettoyage des ordres expirés');
    await deleteExpiredOrders();
});

const startServer = () => {
    app.listen(8888, () => {
        console.log('Server running on http://localhost:8888/');
    });
};

// Exportez les fonctions ou objets que vous souhaitez utiliser dans d'autres fichiers
module.exports = {
    startServer,
    // ... autres exports si nécessaire ...
};
