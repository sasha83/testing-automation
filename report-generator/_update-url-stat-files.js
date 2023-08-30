const fs = require("fs");

const rawdata = fs.readFileSync('./_urls.json');

const data = JSON.parse(rawdata);

console.log('data: ', data.length);

data.forEach(function (e) {
        console.log(e);
});

