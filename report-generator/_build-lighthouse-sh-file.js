const GetSitemapLinks = require("get-sitemap-links").default;

const util = require('util')
const request = require('request');
const fs = require('fs');
let testSuiteID;
let shFile = [];
let siteMapURL;
let instanceID;
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
    }

    i++;
});

function getSample(links, sampleSize) {
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
async function generatesSH() {
    let links = await GetSitemapLinks(
        siteMapURL
    );
    shFile.push('mkdir ' + projectFolder + '/_lighthouse-report-queue/' + testSuiteID);
    shFile.push('mkdir ' + projectFolder + '/_lighthouse-report-queue/' + testSuiteID + '/' + instanceID);
    shFile.push('mkdir ' + projectFolder + '/_lighthouse-archive/' + testSuiteID);
    shFile.push('mkdir ' + projectFolder + '/_lighthouse-archive/' + testSuiteID + '/' + instanceID);
    let sim = 0;
    links = getSample(links, 3);
    let link_i = 0;
    links.forEach(function (link) {
        link_i++;
        let reportPath = getStringOf(link);
        shFile.push('\n echo "running ' + link_i + ' of ' + links.length + '...  ' + link + ' > ' + testSuiteID + '/' + instanceID + '/' + reportPath + '.json"');
        shFile.push('lighthouse ' + link + ' --quiet --chrome-flags="--headless" --output json --output-path ' + projectFolder + '/_lighthouse-report-queue/' + testSuiteID + '/' + instanceID + '/' + reportPath + '.json');
        shFile.push('echo "' + link + ', ' + reportPath + '.json" \n');
        shFile.push('node _build-csvs-from-lighthouse-json.js');
        sim++;
    })
    shFile.push('ddev drush feeds:import 1 -y');
    shFile.push('node _analyze-url-stats.js');
    shFile.push('sh _url-analysis.sh');
    shFile.push('ddev drush feeds:import 2  -y');
    shFile = shFile.join('\n');
    fs.writeFile('test-' + testSuiteID + '_' + instanceID + '.sh', shFile, (err) => {
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


