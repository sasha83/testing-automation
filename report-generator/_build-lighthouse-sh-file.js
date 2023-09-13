const GetSitemapLinks = require("get-sitemap-links").default;

const util = require('util')
const request = require('request');
const fs = require('fs');
let testSuiteID = 1091;
let testNodes;
let shFile = [];
let domainArray = [];
let siteMapURL;
let instanceID;
// let projectFolder = "/Volumes/swetlowski3tb/automate/";
let projectFolder = "~/testing-automation/report-generator";

const maxTestRuns = 4;
let i = 0;
process.argv.forEach(function (val, index, array) {
    console.log(val, i);
    if (i == 2) {
        siteMapURL = val;
    } else if (i == 3) {
        testSuiteID = val;
    } else if (i == 4) {
        instanceID = val;
    }

    i++;
});
console.log(siteMapURL, testSuiteID, instanceID);
function getSample(links, sampleSize) {
    let sampled = [];
    links.forEach(function (link) {

        let linkReduced = link.split('/');
        linkReduced.pop();
        linkReduced = linkReduced.join('/');
        console.log('link:', link);
        console.log('linkReduced:', linkReduced);
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



    });
    console.log('links: ', links);
    console.log('sampled: ', sampled);
    console.log('sampled.length: ', sampled.length);
    return sampled;
}
async function generatesSH() {
    let links = await GetSitemapLinks(
        siteMapURL
    );
    // console.log('array: ', array);        
    shFile.push('mkdir ' + projectFolder + '/_lighthouse-report-queue/' + testSuiteID);
    shFile.push('mkdir ' + projectFolder + '/_lighthouse-report-queue/' + testSuiteID + '/' + instanceID);

    shFile.push('mkdir ' + projectFolder + '/_lighthouse-archive/' + testSuiteID);
    shFile.push('mkdir ' + projectFolder + '/_lighthouse-archive/' + testSuiteID + '/' + instanceID);
    let sim = 0;
    links = getSample(links, 3);
    links.forEach(function (link) {
        let reportPath = getStringOf(link);
        shFile.push('lighthouse ' + link + ' --quiet --chrome-flags="--headless" --output json --output-path ' + projectFolder + '/_lighthouse-report-queue/' + testSuiteID + '/' + instanceID + '/' + reportPath + '.json');
        shFile.push('echo "' + link + ', ' + reportPath + '.json" \n');
        shFile.push('node _build-csvs-from-lighthouse-json.js');
        sim++;
    })
    shFile = shFile.join('\n');
    fs.writeFile('test-suite-id-' + testSuiteID + '_' + getStringOf(siteMapURL) + '.sh', shFile, (err) => {
        if (err) throw err;
    })
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

    return reportPath;
}


