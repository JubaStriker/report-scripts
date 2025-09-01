const { Order } = global;

const startJob = async () => {
    const result = await Order.updateMany(
        {
            type: "buy",
            createdAt: {
                $gte: new Date("2025-08-04T10:25:28.516Z"),
                $lte: new Date()
            },
            "customer.formattedName": { $nin: ['binancep2p'] }
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
