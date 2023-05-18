const fs = require("fs");
const { parse } = require("csv-parse");
let lighthouseCSVimport = [];
let reportObject = {};
let reportHeaders = [];
let fieldString = [];
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
function fieldType(type) {
    let theType;
    theType = type.replace('numeric', 'number_decimal');
    theType = type.replace('binary', 'number_integer');
    theType = type.replace('notApplicable', 'text');
    theType = type.replace('informative', 'text');
    theType = type.replace('manual', 'text');
    return theType;
    // numeric
    // binary
    // notApplicable
    // informative
    // manual
}
fs.createReadStream("test.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    // console.log(row[3]);
    lighthouseCSVimport.push(row);
  }).on('end',function() {
    //do something with csvData
    // console.log(lighthouseCSVimport);
    lighthouseCSVimport.forEach(function(r) {
        // console.log();
        let key = r[3];
        key = key.replaceAll("-", "_");
        reportObject[key] = r[6];
        // console.log(reportObject);
        reportHeaders.push({id: key, title: key});
        fieldString.push(key);
        fieldString.push('|');
        fieldString.push(r[4]);
        fieldString.push('|');
        fieldString.push(fieldType(r[5]));
        fieldString.push('\n');
    });
    console.log(fieldString.join(''));
    writeToCSV('_test-write-csv.csv', reportHeaders, [reportObject]);
  });
  
//   lighthouseCSVimport.forEach(function(i){
//     console.log(i);
//   });


function writeToCSV(filename, headers, content) {
	const csvWriter = createCsvWriter({
		path: '/Users/alexandreswetlowski/testing-automation/report-generator/' + filename,
		header: headers,
	});
	csvWriter
		.writeRecords(content)
		.then(() => console.log('The CSV file was written successfully'));

}
// 	const data = content;

// 	csvWriter
// 		.writeRecords(data)
// 		.then(() => console.log('The CSV file was written successfully'));

// }
