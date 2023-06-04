const { exec } = require("child_process");
// let jsonDiff = require('json-diff');

const timeStamp = Date.now();

exec("lighthouse https://www.nataliagill.com/ --output-path=./report-anappetiteforjoy-"+timeStamp+".json --output json", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});




// import { diffString, diff } from 'json-diff';
// import * as fs from 'fs';

// // const { exec } = require("child_process");


// const reportFileNameA = './report-anappetiteforjoy-1684107344897.json';
// import reportA from './report-anappetiteforjoy-1684107344897.json' assert { type: 'json' };

// const reportFileNameB = './report-anappetiteforjoy-1684107376386.json';
// import reportB from './report-anappetiteforjoy-1684107376386.json' assert { type: 'json' };

// // console.log(jsonDiff.diffString(reportA, reportB));

// // const diff = jsonDiff.diffString({test1: 2}, {test1: 1});
// const diffAB = diff(reportA, reportB, {});

// fs.writeFile('test.txt', diffAB, err => {
//     if (err) {
//       console.error(err);
//     }
//     // file written successfully
// });
  
