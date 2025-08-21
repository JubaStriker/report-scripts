const { Order } = global;

const startJob = async () => {
    const result = await Order.updateMany(
        {
            type: "buy",
            createdAt: {
                $gte: new Date("2025-08-04T10:25:28.516Z"),
                $lte: new Date()
            },
            "customer.formattedName": { $nin: ['binance_prod', 'binancep2p'] }
        },
        [
            {
                $set: {
                    "metaData.usdAmount": {
                        $cond: [
                            {
                                $and: [
                                    { $ifNull: ["$fiat.conversionRate", false] },
                                    { $gt: [{ $toDouble: "$fiat.conversionRate" }, 0] }
                                ]
                            },
                            {
                                $divide: [
                                    { $toDouble: "$fiatAmount" },
                                    { $toDouble: "$fiat.conversionRate" }
                                ]
                            },
                            "$metaData.usdAmount"
                        ]
                    }
                }
            }
        ]
    );

    console.log(result);
};

module.exports = startJob;