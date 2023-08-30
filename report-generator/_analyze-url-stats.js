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


fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
                // do something with JSON
                let data = JSON.stringify(json);
                fs.writeFileSync('_urls.json', data);
                // console.log('running update...');
                runScript('./_update-url-stat-files.js', function (err) {
                        if (err) throw err;
                        console.log('finished running update-url-stat-files.js');
                });

        });








