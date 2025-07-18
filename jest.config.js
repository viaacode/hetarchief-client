// eslint-disable-next-line @typescript-eslint/no-var-requires
const pathAliases = require('./scripts/path-aliases.js');

const pathAliasesRegex = `^@(${pathAliases.join('|')})/?(.*)$`;

module.exports = {
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/node_modules/**'],
	moduleNameMapper: {
		/* Handle CSS imports (with CSS modules)
		https://jestjs.io/docs/webpack#mocking-css-modules */
		'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

		// Handle CSS imports (without CSS modules)
		'^.+\\.(css|sass|scss)$': '<rootDir>/jest/__mocks__/style-mock.js',

		/* Handle image imports
		https://jestjs.io/docs/webpack#handling-static-assets */
		'^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/jest/__mocks__/file-mock.js',

		/* Handle deps */
		'^lodash-es$': '<rootDir>/node_modules/lodash/index.js',
		'^@meemoo/react-components$': '<rootDir>/node_modules/@meemoo/react-components/dist/index.js',
		'^@viaa/avo2-components$': '<rootDir>/node_modules/@viaa/avo2-components/dist/index.js',

		/* Handle custom path aliases */
		[pathAliasesRegex]: '<rootDir>/src/modules/$1/$2',
	},
	/* Report results to the console but also to a junit compatible xml file for Jenkins: ARC-523 */
	reporters: [
		'default',
		[
			'jest-junit',
			{
				outputDirectory: 'tests/test_results',
			},
		],
	],
	/* Don't look for other test files except in src this will avoid running .spec files from playwright */
	roots: ['<rootDir>/src'],
	setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
	transform: {
		/* Use babel-jest to transpile tests with the next/babel preset
		https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
		'^.+\\.(js|jsx|mjs|ts|tsx|mts)$': ['babel-jest', { presets: ['next/babel'] }],
	},
	testEnvironment: 'jsdom',
	transformIgnorePatterns: [
		'^.+\\.module\\.(css|sass|scss)$',
		'/node_modules/(?!(@meemoo/react-components|@viaa/avo2-components|lodash-es|ky)/)',
	],
	globals: {
		TZ: 'UTC',
	},
	testTimeout: 20000,
};
