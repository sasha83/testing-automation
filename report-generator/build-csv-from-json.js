const util = require('util')
const fs = require("fs");
const { parse } = require("csv-parse");
const { report } = require('process');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let fieldString = [];
let lighthouseCSVimport = [];
let reportObject = {};
let reportCustomSources = [];
let reportHeaders = [];
let reportMappings = [];
let usedKeys = {}

const rawdata = fs.readFileSync('./test-reports/lighthouse-report-natalia-gill-1684601800425.json');
const data = JSON.parse(rawdata);
const reportObjectFromJSON = {};
const reportHeadersFromJSON = [];

// console.log(data['audits']);

Object.keys(data.audits).forEach(function(key) {
    // console.log(key, data.audits[key].score);
    reportObjectFromJSON[key] = data.audits[key].score;
});



reportObjectFromJSON.lighthouseVersion = data.lighthouseVersion;
reportObjectFromJSON.requestedUrl = data.requestedUrl;
reportObjectFromJSON.mainDocumentUrl = data.mainDocumentUrl;
reportObjectFromJSON.finalDisplayedUrl = data.finalDisplayedUrl;
reportObjectFromJSON.finalUrl = data.finalUrl;
reportObjectFromJSON.fetchTime = data.fetchTime;
reportObjectFromJSON.gatherMode = data.gatherMode;
reportObjectFromJSON.runWarnings = data.runWarnings;
reportObjectFromJSON.userAgent = data.userAgent;
reportObjectFromJSON.environment = JSON.stringify(data.environment);
reportObjectFromJSON.configSettings = JSON.stringify(data.configSettings);
reportObjectFromJSON.categories = JSON.stringify(data.categories);
reportObjectFromJSON.categoryGroups = JSON.stringify(data.categoryGroups);

let domain = (new URL(reportObjectFromJSON.finalUrl));
reportObjectFromJSON.title = domain.hostname.replace('www.', '');
reportObjectFromJSON.domain = domain.hostname.replace('www.', '');

Object.keys(reportObjectFromJSON).forEach(function(key){
    reportHeadersFromJSON.push({id: key, 'title': key});
});

// console.log(reportHeadersFromJSON);
// console.log(reportObjectFromJSON);

writeToCSV('_test-report-from-json.csv', reportHeadersFromJSON, [reportObjectFromJSON]);

// lighthouseVersion
// requestedUrl
// mainDocumentUrl
// finalDisplayedUrl
// finalUrl
// fetchTime
// gatherMode
// runWarnings
// userAgent
// environment
// audits
// configSettings
// categories
// categoryGroups
// stackPacks
// entities
// fullPageScreenshot
// timing
// i18n

let keys = [];
Object.keys(data).forEach(function(key) {
    // console.log(key, data[key]);
});


function processCSVs() {
    fs.createReadStream("www.nataliagill.com_blog-posts_3-major-benefits-to-eatong-solid-breakfast.mobile.report.csv")
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
          reportObject.domain = domain.hostname.replace('www.', '');
  
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
  
      // fs.writeFile('_custom-sources.txt', reportCustomSources.join('\n'), (err) => {
      //     // In case of a error throw err.
      //     if (err) throw err;
      // })
  
      // fs.writeFile('_mappings.txt', reportMappings.join('\n'), (err) => {
      //     // In case of a error throw err.
      //     if (err) throw err;
      // })
  
      // fs.writeFile('_fieldString.txt', fieldString.join(''), (err) => {
      //     // In case of a error throw err.
      //     if (err) throw err;
      // })
  
      reportHeaders.push({id: 'title', title: 'title'});
      reportHeaders.push({id: 'requested_url', title: 'requested_url'});
      reportHeaders.push({id: 'final_url', title: 'final_url'});
  
  
  
      // writeToCSV('_test-write-csv.csv', reportHeaders, [reportObject]);
      writeToCSV('_test-report-2.csv', reportHeaders, [reportObject]);
      
    });
}
  
// processCSVs();

function writeToCSV(filename, headers, content) {
	const csvWriter = createCsvWriter({
		path: '/Users/alexandreswetlowski/testing-automation/report-generator/' + filename,
		header: headers,
	});
	csvWriter
		.writeRecords(content)
		.then(() => console.log('The CSV file was written successfully'));

}
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
