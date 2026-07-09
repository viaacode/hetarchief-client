/**
 * Runtime public configuration.
 *
 * Replaces Next.js' `publicRuntimeConfig` / `next/config`, which were removed in Next.js 16.
 * Values are resolved at runtime (not baked in at build time), so a single build/image can be
 * deployed to multiple environments:
 * - On the client, values come from `window.__ENV__`, injected by `/env-config.js` which is
 *   generated at container start by `scripts/generate-env-config.js`.
 * - On the server, values come straight from `process.env`.
 *
 * IMPORTANT: keep PUBLIC_ENV_KEYS in sync with `scripts/generate-env-config.js`.
 */
export const PUBLIC_ENV_KEYS = [
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
] as const;

// Values are typed as `string` (not optional) to mirror the loose typing of the previous
// `next/config` publicRuntimeConfig, avoiding churn at existing call sites. At runtime a value
// may still be undefined if the env var is not set.
export type PublicRuntimeConfig = Record<(typeof PUBLIC_ENV_KEYS)[number], string>;

declare global {
	interface Window {
		__ENV__?: Partial<PublicRuntimeConfig>;
	}
}

function readPublicRuntimeConfig(): PublicRuntimeConfig {
	if (typeof window !== 'undefined') {
		return (window.__ENV__ ?? {}) as PublicRuntimeConfig;
	}
	const config: Record<string, string | undefined> = {};
	for (const key of PUBLIC_ENV_KEYS) {
		config[key] = process.env[key] ?? undefined;
	}
	return config as PublicRuntimeConfig;
}

export const publicRuntimeConfig: PublicRuntimeConfig = readPublicRuntimeConfig();

/**
 * Drop-in replacement for `next/config`'s default export, so existing call sites
 * (`const { publicRuntimeConfig } = getConfig();`) only need their import path updated.
 */
export default function getConfig(): { publicRuntimeConfig: PublicRuntimeConfig } {
	return { publicRuntimeConfig: readPublicRuntimeConfig() };
}
