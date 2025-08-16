const MongoClient = require("mongodb").MongoClient;
require('dotenv').config();

const init = async () => {
    const nativeClient = await MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

    const Configuration = nativeClient.db("transfi-nucleus").collection("configurations");
    const Order = nativeClient.db("transfi-nucleus").collection("orders");
    const User = nativeClient.db("transfi-nucleus").collection("users");
    const DraftUser = nativeClient.db("transfi-nucleus").collection("draft_users");
    const CurrencyConfig = nativeClient.db("transfi-nucleus").collection("currency_configs");
    const Webhook = nativeClient.db("transfi-nucleus").collection("webhooks");
    const PaymentMethod = nativeClient.db("transfi-nucleus").collection("payment_methods");

    global.Configuration = Configuration;
    global.Order = Order;
    global.User = User;
    global.DraftUser = DraftUser;
    global.CurrencyConfig = CurrencyConfig;
    global.Webhook = Webhook;
    global.PaymentMethod = PaymentMethod;

    const startJob1 = require('./scripts/onrampReport');
    const startJob2 = require('./scripts/offrampReport');
    //await startJob1();
    await startJob2();

    process.exit(0);
}

init();