const SitemapGenerator = require('sitemap-generator');

const domain = 'https://skillpointe.com'
var generator = SitemapGenerator(domain, {
  maxDepth: 0,
  filepath: './_generated-sitemaps/'+domain+'sitemap.xml',
  maxEntriesPerFile: 50000,
  stripQuerystring: true
});

generator.on('add', (url) => {
    console.log('adding url:', url);
});

generator.on('done', () => {
    console.log('finished creating sitemap for ', domain);
  });
  
generator.on('error', (error) => {
    console.log(error);
    // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
});
  
generator.on('ignore', (url) => {
    console.log('ignoring url:', url);
  });
  

generator.start();
