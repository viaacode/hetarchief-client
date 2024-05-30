import fs from "fs";

import config from "./next.config.mjs";

let envFileContent = '';
Object.keys(config.publicRuntimeConfig).forEach((envKey) => {
	envFileContent += envKey + '=' + process.env[envKey] + '\n';
});

fs.writeFileSync('.env.local', envFileContent);
