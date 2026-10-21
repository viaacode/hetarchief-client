import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const SCRIPT_PATH = resolve(__dirname, 'check-no-translations-in-mocks.js');

describe('Script: check-no-translations-in-mocks', () => {
	let tempDir: string;

	beforeEach(() => {
		tempDir = mkdtempSync(join(tmpdir(), 'check-mocks-'));
	});

	afterEach(() => {
		rmSync(tempDir, { recursive: true, force: true });
	});

	function writeFile(relativePath: string, content: string): string {
		const filePath = join(tempDir, relativePath);
		mkdirSync(dirname(filePath), { recursive: true });
		writeFileSync(filePath, content);
		return filePath;
	}

	function runScript(args: string[] = []) {
		return spawnSync('node', [SCRIPT_PATH, ...args], { cwd: tempDir, encoding: 'utf8' });
	}

	it.each([
		'src/__mocks__/a.ts',
		'src/Foo/__mocks__/foo.tsx',
		'src/Foo/mocks/foo.ts',
		'src/Foo/Foo.mock.ts',
		'src/Foo/navigation.mocks.tsx',
		'src/Foo/media-card-list-mocks.ts',
	])('fails when %s calls tText', (relativePath) => {
		const filePath = writeFile(relativePath, "const label = tText('some___key');");

		const result = runScript([filePath]);

		expect(result.status).toBe(1);
		expect(result.stderr).toContain(filePath);
	});

	it('fails when a mock file calls tHtml or only imports the translation helper', () => {
		const htmlFile = writeFile('src/__mocks__/html.tsx', "const el = tHtml('some___key');");
		const importFile = writeFile(
			'src/__mocks__/import.ts',
			"import { tText } from '@shared/helpers/translate';"
		);

		const result = runScript([htmlFile, importFile]);

		expect(result.status).toBe(1);
		expect(result.stderr).toContain(htmlFile);
		expect(result.stderr).toContain(importFile);
	});

	it('only reports the offending mock files', () => {
		const badFile = writeFile('src/__mocks__/bad.ts', "tText('some___key');");
		const cleanFile = writeFile('src/__mocks__/clean.ts', "const label = 'Meer acties';");

		const result = runScript([badFile, cleanFile]);

		expect(result.status).toBe(1);
		expect(result.stderr).toContain(badFile);
		expect(result.stderr).not.toContain(cleanFile);
	});

	it('passes for a mock file without translation functions', () => {
		const filePath = writeFile('src/__mocks__/a.ts', "const label = 'Meer acties';");

		expect(runScript([filePath]).status).toBe(0);
	});

	it('ignores translation functions in files that are not mocks', () => {
		const component = writeFile('src/Foo/Foo.tsx', "tText('some___key');");
		const test = writeFile('src/Foo/Foo.test.tsx', "tText('some___key');");

		expect(runScript([component, test]).status).toBe(0);
	});

	it('does not match identifiers that merely contain tText or tHtml', () => {
		const filePath = writeFile('src/__mocks__/a.ts', 'const contextText = tTextual + myTHtml;');

		expect(runScript([filePath]).status).toBe(0);
	});

	it('ignores staged files that no longer exist', () => {
		expect(runScript([join(tempDir, 'src/__mocks__/deleted.ts')]).status).toBe(0);
	});

	it('scans the src folder when no files are passed', () => {
		writeFile('src/Foo/__mocks__/foo.ts', "tText('some___key');");

		const result = runScript();

		expect(result.status).toBe(1);
		expect(result.stderr).toContain('src/Foo/__mocks__/foo.ts');
	});

	it('passes the src scan when no mock uses a translation function', () => {
		writeFile('src/Foo/__mocks__/foo.ts', "const label = 'Meer acties';");
		writeFile('src/Foo/Foo.tsx', "tText('some___key');");

		expect(runScript().status).toBe(0);
	});
});
