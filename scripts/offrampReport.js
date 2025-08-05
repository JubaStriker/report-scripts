const { Order } = global;

const filter = {
    type: 'sell',
    // createdAt: {
    //     $gte: new Date("2025-08-01T00:00:00.000Z"),
    //     $lte: new Date(),
    // },
    // status: 'fund_settled'
    orderId: {
        $in: [
            "OR-250801025342516120",
            "OR-250801025244525276",
            "OR-250801025054010243",
            "OR-250801024439346333",
            "OR-250801024420313877",
            "OR-250801024157716789",
            "OR-250801022032114477",
            "OR-250801021531727926",
            "OR-250801021209656333",
            "OR-250801015250518895",
            "OR-250801012420686780",
            "OR-250801011550683860",
            "OR-250801011256493235",
            "OR-250801010629688602",
            "OR-250731234240299463",
            "OR-250731232818770691",
            "OR-250731230540978639",
            "OR-250731225114938849",
            "OR-250731225036135733",
            "OR-250731215241446187",
            "OR-250731202414532282",
            "OR-250731135647756143",
            "OR-250730024231014438",
            "OR-250729093702693917",
            "OR-250729093634628931",
            "OR-250729093236328302",
            "OR-250728044207748896",
            "OR-250724131647327434",
            "OR-250724131416025879"
        ]
    }
};

const startJob = async () => {
    const records = await Order.find(filter).toArray() || [];

    console.log("Filtered records length", records.length);

    const headers = [
        "_id",
        "orderId",
        "type",
        "fiatTicker",
        "cryptoTicker",
        "cryptoNetwork",
        "fiatAmount",
        "cryptoAmount",
        "cryptoUnitPrice",
        "totalFee",
        "fees.networkFee",
        "fees.processingFee",
        "fees.fixedFee.totalFixedFees",
        "fees.fixedFee.totalFixedTfFees",
        "fees.fixedFee.totalFixedCxFees",
        "fees.fixedFee.fixedFeesCurrency",
        "fees.fixedFee.fixedFeeDetails.baseFeeFixedRate",
        "fees.fixedFee.fixedFeeDetails.tfFeeFixedRate",
        "fees.fixedFee.fixedFeeDetails.cxFeeFixedRate",
        "fees.fixedFee.fixedFeeDetails.currency",
        "customer.formattedName",
        "customer.name",
        "customer.redirectUrl",
        "customer.entityName",
        "status",
        "userId",
        "orgId",
        "metaData.bankId",
        "metaData.cryptoName",
        "metaData.fiatName",
        "metaData.usdAmount",
        "metaData.walletAddressData.addr",
        "metaData.sendersWalletAddress",
        "paymentAccountNumber",
        "paymentName",
        "paymentType",
        "paymentFormattedName",
        "email",
        "userCountry",
        "partnerContext.userCode",
        "apiKey",
        "quoteId",
        "fiat.currency",
        "fiat.tfFee",
        "fiat.cxFee",
        "fiat.processingFee",
        "fiat.processingFeeRate",
        "fiat.tfFeeRate",
        "fiat.cxFeeRate",
        "fiat.discountRate",
        "fiat.xeRate",
        "fiat.conversionRate",
        "fiat.conversionRateWithoutMarkup",
        "fiat.conversionRateInEur",
        "fiat.kytFee",
        "fiat.markupFee",
        "fiat.discount",
        "fiat.additionalFees",
        "fiat.processingFeeMode",
        "fiat.feeAbstraction",
        "fiat.orderId",
        "fiat.partnerFee",
        "fiat.status",
        "crypto.currency",
        "crypto.partner",
        "crypto.orderAmount",
        "crypto.conversionRate",
        "crypto.depositId",
        "crypto.txnHash",
        "crypto.conversionFee",
        "crypto.convertedAmount",
        "timestamps.initiatedAt",
        "timestamps.assetSettledAt",
        "timestamps.fundProcessingAt",
        "timestamps.fundSettledAt",
        "sellCheckoutDetails.orderId",
        "sellCheckoutDetails.paymentAddress",
        "sellCheckoutDetails.redirectUrl",
        "deviceDetails.userAgent",
        "deviceDetails.acceptLang",
        "deviceDetails.deviceSignature",
        "deviceDetails.ipInfo.ip",
        "deviceDetails.ipInfo.lat",
        "deviceDetails.ipInfo.lon",
        "deviceDetails.ipInfo.countryCode3",
        "deviceDetails.coords.lat",
        "deviceDetails.coords.lon",
        "deviceDetails.coords.accuracy",
        "deviceDetails.address.country",
        "accountDetails.bankName",
        "accountDetails.iban",
        "accountDetails.bic",
        "accountDetails.street",
        "accountDetails.city",
        "accountDetails.postalCode",
        "accountDetails.currency",
        "accountDetails.userId",
        "accountDetails.type",
        "accountDetails.logo",
        "accountDetails.paymentName",
        "createdAt",
        "updatedAt",
        "__v",
        "pmsId",
        "error",
        "paymentGateway",
        "pmsError",
        "customer.paymentType",
        "partnerContext",
        "sellCheckoutDetails.depositType",
        "accountDetails.phone",
        "accountDetails.cryptoTicker",
        "accountDetails.phoneCode",
        "accountDetails.documentType",
        "accountDetails.documentNumber",
        "accountDetails.accountType",
        "accountDetails.accountNumber",
        "accountDetails.state",
        "accountDetails.bankCode",
        "accountDetails.pixKeyType",
        "accountDetails.pixKey",
        "customer.email",
        "accountDetails.dob",
        "accountDetails.bvn"
    ];

    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
        }, obj);
    }

    // Function to escape CSV values (handle commas, quotes, newlines)
    function escapeCsvValue(value) {
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
    }

    function processRecordsToCSV(records) {
        const csvRows = [];

        // Add header row
        csvRows.push(headers.map(header => escapeCsvValue(header)).join(','));

        // Process each record
        for (let i = 0; i < records.length; i++) {
            console.log(`Processing record ${i + 1}/${records.length}`);
            const order = records[i];

            // Extract values for each header
            const rowValues = headers.map(header => {
                const value = getNestedValue(order, header);
                return escapeCsvValue(value);
            });

            csvRows.push(rowValues.join(','));
        }

        return csvRows.join('\n');
    }

    // Function to download CSV file (for browser environment)
    function downloadCSV(csvContent, filename = 'orders_export.csv') {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Function to save CSV file (for Node.js environment)
    function saveCSVToFile(csvContent, filename = 'orders_export.csv') {
        const fs = require('fs');
        fs.writeFileSync(filename, csvContent, 'utf8');
        console.log(`CSV file saved as ${filename}`);
    }

    // Main execution function
    function exportOrdersToCSV(records) {
        console.log(`Starting CSV export for ${records.length} records...`);

        const csvContent = processRecordsToCSV(records);

        // For browser environment
        if (typeof window !== 'undefined') {
            downloadCSV(csvContent);
        }
        // For Node.js environment
        else if (typeof require !== 'undefined') {
            saveCSVToFile(csvContent);
        }
        // Return CSV content for manual handling
        else {
            console.log('CSV content generated. Use the returned string to save the file.');
            return csvContent;
        }
    }

    exportOrdersToCSV(records);

};

module.exports = startJob;