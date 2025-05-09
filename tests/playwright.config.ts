import type { PlaywrightTestConfig } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
	testDir: './tests',
	/* Maximum time one test can run for. */
	timeout: 60 * 1000, // T12 makes an exception, for waiting for notifications to come in
	expect: {
		/**
		 * Maximum time expect() should wait for the condition to be met.
		 * For example in `await expect(locator).toHaveText();`
		 */
		// timeout: 5000, // Disabled because localhost is way too slow
		timeout: 10000,
	},
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: 0, // process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: 1, // process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: [['line'], ['junit', { outputFile: 'end2end.xml' }]],
	/* Output folder for test results and trace files */
	outputDir: 'test_results',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		headless: true,
		// Ignore errors around https certificates on INT: https://ssum-int-iam.private.cloud.meemoo.be/account/nieuw
		ignoreHTTPSErrors: true,
		// launchOptions: {
		// 	slowMo: 500 /* TODO disable after recording all videos */,
		// },
		contextOptions: {
			// recordVideo: { dir: 'videos/' } /* TODO disable in production */,
			// Ignore errors around https certificates on INT: https://ssum-int-iam.private.cloud.meemoo.be/account/nieuw
			ignoreHTTPSErrors: true,
			// Ignore security header on the page to allow javascript to be evaluated
			// Refused to evaluate a string as JavaScript because 'unsafe-eval' is not an allowed source of script
			// in the following Content Security Policy directive: "script-src 'self' 'unsafe-inline'".
			bypassCSP: true,
		},
		/* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
		actionTimeout: 0,
		/* Base URL to use in actions like `await page.goto('/')`. */
		// baseURL: 'http://localhost:3000',

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',

		// Use chrome instead of chromium, to be able to play videos
		channel: 'chrome',

		viewport: { width: 1440, height: 772 },
	},

	/* Configure projects for major browsers */
	// projects: [
	// 	{
	// 		name: 'chromium',
	// 		use: {
	// 			...devices['Desktop Chrome'],
	// 		},
	// 	},

	// {
	// 	name: 'firefox',
	// 	use: {
	// 		...devices['Desktop Firefox'],
	// 	},
	// },
	//
	// {
	// 	name: 'webkit',
	// 	use: {
	// 		...devices['Desktop Safari'],
	// 	},
	// },

	/* Test against mobile viewports. */
	// {
	//   name: 'Mobile Chrome',
	//   use: {
	//     ...devices['Pixel 5'],
	//   },
	// },
	// {
	//   name: 'Mobile Safari',
	//   use: {
	//     ...devices['iPhone 12'],
	//   },
	// },

	/* Test against branded browsers. */
	// {
	//   name: 'Microsoft Edge',
	//   use: {
	//     channel: 'msedge',
	//   },
	// },
	// {
	//   name: 'Google Chrome',
	//   use: {
	//     channel: 'chrome',
	//   },
	// },
	// ],

	/* Folder for test artifacts such as screenshots, videos, traces, etc. */
	// outputDir: 'test-results/',

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   port: 3000,
	// },
};

export default config;
