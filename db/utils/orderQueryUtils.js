const Order = require('../models/Order'); // Assurez-vous que cette importation est correcte

const mapOrderToFront = (order, nftType) => {
    let orderToReturn;
    if (nftType === 'ERC1155') {
        orderToReturn = {
            order: {
                direction: order.direction,
                erc20Token: order.erc20Token,
                erc20TokenAmount: order.erc20TokenAmount,
                erc1155Token: order.erc1155Token,
                erc1155TokenAmount: order.erc1155TokenAmount,
                erc1155TokenId: order.erc1155TokenId,
                erc1155TokenProperties: order.erc1155TokenProperties,
                expiry: order.expiry,
                fees: order.fees,
                maker: order.maker,
                nonce: order.nonce,
                signature: order.signature,
                taker: order.taker,
            },
            chainId: order.chainId,
            metadata: order.metadata,
            nftToken: order.erc1155Token,
            erc20Token: order.erc20Token,
            erc20TokenAmount: order.erc20TokenAmount,
            nftTokenAmount: order.erc1155TokenAmount,
            nftTokenId: order.erc1155TokenId,
            nftType: 'ERC1155',
            sellOrBuyNft: order.sellOrBuyNft,
        };
        return orderToReturn;
    } else if (nftType === 'ERC721') {
        orderToReturn = {
            order: {
                direction: order.direction,
                erc20Token: order.erc20Token,
                erc20TokenAmount: order.erc20TokenAmount,
                erc721Token: order.erc721Token,
                erc721TokenId: order.erc721TokenId,
                erc721TokenProperties: order.erc721TokenProperties,
                expiry: order.expiry,
                fees: order.fees,
                maker: order.maker,
                nonce: order.nonce,
                signature: order.signature,
                taker: order.taker,
            },
            chainId: order.chainId,
            metadata: order.metadata,
            nftToken: order.erc721Token,
            erc20Token: order.erc20Token,
            erc20TokenAmount: order.erc20TokenAmount,
            nftTokenAmount: 1,
            nftTokenId: order.erc721TokenId,
            nftType: 'ERC721',
            sellOrBuyNft: order.sellOrBuyNft,
        };
        return orderToReturn;
    }
};

const fetchOrders = async (queryParameters) => {
    try {
        const DEFAULT_OFFSET = 0;
        const DEFAULT_LIMIT = 10;
        const MAX_LIMIT = 200;

        let query = { ...queryParameters };
        let offset = parseInt(query.offset) || DEFAULT_OFFSET;
        let limit = Math.min(parseInt(query.limit) || DEFAULT_LIMIT, MAX_LIMIT);

        delete query.offset;
        delete query.limit;

        // Convertir les filtres de chaîne en objets
        if (query.filters) {
            const filters = JSON.parse(query.filters);
            for (const [key, value] of Object.entries(filters)) {
                if (typeof value === 'object' && (value.gte !== undefined || value.lte !== undefined)) {
                    query[`metadata.${key}`] = {};
                    if (value.gte !== undefined) {
                        query[`metadata.${key}`].$gte = value.gte;
                    }
                    if (value.lte !== undefined) {
                        query[`metadata.${key}`].$lte = value.lte;
                    }
                } else {
                    query[`metadata.${key}`] = value;
                }
            }
            delete query.filters;
        }

        Object.entries(query).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                query[key] = { $in: value };
            }
        });

        let orders;
        let nftType = query.nftType === 'ERC721' ? 'erc721' : 'erc1155';

        // Gérer le cas où nftTokenIds est fourni
        if (query.nftTokenIds) {
            // Décoder le paramètre nftTokenIds
            const decodedTokenIds = decodeURIComponent(query.nftTokenIds);

            // Convertir la chaîne décodée en tableau
            const tokenIdsArray = decodedTokenIds.split(',');

            // Utiliser le tableau pour filtrer les ordres
            query[`${nftType}TokenId`] = { $in: tokenIdsArray };
            delete query.nftTokenIds;
        }

        if (queryParameters.nftTokenId) {
            query[`${nftType}TokenId`] = queryParameters.nftTokenId;
            delete query.nftTokenId;
        }
        if (queryParameters.nftToken) {
            query[`${nftType}Token`] = queryParameters.nftToken;
            delete query.nftToken;
        }

        delete query.nftType;

        orders = await Order[`${nftType.toUpperCase()}Order`]
            .find(query)
            .skip(offset)
            .limit(limit)
            .exec();

        return orders.map(order => mapOrderToFront(order, nftType.toUpperCase()));

    } catch (error) {
        console.error('Error fetching the orders:', error);
        throw error;
    }
};


module.exports = {
    fetchOrders,
};