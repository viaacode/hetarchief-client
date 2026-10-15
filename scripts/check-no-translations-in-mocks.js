// The translation extraction only skips *.test.* and *.spec.* files, so a tText()/tHtml() call in a
// mock file leaks its key into the translation files and ends up in production.
const fs = require('node:fs');
const path = require('node:path');

const MOCK_FILE_REGEX = /(^|\/)(__mocks__|mocks)\/|[.-]mocks?\.[jt]sx?$/;
const TRANSLATION_FUNCTION_REGEX = /\b(tText|tHtml)\b/;

function findFiles(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const entryPath = path.join(dir, entry.name);
		return entry.isDirectory() ? findFiles(entryPath) : [entryPath];
	});
}

const files = (process.argv.length > 2 ? process.argv.slice(2) : findFiles('src'))
	.map((file) => file.split(path.sep).join('/'))
	.filter((file) => MOCK_FILE_REGEX.test(file) && fs.existsSync(file));

const violations = files.filter((file) =>
	fs
		.readFileSync(file, 'utf8')
		.split('\n')
		.some((line) => TRANSLATION_FUNCTION_REGEX.test(line))
);

if (violations.length > 0) {
	console.error(
		'tText/tHtml must not be used in mock files, their translation keys would end up in the translation files:'
	);
	for (const file of violations) {
		console.error(`  - ${file}`);
	}
	console.error('Use a plain string in the mock instead.');
	process.exit(1);
}
