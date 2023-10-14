const sass = require('sass');
const fs = require("fs");


const result = sass.compile('scss/style.scss');
console.log(result.css);
fs.writeFileSync('css/style.css', result.css);