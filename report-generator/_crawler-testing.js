const Crawler = require("crawler");

const base = "https://georgiapower.com";
const crawledPages = { [base]: true };
const ignoreSelector = `:not([href$=".png"]):not([href$=".jpg"]):not([href$=".mp4"]):not([href$=".mp3"]):not([href$=".gif"])`;

const crawlOptions = {
  skipEventRequest: false,
  rateLimit: 10
};
let i = 0;
const callback = (error, res) => {
    i++;
  if (error) {
    console.error(error);
  } else {
    const $ = res.$;
    console.log(i);
    if($&&$('title').length>0) console.log($('title').html());
    if($&&$('h1').length>0) console.log($('h1').html());

    if($&&$(`a[href^="/"]${ignoreSelector},a[href^="${base}"]${ignoreSelector}`).length>0) {
        $(`a[href^="/"]${ignoreSelector},a[href^="${base}"]${ignoreSelector}`).each(
            (_i, elem) => {
              if (!crawledPages[elem.attribs.href]) {
                crawledPages[elem.attribs.href] = true;
                console.log(`${base}${elem.attribs.href}`);
                directCrawl(`${base}${elem.attribs.href}`);
              }
            }
          );      
    }
  }
};

const crawler = new Crawler({
  maxConnections: 10,
  rateLimit: 0,
  callback,
});

const directCrawl = (uri) => {
  crawler.direct({
    uri,
    callback,
    ...crawlOptions,
  });
};

directCrawl(base);    
