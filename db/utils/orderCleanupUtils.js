const Order = require('../models/Order'); // Assurez-vous que cette importation est correcte
const moment = require('moment');

const deleteExpiredOrders = async () => {
    try {
        const currentTime = moment().unix(); // Obtenez le temps actuel en secondes depuis l'époque Unix

        // Supprimez tous les ordres dont la date d'expiration est inférieure au temps actuel
        await Order.ERC1155Order.deleteMany({ expiry: { $lt: currentTime } });
        await Order.ERC721Order.deleteMany({ expiry: { $lt: currentTime } });

        console.log('Ordres expirés supprimés');
    } catch (err) {
        console.error('Erreur lors de la suppression des ordres expirés:', err);
    }
};

module.exports = {
    deleteExpiredOrders,
};
