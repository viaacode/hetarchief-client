import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const pathAliases = [
	'account',
	'admin',
	'auth',
	'content-page',
	'cookie-policy',
	'cp',
	'home',
	'i18n',
	'ie-objects',
	'iiif-viewer',
	'maintenance-alerts',
	'material-requests',
	'navigation',
	'newsletter',
	'search',
	'shared',
	'sitemap',
	'user-conditions',
	'visit-requests',
	'visitor-layout',
	'visitor-space',
];

const aliasConfig: Record<string, string> = {};
for (const alias of pathAliases) {
	aliasConfig[`@${alias}`] = resolve(__dirname, `src/modules/${alias}`);
}

export default defineConfig({
	plugins: [react()],
	css: {
		postcss: {},
	},
	test: {
		css: {
			modules: {
				classNameStrategy: 'non-scoped',
			},
		},
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/setup-tests.ts'],
		include: ['src/**/*.test.{ts,tsx}'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{js,jsx,ts,tsx}'],
			exclude: ['**/*.d.ts', '**/node_modules/**'],
		},
		testTimeout: 20000,
		reporters: ['default', 'junit'],
		outputFile: {
			junit: 'tests/test_results/junit.xml',
		},
		alias: {
			...aliasConfig,
			'lodash-es': resolve(__dirname, 'node_modules/lodash/index.js'),
			'@meemoo/react-components': resolve(
				__dirname,
				'node_modules/@meemoo/react-components/dist/index.js'
			),
			'@viaa/avo2-components': resolve(
				__dirname,
				'node_modules/@viaa/avo2-components/dist/index.js'
			),
		},
		server: {
			deps: {
				inline: [
					'@meemoo/react-components',
					'@viaa/avo2-components',
					'lodash-es',
					'ky',
					'string-strip-html',
				],
			},
		},
	},
	resolve: {
		alias: {
			...aliasConfig,
			'lodash-es': resolve(__dirname, 'node_modules/lodash/index.js'),
			'@meemoo/react-components': resolve(
				__dirname,
				'node_modules/@meemoo/react-components/dist/index.js'
			),
			'@viaa/avo2-components': resolve(
				__dirname,
				'node_modules/@viaa/avo2-components/dist/index.js'
			),
		},
	},
});