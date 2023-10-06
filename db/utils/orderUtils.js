const { ethers } = require('ethers');
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/Order'); // Assurez-vous que cette importation est correcte

const createAndSaveOrder = async (order, chainId, metadata) => {
    try {

        const erc721Token = order.erc721Token;
        const erc1155Token = order.erc1155Token;

        let OrderToSave;
        if (erc721Token) {
            // adapter order à la structure du schéma
            OrderToSave = {
                direction: order.direction,
                maker: order.maker,
                taker: order.taker,
                expiry: order.expiry,
                nonce: order.nonce,
                erc20Token: order.erc20Token,
                erc20TokenAmount: order.erc20TokenAmount,
                fees: order.fees,
                erc721Token: order.erc721Token,
                erc721TokenId: order.erc721TokenId,
                erc721TokenProperties: order.erc721TokenProperties,
                signature: order.signature,
                sellOrBuyNft: order.direction === 0 ? 'sell' : 'buy',
                chainId: chainId,
                metadata: metadata ? metadata : {},
            }

            orderModel = new Order.ERC721Order(OrderToSave);
        } else if (erc1155Token) {
            // adapter order à la structure du schéma
            OrderToSave = {
                direction: order.direction,
                maker: order.maker,
                taker: order.taker,
                expiry: order.expiry,
                nonce: order.nonce,
                erc20Token: order.erc20Token,
                erc20TokenAmount: order.erc20TokenAmount,
                fees: order.fees,
                erc1155Token: order.erc1155Token,
                erc1155TokenId: order.erc1155TokenId,
                erc1155TokenProperties: order.erc1155TokenProperties,
                erc1155TokenAmount: order.erc1155TokenAmount,
                signature: order.signature,
                sellOrBuyNft: order.direction === 0 ? 'sell' : 'buy',
                chainId: chainId,
                metadata: metadata,
            }

            orderModel = new Order.ERC1155Order(OrderToSave);

            console.log('OrderToSave', orderModel);
        } else {
            throw new Error('Invalid NFT type');
        }

        return await orderModel.save();
    } catch (error) {
        console.error('Error saving the order:', error);
        throw error;
    }
};

module.exports = {
    createAndSaveOrder,
};
