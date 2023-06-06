const util = require('util')
const request = require('request');
const fs = require('fs');
let testSuiteID;

let shFile = [];
let domainArray = [];
let siteMapURL;
let instanceID = Date.now();


let i = 0;
process.argv.forEach(function (val, index, array) {

    if(i==2) {
        testSuiteID = val;
        // console.log("\x1b[35m", val);
        doRequest("http://automate.ddev.site/test-suite-rest?test_suite_id="+testSuiteID)
    }
    i++;
});


let shFilename = 'test-suite-id-'+testSuiteID+'.sh';

async function doRequest(url) {
	return new Promise(function (resolve, reject) {
		request(url, function (error, res, body) {
			if (!error && res.statusCode == 200) {
                let domainArray = JSON.parse(body);
                let shOutput = [];
                // console.log(domainArray);
				resolve(body);
                domainArray.forEach(function(domain){
                    // console.log(domain);
                    shOutput.push('node _build-lighthouse-sh-file.js '+domain.field_site+' '+testSuiteID);
                    shOutput.push('sh test-suite-id-'+testSuiteID+'_'+getStringOf(domain.field_site)+'.sh &');
                });
                console.log(shOutput);
                shOutput = shOutput.join('\n');
                fs.writeFile(shFilename, shOutput, (err) => {
                    if (err) throw err;
                }) 
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
    reportPath = reportPath.replaceAll(' ', '_');
    
    return reportPath;
}
