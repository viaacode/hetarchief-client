/**
 This script runs over all the code and looks for either:
tHtml('Aanvraagformulier')
or
tText('Aanvraagformulier')

and replaces them with:
tHTml('authentication/views/registration-flow/r-4-manual-registration___aanvraagformulier')
or
tText('authentication/views/registration-flow/r-4-manual-registration___aanvraagformulier')


and it also outputs a json file with the translatable strings:
{
	"authentication/views/registration-flow/r-4-manual-registration___aanvraagformulier": "Aanvraagformulier"
}

Every time the `npm run extract-translations` command is run, it will extract new translations that it finds
(without i18nKey or not containing "___")
and add them to the json file without overwriting the existing strings.

We can now give the src/shared/translations/nl.json file to team meemoo to enter the final copy.
 */

import * as fs from 'fs';
import * as path from 'path';

import glob from 'glob';
import { intersection, kebabCase, keys, without } from 'lodash-es';
import fetch from 'node-fetch';

import localTranslations from '../public/locales/nl/common.json';

type keyMap = Record<string, string>;

const oldTranslations: keyMap = localTranslations;

function getFormattedKey(filePath: string, key: string) {
	try {
		const fileKey = filePath
			.replace(/[\\/]+/g, '/')
			.split('.')[0]
			.split(/[\\/]/g)
			.map((part) => kebabCase(part))
			.join('/')
			.toLowerCase()
			.replace(/(^\/+|\/+$)/g, '')
			.trim();
		const formattedKey = kebabCase(key);

		return `${fileKey}___${formattedKey}`;
	} catch (err) {
		console.error('Failed to format key', filePath, key);
	}
}

function getFormattedTranslation(translation: string) {
	if (!translation) {
		return translation;
	}
	return translation.trim().replace(/\t\t(\t)+/g, ' ');
}

async function getFilesByGlob(globPattern: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		const options = {
			ignore: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
			cwd: path.join(__dirname, '../src'),
		};
		glob(globPattern, options, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
}

function extractTranslationsFromCodeFiles(codeFiles: string[]) {
	const newTranslations: keyMap = {};
	// Find and extract translations, replace strings with translation keys
	codeFiles.forEach((relativeFilePath: string) => {
		try {
			const absoluteFilePath = path.resolve(__dirname, '../src', relativeFilePath);
			const content: string = fs.readFileSync(absoluteFilePath).toString();

			// Replace tHtml() and tText() functions
			const beforeTFunction = '([^a-zA-Z])';
			const tFuncStart = '(tHtml|tText)\\(';
			const whitespace = '\\s*';
			const quote = '[\'"]';
			const translation = '([\\s\\S]+?)';
			const translationVariables = `([s]*|,[^)]*)?`;
			const tFuncEnd = '\\)';
			const combinedRegex = [
				beforeTFunction,
				tFuncStart,
				whitespace,
				quote,
				translation,
				quote,
				whitespace,
				translationVariables,
				whitespace,
				tFuncEnd,
			].join('');
			const regex = new RegExp(combinedRegex, 'gim');
			const newContent = content.replace(
				// Match char before t function to make sure it isn't part of a bigger function name, eg: sent()
				regex,
				(
					match: string,
					prefix: string,
					tFunction: string,
					translation: string,
					translationParams: string | undefined
				) => {
					let formattedKey: string | undefined;
					const formattedTranslation: string = getFormattedTranslation(translation);
					if (formattedTranslation.includes('___')) {
						formattedKey = formattedTranslation;
					} else {
						formattedKey = getFormattedKey(relativeFilePath, formattedTranslation);
					}

					if (!formattedKey) {
						return match; // Do not modify the translations, since we cannot generate a key
					}

					if ((translationParams || '').includes('(')) {
						console.warn(
							'WARNING: Translation params should not contain any function calls, ' +
								'since the regex replacement cannot deal with brackets inside the t() function. ' +
								'Store the translation params in a variable before calling the t() function.',
							{
								match,
								prefix,
								tFunction,
								translation,
								translationParams,
								absoluteFilePath,
							}
						);
					}
					// If translation contains '___', use original translation, otherwise use translation found by the regexp
					const hasKeyAlready = formattedTranslation.includes('___');
					if (hasKeyAlready && !(oldTranslations as keyMap)[formattedKey]) {
						console.error('Failed to find old translation for key: ', formattedKey);
					}
					newTranslations[formattedKey] =
						(hasKeyAlready
							? getFormattedTranslation((oldTranslations as keyMap)[formattedKey])
							: formattedTranslation) || '';

					if (hasKeyAlready) {
						return match;
					} else {
						return `${prefix}${tFunction}('${formattedKey}'${translationParams || ''})`;
					}
				}
			);

			if (content !== newContent) {
				fs.writeFileSync(absoluteFilePath, newContent);
			}
		} catch (err) {
			console.error(`Failed to find translations in file: ${relativeFilePath}`, err);
		}
	});
	return newTranslations;
}

async function getOnlineTranslations() {
	const response = await fetch(
		`https://hetarchief-proxy-qas.hetarchief.be/translations/nl.json`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);

	return await response.json();
}

function checkTranslationsForKeysAsValue(translationJson: string) {
	// Identify  if any translations contain "___", then something went wrong with the translations
	const faultyTranslations = [];
	const faultyTranslationRegexp = /"(.*___.*)": ".*___/g;
	let matches: RegExpExecArray | null;
	do {
		matches = faultyTranslationRegexp.exec(translationJson);
		if (matches) {
			faultyTranslations.push(matches[1]);
		}
	} while (matches);

	if (faultyTranslations.length) {
		throw new Error(`
			Failed to extract translations, the following translations would be overridden by their key:
				\t${faultyTranslations.join('\n\t')}
		`);
	}
}

function sortObjectKeys(objToSort: Record<string, any>): Record<string, any> {
	return Object.keys(objToSort)
		.sort()
		.reduce((obj: Record<string, string>, key) => {
			obj[key] = objToSort[key];
			return obj;
		}, {});
}

async function updateTranslations(): Promise<void> {
	const onlineTranslations = await getOnlineTranslations();

	// Extract translations from code and replace code by reference to translation key
	const codeFiles = await getFilesByGlob('**/*.@(ts|tsx)');
	const newTranslations: keyMap = extractTranslationsFromCodeFiles(codeFiles);

	// Compare existing translations to the new translations
	const oldTranslationKeys: string[] = keys(oldTranslations);
	const newTranslationKeys: string[] = keys(newTranslations);
	const addedTranslationKeys: string[] = without(newTranslationKeys, ...oldTranslationKeys);
	const removedTranslationKeys: string[] = without(oldTranslationKeys, ...newTranslationKeys);
	const existingTranslationKeys: string[] = intersection(newTranslationKeys, oldTranslationKeys);

	// Console log translations that were found in the json file but not in the code
	console.warn(`
		The following translation keys were removed:
			\t${removedTranslationKeys.map((key) => key.trim()).join('\n\t')}
	`);

	// Combine the translations in the json with the freshly extracted translations from the code
	const combinedTranslations: keyMap = {};
	existingTranslationKeys.forEach((key: string) => {
		combinedTranslations[key] = onlineTranslations[key] || oldTranslations[key];
	});
	addedTranslationKeys.forEach((key: string) => {
		combinedTranslations[key] = onlineTranslations[key] || newTranslations[key];
	});

	const nlJsonContent = JSON.stringify(sortObjectKeys(combinedTranslations), null, 2);
	checkTranslationsForKeysAsValue(nlJsonContent); // Throws error if any key is found as a value

	fs.writeFileSync(
		`${__dirname.replace(/\\/g, '/')}/../public/locales/nl/common.json`,
		nlJsonContent
	);

	const totalTranslations = existingTranslationKeys.length + addedTranslationKeys.length;

	console.info(`
		Wrote ${totalTranslations} src/shared/translations/nl.json file
			\t${addedTranslationKeys.length} translations added
			\t${removedTranslationKeys.length} translations deleted
	`);
}

updateTranslations().catch((err) => console.error('Update of translations failed: ', err));
