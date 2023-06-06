const GetSitemapLinks = require("get-sitemap-links").default;

const util = require('util')
const request = require('request');
const fs = require('fs');
let testSuiteID = 1091;
let testNodes;
let shFile = [];
let domainArray = [];
let siteMapURL;
const maxTestRuns = 4;
let i = 0;
process.argv.forEach(function (val, index, array) {
    console.log(val, i);
    if(i==2) {
        siteMapURL = val;
    } if(i==3) {
        testSuiteID = val;
    }
    i++;
});
console.log(siteMapURL, testSuiteID);
async function generatesSH() {
    const array = await GetSitemapLinks(
        siteMapURL
    );
    // console.log('array: ', array);        
    shFile.push('mkdir _lighthouse-report-queue/'+testSuiteID);
    let sim = 0;
    array.forEach(function(link){
        
        // console.log(link);
        let reportPath = getStringOf(link);
        let simString = '';
        if(sim<maxTestRuns) {
            simString = ' &';
        } else {
            sim = 0;
        }

        shFile.push('lighthouse '+link+' --quiet --chrome-flags="--headless" --output json --output-path _lighthouse-report-queue/'+testSuiteID+'/'+reportPath+'.json'+simString);

        sim ++;
    })
    shFile = shFile.join('\n');
    fs.writeFile('test-suite-id-'+testSuiteID+'_'+getStringOf(siteMapURL)+'.sh', shFile, (err) => {
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


