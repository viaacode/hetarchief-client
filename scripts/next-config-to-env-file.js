const fs = require('fs');
const path = require('path');

const config = require('../next.config');

let envFileContent = '';
Object.keys(config.publicRuntimeConfig).forEach((envKey) => {
	envFileContent += envKey + '=' + process.env[envKey] + '\n';
});

const envFilePath = path.resolve('.env.local');
console.log('writing env vars to file: ', envFilePath);
fs.writeFileSync(envFilePath, envFileContent);
