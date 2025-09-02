const { Order } = global;

const startJob = async () => {
    const result = await Order.updateMany(
        {
            type: "buy",
            "customer.formattedName": "binancep2p",
            createdAt: {
                $lte: new Date('2025-09-01T12:03:50.834+00:00'),
                $gte: new Date('2025-08-26T02:28:45.411+00:00')
            },
            'fiat.conversionRateWithoutMarkup': { $exists: 1 }
        },
        [
            {
                $set: {
                    "fiat.markupFee": {
                        $cond: [
                            {
                                $and: [
                                    { $ifNull: ["$fiat.conversionRate", false] },
                                    { $ifNull: ["$fiat.conversionRateWithoutMarkup", false] },
                                    { $gt: [{ $toDouble: "$fiat.conversionRateWithoutMarkup" }, 0] }
                                ]
                            },
                            {
                                $subtract: [
                                    {
                                        $divide: [
                                            { $toDouble: "$fiat.conversionRate" },
                                            { $toDouble: "$fiat.conversionRateWithoutMarkup" }
                                        ]
                                    },
                                    1
                                ]
                            },
                            null
                        ]
                    }
                }
            }
        ]
    );

    console.log(result);
};

module.exports = startJob;
