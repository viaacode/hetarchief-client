const fs = require('fs');

const config = require('./next.config');

let envFileContent = '';
Object.keys(config.publicRuntimeConfig).forEach((envKey) => {
	envFileContent += envKey + '=' + process.env[envKey] + '\n';
});

fs.writeFileSync('.env.local', envFileContent);
