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

		/* Handle custom path aliases */
		'^@(auth|home|reading-room|shared)/?(.*)$': ['<rootDir>/src/modules/$1/$2'],

		/* Handle deps */
		'^lodash-es$': '<rootDir>/node_modules/lodash/index.js',
	},
	/* Don't look for other test files except in src this will avoid running .spec files from cypress */
	roots: ['<rootDir>/src'],
	setupFiles: ['<rootDir>/src/setup-tests.ts'],
	setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.js'],
	transform: {
		/* Use babel-jest to transpile tests with the next/babel preset
		https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object */
		'^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
	},
	testEnvironment: 'jsdom',
	transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
};
