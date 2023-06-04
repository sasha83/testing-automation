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




async function doRequest(url) {
	return new Promise(function (resolve, reject) {
		request(url, function (error, res, body) {
			if (!error && res.statusCode == 200) {
                let domainArray = JSON.parse(body);
                // console.log(domainArray);
				resolve(body);
                domainArray.forEach(function(domain){
                    console.log(domain);
                });
			} else {
				reject(error);
			}
		});
	});
}
