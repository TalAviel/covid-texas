const parse = require('csv-parse/lib/sync');
const stringify = require('csv-stringify/lib/sync');
const fs = require('fs');
const zipcodes = require('zipcodes');

const data = fs.readFileSync('./data.csv');

const AUSTIN_ZIPCODE = 78759;


const records = parse(data, {
    columns: true,
    skip_empty_lines: true
});

for (let line of records) {
    const zip = line.ZIP;
    if (!zip || zip.length !== 5) {
        console.warn(`Skipping invalid zipcode ${zip}`);
        continue;
    }
    const zipCodeData = zipcodes.lookup(zip);
    if (!zipCodeData) {
        console.warn(`Skipping invalid zipcode ${zip}`);
        continue;
    }
    const {latitude, longitude} = zipCodeData;
    const distanceFromAustin = zipcodes.distance(zip, AUSTIN_ZIPCODE);

    line['LATITUDE'] = latitude;
    line['LONGITUDE'] = longitude;
    line['DISTANCE_FROM_78759'] = distanceFromAustin;
    line['WEBSITE_HOST'] = line.WEBSITE;

    if (line.WEBSITE) {
        try {
            const webSiteURL = new URL(line.WEBSITE);
            line['WEBSITE_HOST'] = webSiteURL.host;
        } catch (e) {

        }
    }


    // console.log(line);
}

// console.log(stringify([records[0]], {header: true}));
const enrichedCSV = stringify(records, {header: true});

fs.writeFileSync('enriched_data.csv', enrichedCSV);


// assert.deepEqual(records, [{ key_1: 'value 1', key_2: 'value 2' }])
