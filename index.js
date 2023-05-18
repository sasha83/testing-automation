const { exec } = require("child_process");
const timeStamp = Date.now();

exec("lighthouse https://anappetiteforjoy.com/ --output-path=./report-anappetiteforjoy-"+timeStamp+".json --output json", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});