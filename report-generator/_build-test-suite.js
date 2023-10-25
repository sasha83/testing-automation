const { exec } = require('child_process');

const util = require('util')
const request = require('request');
const fs = require('fs');
let testSuiteID;

let shFile = [];
let domainArray = [];
let siteMapURL;
let instanceID = Date.now();
let projectFolder = "~/testing-automation/report-generator/";
let delete_queue = [];








// Test suite      
//         -one requred domain
//         -any existing URLs
//         -any non-existing URLs
//         -any sitemapURLs
//         -URL dump field







process.on('uncaughtException', function (err) {
    console.log(err);
});
let i = 0;
process.argv.forEach(function (val, index, array) {

    if (i == 2) {
        testSuiteID = val;
        doRequest("http://automate.ddev.site/test-suite-rest?test_suite_id=" + testSuiteID)
    }
    i++;
});

let shFilename = 'test-suite-id-' + testSuiteID + '_' + instanceID + '.sh';

function format_url_commaind(url) {
    let url_commaind = ('lighthouse ' + url + ' --quiet --chrome-flags="--headless" --output json --output-path _lighthouse-report-queue/' + testSuiteID + '/' + instanceID + '/' + getStringOf(url) + '.json')
    return url_commaind;
}
async function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                let queueArray = JSON.parse(body);
                let shOutput = [];
                let domainID = queueArray[0].domain_nid;
                shOutput.push('mkdir ' + projectFolder + '_lighthouse-report-queue');
                shOutput.push('mkdir ' + projectFolder + '_lighthouse-report-queue/' + testSuiteID);
                shOutput.push('mkdir ' + projectFolder + '_lighthouse-report-queue/' + testSuiteID + '/' + instanceID);
                shOutput.push('mkdir ' + projectFolder + '_lighthouse-archive/');
                shOutput.push('mkdir ' + projectFolder + '_lighthouse-archive/' + testSuiteID);
                shOutput.push('mkdir ' + projectFolder + '_lighthouse-archive/' + testSuiteID + '/' + instanceID);

                console.log(queueArray);
                resolve(body);


                if (queueArray[0].field_sitemap_urls) {
                    queueArray[0].field_sitemap_urls = queueArray[0].field_sitemap_urls.split(',');
                    queueArray[0].field_sitemap_urls.forEach(function (sitemap_url) {
                        let sitemap_file = sitemap_url.split('/').pop();
                        shOutput.push('node _build-test-script-from-sitemap.js' + ' ' + sitemap_url + ' ' + +testSuiteID + ' ' + instanceID + ' ' + domainID);
                        shOutput.push('sh test-sitemap-' + testSuiteID + '_' + instanceID + '_' + sitemap_file.replace('.xml', '') + '.sh');
                        shOutput.push('rm test-sitemap-' + testSuiteID + '_' + instanceID + '.sh');
                    });
                }

                if (queueArray[0].field_url_reference) {
                    console.log(queueArray[0].field_url_reference);
                    queueArray[0].field_url_reference = queueArray[0].field_url_reference.split('|');
                    queueArray[0].field_url_reference.forEach(function (url) {

                        shOutput.push('node _build-csvs-from-lighthouse-json.js');
                        shOutput.push('\n');
                        shOutput.push('echo "generating lighthouse report for: ' + url + '"');
                        shOutput.push(format_url_commaind(url));
                        delete_queue.push(testSuiteID + '_' + instanceID + '_' + getStringOf(url) + '.csv');
                    });
                }


                if (queueArray[0].field_url_dump) {
                    queueArray[0].field_url_dump = queueArray[0].field_url_dump.split('\r\n');
                    console.log('queueArray[0].field_url_dump: ', queueArray[0].field_url_dump);
                    queueArray[0].field_url_dump.forEach(function (url) {
                        shOutput.push('echo "generating lighthouse report for: ' + url + '"');
                        shOutput.push('node _build-csvs-from-lighthouse-json.js');
                        shOutput.push(format_url_commaind(url));
                        delete_queue.push(testSuiteID + '_' + instanceID + '_' + getStringOf(url) + '.csv');
                    });
                }



                shOutput.push('ddev drush feeds:import 1 -y');
                shOutput.push('node _analyze-url-stats.js');
                shOutput.push('sh _url-analysis.sh');
                shOutput.push('ddev drush feeds:import 2  -y');

                delete_queue.forEach(function (q) {
                    shOutput.push('rm ../sites/default/files/_lighthouse-report-staging/' + q);
                });
                shOutput = shOutput.join('\n');

                // console.log('shOutput: ', shOutput);
                const shFilename = 'test-suite-' + testSuiteID + '_' + instanceID + '.sh';
                fs.writeFile(shFilename, shOutput, (err) => {
                    if (err) throw err;
                })
                console.log('\n\nRun this...\nsh ', shFilename);


            } else {
                reject(error);
            }
        });
    });
}
function getStringOf(link) {
    let reportPath = link;
    reportPath = reportPath.replace('http://', '');
    reportPath = reportPath.replace('https://', '');
    reportPath = reportPath.replace('www.', '');
    reportPath = reportPath.replace('www.', '');
    reportPath = reportPath.replace('sitemap.xml', '');
    reportPath = reportPath.replaceAll('/', '_');
    reportPath = reportPath.replaceAll('?', '_');
    reportPath = reportPath.replaceAll('=', '_');
    reportPath = reportPath.replaceAll(' ', '_');

    return reportPath;
}
