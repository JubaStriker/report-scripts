const { Order } = global;

const filter = {
    type: 'buy',
    'timestamps.assetSettledAt': {
        $gte: new Date("2025-08-06T00:00:00.000Z"),
        $lt: new Date("2025-08-08T00:00:00.000Z")
    },
    status: 'asset_settled'
}

const startJob = async () => {
    const records = await Order.find(filter).toArray() || [];

    console.log("Filtered records length", records.length);

    const headers = [
        "_id", "orderId", "type", "fiatTicker", "cryptoTicker", "cryptoNetwork",
        "fiatAmount", "cryptoAmount", "cryptoUnitPrice", "totalFee",
        "fees.networkFee", "fees.processingFee", "fees.fixedFee.totalFixedFees",
        "fees.fixedFee.totalFixedTfFees", "fees.fixedFee.totalFixedCxFees",
        "fees.fixedFee.fixedFeesCurrency", "fees.fixedFee.fixedFeeDetails.baseFeeFixedRate",
        "fees.fixedFee.fixedFeeDetails.tfFeeFixedRate", "fees.fixedFee.fixedFeeDetails.cxFeeFixedRate",
        "fees.fixedFee.fixedFeeDetails.currency", "customer.formattedName", "customer.name",
        "customer.redirectUrl", "customer.entityName", "status", "userId", "orgId",
        "metaData.bankId", "metaData.cryptoName", "metaData.fiatName", "metaData.usdAmount",
        "metaData.walletAddressData.addr", "metaData.sendersWalletAddress", "paymentAccountNumber",
        "paymentName", "paymentType", "paymentFormattedName", "email", "userCountry",
        "partnerContext.userCode", "apiKey", "quoteId", "fiat.currency", "fiat.tfFee",
        "fiat.cxFee", "fiat.processingFee", "fiat.processingFeeRate", "fiat.tfFeeRate",
        "fiat.cxFeeRate", "fiat.discountRate", "fiat.xeRate", "fiat.conversionRate",
        "fiat.conversionRateWithoutMarkup", "fiat.conversionRateInEur", "fiat.kytFee",
        "fiat.markupFee", "fiat.discount", "fiat.additionalFees", "fiat.processingFeeMode",
        "fiat.feeAbstraction", "fiat.orderId", "fiat.partnerFee", "fiat.status",
        "crypto.currency", "crypto.partner", "crypto.orderAmount", "crypto.conversionRate",
        "crypto.depositId", "crypto.txnHash", "crypto.conversionFee", "crypto.convertedAmount",
        "timestamps.initiatedAt", "timestamps.assetSettledAt", "timestamps.fundProcessingAt",
        "timestamps.fundSettledAt", "sellCheckoutDetails.orderId", "sellCheckoutDetails.paymentAddress",
        "sellCheckoutDetails.redirectUrl", "deviceDetails.userAgent", "deviceDetails.acceptLang",
        "deviceDetails.deviceSignature", "deviceDetails.ipInfo.ip", "deviceDetails.ipInfo.lat",
        "deviceDetails.ipInfo.lon", "deviceDetails.ipInfo.countryCode3", "deviceDetails.coords.lat",
        "deviceDetails.coords.lon", "deviceDetails.coords.accuracy", "deviceDetails.address.country",
        "accountDetails.bankName", "accountDetails.iban", "accountDetails.bic", "accountDetails.street",
        "accountDetails.city", "accountDetails.postalCode", "accountDetails.currency",
        "accountDetails.userId", "accountDetails.type", "accountDetails.logo",
        "accountDetails.paymentName", "createdAt", "updatedAt", "__v", "pmsId", "error",
        "paymentGateway", "pmsError", "customer.paymentType", "partnerContext",
        "sellCheckoutDetails.depositType", "accountDetails.phone", "accountDetails.cryptoTicker",
        "accountDetails.phoneCode", "accountDetails.documentType", "accountDetails.documentNumber",
        "accountDetails.accountType", "accountDetails.accountNumber", "accountDetails.state",
        "accountDetails.bankCode", "accountDetails.pixKeyType", "accountDetails.pixKey",
        "customer.email", "accountDetails.dob", "accountDetails.bvn"
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