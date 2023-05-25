
const util = require('util')
const fs = require("fs");
const { readFile } = require('fs/promises')
const { report } = require('process');
const { parse } = require("csv-parse");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let fieldString = [];

let lighthouseCSVimport = [];
let reportObject = {};
let reportCustomSources = [];
let reportHeaders = [];
let reportMappings = [];
let usedKeys = {}
const outFolder = '../sites/default/files/_lighthouse_report_staging';
const inFolder = './lighthouse';











// console.log(fs.readdirSync(inFolder));
// let testFolderPaths = fs.readdirSync(inFolder);
// testFolderPaths.forEach(function(dir){
//     console.log(dir, fs.existsSync('./'+dir));    
      
// });
// fs.existsSync("./directory-name")

// fs.readdirSync(inFolder).forEach(file => {
//     // console.log(file);
//     // console.log(file, fs.existsSync('./'+file));    
//     console.log("dirent.isDirectory('./'+file'): ", dirent.isDirectory('./'+file));
//     if(fs.existsSync('./'+file)==false) {
//         console.log(inFolder+'/'+file, fs.existsSync(inFolder+'/'+file));    
//     }
// });
let processQueue = [];
fs.readdirSync(inFolder).forEach(file => {

    // console.log(fs.lstatSync("./lighthouse/"+file).isDirectory() );

    // fs.access("./lighthouse/"+file, function(error) {
    //     if (error) {
    //       console.log("Directory does not exist.", file)
    //     } else {
    //       console.log("Directory exists.", file)
    //     }
    //   })
    let lhReportPath = "./lighthouse/"+file;
    if(fs.lstatSync(lhReportPath).isDirectory()) {
        // processQueue.push(lhReportPath);
        fs.readdirSync(lhReportPath).forEach(filename => {
            processQueue.push(lhReportPath+"/"+filename);
        });
    }
    
});
  
// console.log(processQueue);

// report-generator/_pre_lh-report-feed-yml.txt
// ../sites/default/files/sync/feeds.feed_type.lighthouse_report_import.yml
// let preYMLFile = "_pre_lh-report-feed-yml.txt";
// let outputYMLFile = "../sites/default/files/sync/feeds.feed_type.lighthouse_report_import.yml";

// const rawdata = fs.readFileSync('./test-reports/_lighthouse-report-template-example.json');
// const data = JSON.parse(rawdata);
let reportObjectFromJSON = {};
let reportHeadersFromJSON = [];
let reportTitlesFromJSON = [];
let reportBasedFields = [];
let reportMappingsFromJSON = [];
let reportCustomSourcesFromJSON = [];

let outfile = 0;
// console.log(processQueue);
processQueue.forEach(function(lhJSONFilename){
    reportObjectFromJSON = {};
    reportHeadersFromJSON = [];
    reportBasedFields = [];
    var outFileName = lhJSONFilename.substring(lhJSONFilename.lastIndexOf('/')+1);
    outFileName = outFileName.replace('.json', '.csv');
    
    // console.log('filename: ', outFileName);
    
    if(lhJSONFilename.indexOf('.json')>-1) {

        const rawdata = fs.readFileSync(lhJSONFilename);
        console.log(lhJSONFilename, rawdata);
        const data = JSON.parse(rawdata);
    
        // add attributes from data.audits object
        Object.keys(data.audits).forEach(function(key) {
            // console.log(key);
            // if(key=='is-on-https') {
                let fieldTypeFromJSON = data.audits[key].scoreDisplayMode;

                if(fieldTypeFromJSON=="string") {
                    reportObjectFromJSON[key] = String(data.audits[key].score);
                } else if (fieldTypeFromJSON=="integer") {
                    reportObjectFromJSON[key] = parseInt(data.audits[key].score);
                } else if (fieldTypeFromJSON=="informative") {
                    reportObjectFromJSON[key] = JSON.stringify(data.audits[key].details);
                } else {
                    reportObjectFromJSON[key] = data.audits[key].score;
                }
                // console.log(data.audits[key].score, reportObjectFromJSON[key]);
                reportBasedFields.push({'machine_name': key, 'title': cleanTitles(data.audits[key].title), 'type': fieldType(fieldTypeFromJSON)});
            // }
            
            
        });
    






        // add attributes that aren't in the data.audits object
        reportObjectFromJSON.lighthouse_version = data.lighthouseVersion;
        reportObjectFromJSON.requested_url = data.requestedUrl;
        reportObjectFromJSON.main_document_url = data.mainDocumentUrl;
        reportObjectFromJSON.final_displayed_url = data.finalDisplayedUrl;
        reportObjectFromJSON.final_url = data.finalUrl;
        reportObjectFromJSON.fetch_time = data.fetchTime;
        reportObjectFromJSON.gather_mode = data.gatherMode;
        reportObjectFromJSON.run_warnings = JSON.stringify(data.runWarnings);
        reportObjectFromJSON.user_agent = data.userAgent;
        reportObjectFromJSON.environment = JSON.stringify(data.environment);
        reportObjectFromJSON.config_settings = JSON.stringify(data.configSettings);
        reportObjectFromJSON.categories = JSON.stringify(data.categories);
        reportObjectFromJSON.category_groups = JSON.stringify(data.categoryGroups);
        let domain = (new URL(reportObjectFromJSON.final_url));
        // reportObjectFromJSON.title = domain.hostname.replace('www.', '');
        reportObjectFromJSON.title = data.requestedUrl;
        reportObjectFromJSON.domain = domain.hostname.replace('www.', '');
    
        reportBasedFields.push({'machine_name': 'lighthouse_version', 'title': 'Lighthouse Version', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'requested_url', 'title': 'Requested URL', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'main_document_url', 'title': 'Main Document URL', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'final_displayed_url', 'title': 'Final Displayed URL', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'final_url', 'title': 'Final URL', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'fetch_time', 'title': 'Fetch Time', 'type': 'string'});  //temp using string.  need to import as a date eventually (soon).
        reportBasedFields.push({'machine_name': 'gather_mode', 'title': 'Gather Mode', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'run_warnings', 'title': 'Run Warnings', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'user_agent', 'title': 'User Agent', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'environment', 'title': 'Environment', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'config_settings', 'title': 'Config Settings', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'categories', 'title': 'Categories', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'category_groups', 'title': 'Category Groups', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'title', 'title': 'Title', 'type': 'string'});
        reportBasedFields.push({'machine_name': 'domain', 'title': 'Domain', 'type': 'string'});
    






    
        // console.log('reportObjectFromJSON: ', reportObjectFromJSON);
        // build the Quick Add Fields config
    
        // let reportOutputForCSV = {};
        reportBasedFields.forEach(function(reportField){
            reportHeadersFromJSON.push({id: reportField.machine_name, title: reportField.machine_name.replace(new RegExp("-", "g"), '_')})
            // fieldStringNew.push(reportField.machine_name.replace(new RegExp("-", "g"), '_')+'|'+reportField.title+'|'+reportField.type);
        });
        console.log(reportObjectFromJSON);
        writeToCSV(outFolder+'/'+outFileName, reportHeadersFromJSON, [reportObjectFromJSON]);
        // outputCSV
        outfile++;
    }

});
// Object.keys(reportObjectFromJSON).forEach(function(key){
    // console.log('console.log(key, reportBasedFields[key]); ', key, reportBasedFields[key]);
    // fieldStringNew.push(reportBasedFields[key].machine_name);
    // fieldStringNew.push('|');
    // fieldStringNew.push(reportBasedFields[key].title);
    // fieldStringNew.push('|');
    // fieldStringNew.push(reportBasedFields[key].type);







    // console.log(key);
    // fieldString.push(key);
    // fieldString.push('|');
    // fieldString.push(cleanTitles(r[4]));
    // fieldString.push('|');
    // fieldString.push(fieldType(r[5]));
    // fieldString.push('\n');


    // fieldString.push(key);
    // fieldString.push('|');
    // fieldString.push(cleanTitles(r[4]));
    // fieldString.push('|');
    // fieldString.push(fieldType(r[5]));
    // fieldString.push('\n');

    // reportCustomSourcesFromJSON = reportCustomSourcesFromJSON.concat(customSource(key));
    // reportMappingsFromJSON = reportMappingsFromJSON.concat(createMappings(key));
// });





// // build CSV headers
// Object.keys(reportObjectFromJSON).forEach(function(key){
//     reportHeadersFromJSON.push({id: key, 'title': key});
// });
// // dump to random file for now.
// writeToCSV('_test-report-from-json.csv', reportHeadersFromJSON, [reportObjectFromJSON]);












function processCSVs() {
    fs.createReadStream("www.nataliagill.com_blog-posts_3-major-benefits-to-eatong-solid-breakfast.mobile.report.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
      lighthouseCSVimport.push(row);
    }).on('end',function() {
      lighthouseCSVimport.forEach(function(r) {
          let key = r[3];
        //   console.log(key);
          key = key.replace(new RegExp("-", "g"), '_');
          
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
  
    //   reportHeaders.push({id: 'title', title: 'title'});
    //   reportHeaders.push({id: 'requested_url', title: 'requested_url'});
    //   reportHeaders.push({id: 'final_url', title: 'final_url'});
  
  
  
      // writeToCSV('_test-write-csv.csv', reportHeaders, [reportObject]);
    //   writeToCSV('_test-report-2.csv', reportHeaders, [reportObject]);
      
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
    key = key.replace(new RegExp("-", "g"), '_');
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
    source.push('    machine_name: ' + prefix + key);
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

// function feed_config() {
//     // "../sites/default/files/sync/feeds.feed_type.lighthouse_report_import.yml"
//     return ;
// }
async function content(path) {  
    return await readFile(path, 'utf8')
  }