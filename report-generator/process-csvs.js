const util = require('util')
const fs = require("fs");
const { parse } = require("csv-parse");
let lighthouseCSVimport = [];
let reportObject = {};
let reportHeaders = [];
let fieldString = [];
let reportMappings = [];
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
function cleanTitles(title) {
    let theTitle;
    theTitle = title;
    theTitle = theTitle.replace(/[^a-z," "]/gi, '');
    return theTitle;
    // theTitle = theTitle.replaceAll('', '-');
}
function createMappings(key) {
    // console.log('HERE!!!!!!!!!', key);
    let mapping = [];
    let prefix = '';
    key = key.replace('field_', '_');
    if(key!='title') { 
        prefix = 'field_';
    }

    mapping.push('  -');
    mapping.push('    target: ' + prefix + key.substring(0,26));
    mapping.push('    map:');
    mapping.push('      value: ' + key);
    mapping.push('    settings:');
    mapping.push('      language: null');
    mapping.push('    unique: {  }');

    return mapping;
}
function fieldType(type) {
    let theType = new String;
    theType = type;
    theType = theType.replaceAll('numeric', 'decimal');
    theType = theType.replaceAll('binary', 'integer');
    theType = theType.replaceAll('notApplicable', 'string');
    theType = theType.replaceAll('informative', 'string');
    theType = theType.replaceAll('manual', 'string');

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
        reportObject.requested_url = r[0];
        reportObject.final_url = r[1];

        let domain = (new URL(reportObject.final_url));
        reportObject.title = domain.hostname.replace('www.', '');
        // console.log('reportObject.title: ', reportObject.title);
        // console.log(reportObject);
        reportHeaders.push({id: key, title: key});


        reportMappings = reportMappings.concat(createMappings(key));


        // reportMappings.push('  -');
        // reportMappings.push('    target: field_' + key.substring(0,26));
        // reportMappings.push('    map:');
        // reportMappings.push('      value: ' + key);
        // reportMappings.push('    settings:');
        // reportMappings.push('      language: null');
        // reportMappings.push('    unique: {  }');

        
        fieldString.push(key);
        fieldString.push('|');
        fieldString.push(cleanTitles(r[4]));
        fieldString.push('|');
        fieldString.push(fieldType(r[5]));
        fieldString.push('\n');
    });
    

    reportMappings = reportMappings.concat(createMappings('title'));
    
    // console.log(util.inspect(reportMappings, { maxArrayLength: null }))

    console.log(reportMappings.join('\n'));

    reportHeaders.push({id: 'title', title: 'title'});
    reportHeaders.push({id: 'requested_url', title: 'requested_url'});
    reportHeaders.push({id: 'final_url', title: 'final_url'});



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
