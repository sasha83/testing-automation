mkdir
auto-lighthouse --url nataliagill.com --format json 
auto-lighthouse --url gregshaddix.com --format json 
cd ~/testing-automation/sites/default/files/_lighthouse_report_staging
node build-csvs-from-lighthouse-json.js