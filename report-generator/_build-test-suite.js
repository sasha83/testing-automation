const { exec } = require('child_process');

const util = require('util')
const request = require('request');
const fs = require('fs');
let testSuiteID;

let shFile = [];
let domainArray = [];
let siteMapURL;
let instanceID = Date.now();
let projectFolder = "/Users/sasha/testing-automation/report-generator/";


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
async function doRequest(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                let queueArray = JSON.parse(body);
                let shOutput = [];
                console.log(queueArray);
                resolve(body);
                queueArray.forEach(function (domain) {
                    if (domain.field_url_reference) {
                        let urls = domain.field_url_reference.split(', ');
                        console.log(urls);
                        shOutput.push('mkdir ' + projectFolder + '_lighthouse-report-queue/' + testSuiteID);
                        shOutput.push('mkdir ' + projectFolder + '_lighthouse-report-queue/' + testSuiteID + '/' + instanceID);
                        urls.forEach(function (url) {
                            shOutput.push('lighthouse ' + url + ' --quiet --chrome-flags="--headless" --output json --output-path _lighthouse-report-queue/' + testSuiteID + '/' + instanceID + '/' + getStringOf(url) + '.json');
                            shOutput.push('echo "' + url + ', ' + getStringOf(url) + '.json" \n');

                        });
                    }
                });
                queueArray.forEach(function (domain) {
                    if (domain.field_site) {
                        console.log(domain);
                        shOutput.push('node _build-lighthouse-sh-file.js ' + domain.field_site + ' ' + testSuiteID + ' ' + instanceID);
                        shOutput.push('sh test-suite-id-' + testSuiteID + '_' + getStringOf(domain.field_site) + '.sh');
                    }
                });

                shOutput.push('node _build-test-suite.js' + ' ' + testSuiteID);
                shOutput = shOutput.join('\n');
                console.log('shOutput: ', shOutput);
                console.log('shFilename', shFilename);
                fs.writeFile(shFilename, shOutput, (err) => {
                    if (err) throw err;
                })
                console.log('sh ' + shFilename);
                // var runScript = exec('sh ' + shFilename,
                //     (error, stdout, stderr) => {
                //         console.log(stdout);
                //         console.log(stderr);
                //         if (error !== null) {
                //             console.log(`exec error: ${error}`);
                //         }
                //     });

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
