/**
 * Generates `public/env-config.js` which assigns the public runtime environment variables to
 * `window.__ENV__`. This replaces Next.js' removed `publicRuntimeConfig` (Next.js 16) and lets a
 * single build/image be deployed to multiple environments: the file is (re)generated at container
 * start from `process.env`, and loaded by the browser via a `<script src="/env-config.js">` tag in
 * `_document.tsx` before the application bundle runs.
 *
 * IMPORTANT: keep this key list in sync with PUBLIC_ENV_KEYS in
 * `src/modules/shared/config/public-runtime-config.ts`.
 */
const fs = require('node:fs');
const path = require('node:path');

const PUBLIC_ENV_KEYS = [
	'NEXT_TELEMETRY_DISABLED',
	'NODE_ENV',
	'PORT',
	'CLIENT_URL',
	'SSUM_EDIT_ACCOUNT_URL',
	'KEYCLOAK_ACCOUNT_EDIT_URL',
	'USE_KEYCLOAK_INSTEAD_OF_SSUM',
	'PROXY_URL',
	'DEBUG_TOOLS',
	'ZENDESK_KEY',
	'FLOW_PLAYER_TOKEN',
	'FLOW_PLAYER_ID',
	'GOOGLE_TAG_MANAGER_ID',
	'ENABLE_GOOGLE_INDEXING',
	'IIIF_IMAGE_API',
	'ENABLE_MATERIAL_REQUEST_COMPLEX_REUSE_FLOW',
	'DISABLE_COMPLEX_REUSE_FLOW_FOR_ORGANISATIONS',
	'ENABLE_RIGHTS_FILTERS_FOR_EVERYBODY',
];

const env = {};
for (const key of PUBLIC_ENV_KEYS) {
	if (process.env[key] !== undefined) {
		env[key] = process.env[key];
	}
}

const outputPath = path.resolve('public/env-config.js');
const content = `window.__ENV__ = ${JSON.stringify(env)};\n`;
fs.writeFileSync(outputPath, content);
console.log(`Wrote ${Object.keys(env).length} public env var(s) to ${outputPath}`);
