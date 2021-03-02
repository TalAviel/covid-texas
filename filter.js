const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');
const zipcodes = require('zipcodes');

const data = fs.readFileSync('./enriched_data.csv');



let records = parse(data, {
    columns: true,
    skip_empty_lines: true
});

console.log(records.length);

let hosts = new Set();

records = records.filter(record => {
   return (
       record.DISTANCE_FROM_78759 < 200
        && record.VACCINES_AVAILABLE > 0
       && record.WEBSITE !== ''
   )
});

// REMOVE duplicate websites
records = records.filter(record => {
    let isNewHost = !hosts.has(record.WEBSITE_HOST);
    hosts.add(record.WEBSITE_HOST);
    return (
        isNewHost
    )
});

console.log(records.length);

websites = records.map(r => r.WEBSITE);

console.log(websites);

// console.log(stringify([records[0]], {header: true}));


// assert.deepEqual(records, [{ key_1: 'value 1', key_2: 'value 2' }])
