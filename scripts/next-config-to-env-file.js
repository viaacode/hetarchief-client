const fs = require('node:fs');
const path = require('node:path');

const config = require('../next.config');

let envFileContent = '';
for (const envKey of Object.keys(config.publicRuntimeConfig)) {
	envFileContent += `${envKey}=${process.env[envKey]}\n`;
};

const envFilePath = path.resolve('.env.local');
console.log('writing env vars to file: ', envFilePath);
fs.writeFileSync(envFilePath, envFileContent);
