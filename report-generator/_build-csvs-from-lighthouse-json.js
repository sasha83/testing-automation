
const request = require('request');
const util = require('util')
const fs = require("fs");
const { readFile } = require('fs/promises')
const { report } = require('process');
const { parse } = require("csv-parse");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let fieldString = [];

let testSuiteID;
let instanceID;
let lighthouseCSVimport = [];
let reportObject = {};
let reportCustomSources = [];
let reportHeaders = [];
let reportMappings = [];
let usedKeys = {}
const outFolder = '../sites/default/files/_lighthouse_report_staging';
const inFolder = './_lighthouse-report-queue';



let domainArray = [];
let key_domainArray = [];

async function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                domainArray = JSON.parse(body);
                key_domainArray = [];
                domainArray.forEach(function (domain) {
                    key_domainArray.push({ [domain.title]: domain.nid });
                });
                let processQueue = [];

                // Read all test suite folders
                fs.readdirSync(inFolder).forEach(tsid => {
                    // console.log(tsid);
                    if (tsid == parseInt(tsid)) {
                        // console.log('tsid==parseInt(tsid)', tsid == parseInt(tsid));
                        testSuiteID = tsid;
                        if (fs.lstatSync(inFolder + "/" + tsid).isDirectory()) {
                            fs.readdirSync(inFolder + '/' + tsid).forEach(iid => {
                                if (iid == parseInt(iid)) {

                                    // Read all instance ID folders
                                    instanceID = iid;
                                    if (fs.lstatSync(inFolder + "/" + tsid + "/" + iid).isDirectory()) {
                                        fs.readdirSync(inFolder + "/" + tsid + "/" + iid).forEach(file => {
                                            let lhReportPath = inFolder + "/" + tsid + "/" + iid + "/" + file;
                                            // lhReportPath=lhReportPath.replace('.json','.csv');
                                            // console.log(inFolder+"/"+testSuiteID+"/"+instanceID+"/"+file);
                                            if (fs.lstatSync(lhReportPath).isDirectory()) {


                                            } else {
                                                if (file.indexOf('.json') > -1) {
                                                    processQueue.push({ 'testSuiteID': tsid, 'instanceID': iid, 'lhReportPath': lhReportPath });
                                                }
                                            }
                                        });
                                    }

                                }
                            });
                        }
                    }
                });



                // report-generator/_pre_lh-report-feed-yml.txt
                // ../sites/default/files/sync/feeds.feed_type.lighthouse_report_import.yml
                // let preYMLFile = "_pre_lh-report-feed-yml.txt";
                // let outputYMLFile = "../sites/default/files/sync/feeds.feed_type.lighthouse_report_import.yml";

                // const rawdata = fs.readFileSync('./test-reports/_lighthouse-report-template-example.json');
                // const data = JSON.parse(rawdata);

                let outfile = 0;

                processQueue.forEach(function (process) {
                    let lhJSONFilename = process.lhJSONFilename;
                    let reportObjectFromJSON = {};
                    let reportHeadersFromJSON = [];
                    let reportTitlesFromJSON = [];
                    let reportBasedFields = [];
                    let reportMappingsFromJSON = [];
                    let reportCustomSourcesFromJSON = [];

                    reportObjectFromJSON = {};
                    reportHeadersFromJSON = [];
                    reportBasedFields = [];
                    // console.log('process: ', process);
                    // var outFileName = process.lhJSONFilename.substring(lhJSONFilename.lastIndexOf('/')+1);






                    if (process.lhReportPath.indexOf('.json') > -1) {

                        const rawdata = fs.readFileSync(process.lhReportPath);

                        const data = JSON.parse(rawdata);

                        // add attributes from data.audits object
                        Object.keys(data.audits).forEach(function (key) {
                            let fieldTypeFromJSON = data.audits[key].scoreDisplayMode;

                            if (fieldTypeFromJSON == "string") {
                                reportObjectFromJSON[key] = String(data.audits[key].score);
                            } else if (fieldTypeFromJSON == "integer") {
                                reportObjectFromJSON[key] = parseInt(data.audits[key].score);
                            } else if (fieldTypeFromJSON == "informative") {
                                reportObjectFromJSON[key] = JSON.stringify(data.audits[key].details);
                            } else {
                                reportObjectFromJSON[key] = data.audits[key].score;
                            }

                            reportBasedFields.push({ 'machine_name': key, 'title': cleanTitles(data.audits[key].title), 'type': fieldType(fieldTypeFromJSON) });
                            // }


                        });







                        // add attributes that aren't in the data.audits object
                        reportObjectFromJSON.lighthouse_version = data.lighthouseVersion;
                        reportObjectFromJSON.requested_url = data.requestedUrl;
                        reportObjectFromJSON.main_document_url = data.mainDocumentUrl;
                        reportObjectFromJSON.final_displayed_url = data.finalDisplayedUrl;
                        reportObjectFromJSON.final_url = data.finalUrl;
                        reportObjectFromJSON.fetch_time = data.fetchTime;
                        reportObjectFromJSON.fetch_time_timestamp = data.fetchTime;
                        reportObjectFromJSON.fetch_time_unix = data.fetchTime;
                        reportObjectFromJSON.gather_mode = data.gatherMode;
                        reportObjectFromJSON.run_warnings = JSON.stringify(data.runWarnings);
                        reportObjectFromJSON.user_agent = data.userAgent;
                        reportObjectFromJSON.environment = JSON.stringify(data.environment);
                        reportObjectFromJSON.config_settings = JSON.stringify(data.configSettings);
                        // reportObjectFromJSON.categories = JSON.stringify(data.categories);
                        // reportObjectFromJSON.category_groups = JSON.stringify(data.categoryGroups);
                        reportObjectFromJSON.test_suite_id = process.testSuiteID;
                        reportObjectFromJSON.instance_id = instanceID;
                        ;
                        let domain = (new URL(reportObjectFromJSON.requested_url));

                        // format node title
                        reportObjectFromJSON.title = data.requestedUrl + " " + process.testSuiteID + " " + process.instanceID;

                        let domainID = getDomainID(domain.origin.replace('www.', '').replace('https://', '').replace('http://', ''));
                        reportObjectFromJSON.domain_id = domainID;

                        reportBasedFields.push({ 'machine_name': 'lighthouse_version', 'title': 'Lighthouse Version', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'requested_url', 'title': 'Requested URL', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'main_document_url', 'title': 'Main Document URL', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'final_displayed_url', 'title': 'Final Displayed URL', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'final_url', 'title': 'Final URL', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'fetch_time', 'title': 'Fetch Time', 'type': 'string' });  //temp using string.  need to import as a date eventually (soon).
                        reportBasedFields.push({ 'machine_name': 'gather_mode', 'title': 'Gather Mode', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'run_warnings', 'title': 'Run Warnings', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'user_agent', 'title': 'User Agent', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'environment', 'title': 'Environment', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'config_settings', 'title': 'Config Settings', 'type': 'string' });
                        // reportBasedFields.push({ 'machine_name': 'categories', 'title': 'Categories', 'type': 'string' });
                        // reportBasedFields.push({ 'machine_name': 'category_groups', 'title': 'Category Groups', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'test_suite_id', 'title': 'Test Suite ID', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'instance_id', 'title': 'Instance ID', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'title', 'title': 'Title', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'domain_id', 'title': 'Domain ID', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'fetch_time_timestamp', 'title': 'Fetch Time Timestamp', 'type': 'string' });
                        reportBasedFields.push({ 'machine_name': 'fetch_time_unix', 'title': 'Fetch Time Unix', 'type': 'string' });









                        // build the Quick Add Fields config

                        // let reportOutputForCSV = {};
                        reportBasedFields.forEach(function (reportField) {
                            reportHeadersFromJSON.push({ id: reportField.machine_name, title: reportField.machine_name.replace(new RegExp("-", "g"), '_') })
                            // fieldStringNew.push(reportField.machine_name.replace(new RegExp("-", "g"), '_')+'|'+reportField.title+'|'+reportField.type);
                        });

                        // var fn = reportObjectFromJSON.requested_url.split("/");
                        // console.log(data);
                        var outFileName = process.instanceID + "_" + process.testSuiteID + "_" + getStringOf(reportObjectFromJSON.requested_url) + '.csv';
                        // outFileName = outFileName.replace('.json', '.csv');

                        writeToCSV(outFolder + '/' + outFileName, reportHeadersFromJSON, [reportObjectFromJSON]);
                        let archiveFilename = process.lhReportPath.replace('_lighthouse-report-queue', '_lighthouse-archive');
                        fs.renameSync(process.lhReportPath, archiveFilename);

                        // outputCSV
                        outfile++;
                    }

                });

            } else {
                reject(error);
            }
        });
    });
}
function getDomainID(domainString) {
    let domainID;
    domainArray.forEach(function (domain) {
        if (domain.title == domainString) {

            domainID = domain.nid;
        }

    });
    return domainID;
}


doRequest('http://automate.ddev.site/domains').then(function () {

});


function getStringOf(link) {
    let reportPath = link;
    reportPath = reportPath.replace('http://', '');
    reportPath = reportPath.replace('https://', '');
    reportPath = reportPath.replace('www.', '');
    reportPath = reportPath.replace('www.', '');
    reportPath = reportPath.replace('sitemap.xml', '');
    reportPath = reportPath.replaceAll('/', '_');
    reportPath = reportPath.replaceAll(' ', '_');

    return reportPath;
}


function writeToCSV(filename, headers, content) {
    const csvWriter = createCsvWriter({
        path: filename,
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

