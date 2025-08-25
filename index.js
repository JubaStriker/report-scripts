const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();

const init = async () => {
    const nativeClient = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

    const Order = nativeClient.db("transfi-nucleus").collection("orders");

    global.Order = Order;

    const startJob1 = require('./scripts/onrampReport');
    const startJob2 = require('./scripts/offrampReport');

    await startJob1();
    // await startJob2();

    process.exit(0);
}

init();