const fs = require('node:fs');

console.log('copy robots.txt file');

if (process.env.ENABLE_GOOGLE_INDEXING === 'true') {
	console.log('enable google indexing');
	fs.copyFileSync('./scripts/robots-enable-indexing.txt', './public/robots.txt');
} else {
	console.log('disable google indexing');
	fs.copyFileSync('./scripts/robots-disable-indexing.txt', './public/robots.txt');
}
