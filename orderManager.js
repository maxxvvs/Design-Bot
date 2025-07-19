const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, 'datenbank', 'orders.json');

const loadOrders = () => {
    try {
        if (!fs.existsSync(ordersFilePath)) {
            fs.writeFileSync(ordersFilePath, '[]', 'utf8');
        }
        const data = fs.readFileSync(ordersFilePath, 'utf8');
        const parsedData = JSON.parse(data);
        if (!Array.isArray(parsedData)) {
            console.error('[ERROR] In der "orders.json" ist kein Array. Setze es auf ein leeres Array zurück! Array: []');
            return [];
        }
        return parsedData;
    } catch (error) {
        console.error('[ERROR] Fehler beim Laden der Bestellungen:', error);
        return [];
    }
};

const saveOrders = (orders) => {
    try {
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), 'utf8');
    } catch (error) {
        console.error('[ERROR] Fehler beim Speichern der Bestellungen:', error);
    }
};

const addOrder = (order) => {
    const orders = loadOrders();
    if (orders.length >= process.env.LIMIT) {
        throw new Error(`Die Bestellliste ist voll (max. ${process.env.LIMIT} Bestellungen)!`);
    }
    orders.push({
        username: order.username,
        userid: order.userid,
        channelId: order.channelId,
        order: order.order,
        timestamp: new Date()
    });
    saveOrders(orders);
};

const removeOrderByUserId = (userid) => {
    const orders = loadOrders();
    const index = orders.findIndex(order => order.userid === userid);
    if (index === -1) {
        throw new Error(`Der Benutzer <@${userid}> befindet sich nicht auf der Bestellliste!`);
    }
    orders.splice(index, 1);
    saveOrders(orders);
};

const removeOrderByUsername = (username) => {
    const orders = loadOrders();
    const index = orders.findIndex(order => order.username === username);
    if (index === -1) {
        throw new Error(`${username} befindet sich nicht auf der Bestellliste!`);
    }
    orders.splice(index, 1);
    saveOrders(orders);
};

const getOrderByUserId = (userid) => {
    const orders = loadOrders();
    return orders.find(order => order.userid === userid);
};

const getOrderByUsername = (username) => {
    const orders = loadOrders();
    return orders.find(order => order.username === username);
};

const getAllOrders = () => {
    return loadOrders();
};

module.exports = {
    addOrder,
    removeOrderByUserId,
    removeOrderByUsername,
    getOrderByUserId,
    getOrderByUsername,
    getAllOrders
};
