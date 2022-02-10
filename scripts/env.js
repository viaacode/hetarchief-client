const fs = require('fs');

const CI_ENV_VARIABLES = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	NEXT_PUBLIC_ORIGIN: process.env.NEXT_PUBLIC_ORIGIN,
	NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED,
	PROXY_URL: publicRuntimeConfig.PROXY_URL,
};

let envVariables = {};

if (fs.existsSync('.env')) {
	const envFile = fs.readFileSync('.env').toString();
	const lines = envFile.split('\n').map((line) => line.trim());

	lines.forEach((line) => {
		const [envKey, ...envValueParts] = line.split('=');
		const envValue = envValueParts.join('=');

		if (!CI_ENV_VARIABLES[envKey] || CI_ENV_VARIABLES[envKey][0] === '$') {
			envVariables[envKey] = envValue;
		} else {
			envVariables[envKey] = CI_ENV_VARIABLES[envKey];
		}
	});
} else {
	envVariables = CI_ENV_VARIABLES;
}

let outputString = 'window._ENV_ = {\n';

Object.keys(envVariables).forEach((envName) => {
	if (envName) {
		outputString += `\t\"${envName}\": \"${envVariables[envName]}\",\n`;
	}
});

outputString += '};';

fs.writeFileSync('./env-config.js', outputString);
