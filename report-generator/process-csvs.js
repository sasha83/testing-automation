const util = require('util')
const fs = require("fs");
const { parse } = require("csv-parse");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let fieldString = [];
let lighthouseCSVimport = [];
let reportObject = {};
let reportCustomSources = [];
let reportHeaders = [];
let reportMappings = [];
let usedKeys = {}


function cleanTitles(title) {
    let theTitle;
    theTitle = title;
    theTitle = theTitle.replace(/[^a-z," "]/gi, '');
    return theTitle;
    // theTitle = theTitle.replaceAll('', '-');
}
function createMappings(key) {
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
function customSource(key) {
    let source = [];
    let prefix = '';
    key = key.replace('field_', '_');
    if(key!='title') { 
        prefix = 'field_';
    }

    source.push('  '+key+':');
    source.push('    value: ' + key);
    source.push('    label: ' + key);
    source.push('    machine_name: ' + key);
    source.push('    type: csv');
    return source;

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
}
fs.createReadStream("test.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    lighthouseCSVimport.push(row);
  }).on('end',function() {
    lighthouseCSVimport.forEach(function(r) {
        let key = r[3];
        key = key.replaceAll("-", "_");
        if(usedKeys[key]) {
            while(usedKeys[key]) {
                key=key+'_1';
            }    
        }
        usedKeys[key]= key;

        reportObject[key] = r[6];
        reportObject.requested_url = r[0];
        reportObject.final_url = r[1];

        let domain = (new URL(reportObject.final_url));
        reportObject.title = domain.hostname.replace('www.', '');

        reportHeaders.push({id: key, title: key});

        reportCustomSources = reportCustomSources.concat(customSource(key));
        reportMappings = reportMappings.concat(createMappings(key));

        
        fieldString.push(key);
        fieldString.push('|');
        fieldString.push(cleanTitles(r[4]));
        fieldString.push('|');
        fieldString.push(fieldType(r[5]));
        fieldString.push('\n');
    });
    
    reportCustomSources = reportCustomSources.concat(customSource('title'));
    reportMappings = reportMappings.concat(createMappings('title'));

    fs.writeFile('_custom-sources.txt', reportCustomSources.join('\n'), (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })

    fs.writeFile('_mappings.txt', reportMappings.join('\n'), (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })

    fs.writeFile('_fieldString.txt', fieldString.join(''), (err) => {
        // In case of a error throw err.
        if (err) throw err;
    })

    reportHeaders.push({id: 'title', title: 'title'});
    reportHeaders.push({id: 'requested_url', title: 'requested_url'});
    reportHeaders.push({id: 'final_url', title: 'final_url'});



    writeToCSV('_test-write-csv.csv', reportHeaders, [reportObject]);
  });
  


function writeToCSV(filename, headers, content) {
	const csvWriter = createCsvWriter({
		path: '/Users/alexandreswetlowski/testing-automation/report-generator/' + filename,
		header: headers,
	});
	csvWriter
		.writeRecords(content)
		.then(() => console.log('The CSV file was written successfully'));

}
