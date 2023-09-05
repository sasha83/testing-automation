const shell = require('shelljs')
const childProcess = require('child_process');
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
const outFolder = '../sites/default/files/_url_report_staging';
const inFolder = './_lighthouse-report-queue';
// let urlReports = 'http://automate.ddev.site/url-lighthouse-reports-rest?url_id=20785'

const fetch = require('node-fetch');

let url = "http://automate.ddev.site/urls-rest";

let settings = { method: "Get" };

function runScript(scriptPath, callback) {

        // keep track of whether callback has been invoked to prevent multiple invocations
        var invoked = false;

        var process = childProcess.fork(scriptPath);

        // listen for errors as they may prevent the exit event from firing
        process.on('error', function (err) {
                if (invoked) return;
                invoked = true;
                callback(err);
        });

        // execute the callback once the process has finished running
        process.on('exit', function (code) {
                if (invoked) return;
                invoked = true;
                var err = code === 0 ? null : new Error('exit code ' + code);
                callback(err);
        });

}
function run_script_out(command, args, callback) {
        console.log("Starting Process.");
        var child = childProcess.spawn(command, args);

        var scriptOutput = "";

        child.stdout.setEncoding('utf8');
        child.stdout.on('data', function (data) {
                console.log('stdout: ' + data);

                data = data.toString();
                scriptOutput += data;
        });

        child.stderr.setEncoding('utf8');
        child.stderr.on('data', function (data) {
                console.log('stderr: ' + data);

                data = data.toString();
                scriptOutput += data;
        });

        child.on('close', function (code) {
                callback(scriptOutput, code);
        });
}

fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
                // do something with JSON
                let dataString = JSON.stringify(json);
                fs.writeFileSync('_urls.json', dataString);
                let shFileContent = [];
                json.forEach(function (element) {
                        shFileContent.push('node _analyze-url.js ' + element.nid);
                });
                shFileContent.push('node _analyze-url-stats.js');
                // console.log(shFileContent);
                fs.writeFileSync('_url-analysis.sh', shFileContent.join('\n'));

                // childProcess.exec('sh _url-analysis.sh', function (err, stdout, stderr) {
                //         // handle err, stdout, stderr
                // });
        });


