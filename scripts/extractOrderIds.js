const fs = require('fs');
const csv = require('csv-parser');

const orderIds = [];

fs.createReadStream('orders.csv') // <-- change to your CSV filename
    .pipe(csv())
    .on('data', (row) => {
        if (row['Order Id']) {
            orderIds.push(row['Order Id']);
        }
    })
    .on('end', () => {
        fs.writeFileSync('order_ids.json', JSON.stringify(orderIds, null, 2));
        console.log('Order IDs extracted to order_ids.json');
    });
