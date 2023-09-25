const GetSitemapLinks = require("get-sitemap-links").default;
const util = require('util')
const request = require('request');
const fs = require('fs');

let shFile = [];
let siteMapURL;

let testSuiteID;
let instanceID;
let domainID;
let projectFolder = "~/testing-automation/report-generator";

const maxTestRuns = 4;
let i = 0;
process.argv.forEach(function (val, index, array) {
        if (i == 2) {
                siteMapURL = val;
        } else if (i == 3) {
                testSuiteID = val;
        } else if (i == 4) {
                instanceID = val;
        } else if (i == 5) {
                domainID = val;
        }
        i++;
});

console.log('siteMapURL: ', siteMapURL);
console.log('testSuiteID: ', testSuiteID);
console.log('instanceID: ', instanceID);
console.log('domainID: ', domainID);








function format_url_commaind(url) {
        let url_commaind = ('lighthouse ' + url + ' --quiet --chrome-flags="--headless" --output json --output-path _lighthouse-report-queue/' + testSuiteID + '/' + instanceID + '/' + getStringOf(url) + '.json')
        return url_commaind;
}



async function generatesSH() {
        let delete_queue = [];
        let links = await GetSitemapLinks(
                siteMapURL
        );
        let sim = 0;
        links = reduceSample(links, 2);
        let link_i = 0;
        links.forEach(function (link) {
                link_i++;
                let reportPath = getStringOf(link);
                let testFile = projectFolder + '/_lighthouse-report-queue/' + testSuiteID + '/' + instanceID + '/' + reportPath + '.json';
                delete_queue.push(instanceID + '_' + testSuiteID + '_' + reportPath + '.csv');
                shFile.push(format_url_commaind(link));
                shFile.push('echo "' + link + ', ' + reportPath + '.json" \n');
                shFile.push('node _build-csvs-from-lighthouse-json.js');
                sim++;        
        })
        console.log(shFile);
        let sitemap_file = siteMapURL.split('/').pop();
        fs.writeFile('test-sitemap-' + testSuiteID + '_' + instanceID + '_' + sitemap_file.replace('.xml', '') + '.sh', shFile.join('\n'), (err) => {
                if (err) throw err;
        })
}
function reduceSample(links, sampleSize) {
        let sampled = [];
        links.forEach(function (link) {
                let linkReduced = link.split('/');
                if (linkReduced.length > 4) {
                        linkReduced.pop();
                        linkReduced = linkReduced.join('/');
                        let match = false;
                        let found = 0;
                        sampled.forEach(function (sampleLink) {
                                let sampleLinkReduced = sampleLink.split('/')
                                sampleLinkReduced.pop();
                                sampleLinkReduced = sampleLinkReduced.join('/');
                                if (linkReduced == sampleLinkReduced) {
                                        found++;
                                        match = true;
                                }
                        });
                        if (match == true && found < sampleSize) {
                                sampled.push(link);
                        } else if (match == false) {
                                sampled.push(link);
                        }
                } else {
                        sampled.push(link);
                }




        });
        console.log('links: ', links);
        console.log('sampled: ', sampled);
        console.log('sampled.length: ', sampled.length);
        return sampled;
}

generatesSH();
















function getStringOf(link) {
        let reportPath = link;
        reportPath = reportPath.replace('http://', '');
        reportPath = reportPath.replace('https://', '');
        reportPath = reportPath.replace('www.', '');
        reportPath = reportPath.replace('www.', '');
        reportPath = reportPath.replace('sitemap.xml', '');
        reportPath = reportPath.replaceAll('/', '_');
        reportPath = reportPath.replaceAll(' ', '_');
        reportPath = reportPath.replaceAll('(', '_');
        reportPath = reportPath.replaceAll(')', '_');

        return reportPath;
}


