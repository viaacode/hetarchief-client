/**
 * This script runs over all files that match *.gql.ts and extracts the gql queries and outputs them to the client-whitelist.json file in /scripts
 * It is almost identical to the version in the proxy repository BUT
 * - it uses a different regex
 * - it copies the resulting file from the client to the proxy repo, since it has to be committed in the proxy.
 */
import * as path from 'path';

import fse from 'fs-extra';
import glob from 'glob';
import { split } from 'lodash';

const logger = {
	error: (message, err = null) => {
		const now = new Date().toISOString();
		console.log(`${now} [ERROR] ${message}`, err?.stack || '');
	},
	warn: (message, obj = null) => {
		const now = new Date().toISOString();
		console.log(`${now} [WARN] ${message}`, obj || '');
	},
	info: (message, obj = null) => {
		const now = new Date().toISOString();
		console.log(`${now} [info] ${message}`, obj || '');
	},
};

if (!process.env.PROXY_PATH) {
	throw new Error('PROXY_PATH env var is required');
}

const gqlRegex = /const ([^\s]+) = gql`([^`]+?)`/gm;

/**
 * Extracts label of query
 * example: query getCollectionNamesByOwner($owner_profile_id: uuid) { app_collections( wher...
 * would return: getCollectionNamesByOwner
 * @param query
 */
function getQueryLabel(query: string): string {
	return split(query, /[ ({]/)[1];
}

async function whitelistQueries() {
	const options = {
		cwd: path.join(__dirname, '../src'),
	};

	const files = glob.sync('**/*.gql.ts', options);

	const queries: { [queryName: string]: string } = {};
	const queryLabels: string[] = [];

	try {
		// Find and extract queries
		files.forEach((relativeFilePath: string) => {
			try {
				const absoluteFilePath = `${options.cwd}/${relativeFilePath}`;
				const content: string = fse.readFileSync(absoluteFilePath).toString();

				let matches: RegExpExecArray | null;
				do {
					matches = gqlRegex.exec(content);
					if (matches) {
						const name = matches[1];
						const query = matches[2];
						if (query.includes('${')) {
							logger.warn(
								`Extracting graphql queries with javascript template parameters isn't supported: ${name}`
							);
						}

						if (queries[name]) {
							logger.error(
								`Query with the same variable name is found twice. This will cause a conflicts in the query whitelist: ${name}`
							);
						}

						const label = getQueryLabel(query);
						if (queryLabels.includes(label)) {
							logger.error(
								`Query with the same label is found twice. This will cause a conflicts in the query whitelist: ${label}`
							);
						}
						queryLabels.push(label);

						// Remove new lines and tabs
						// Trim whitespace
						queries[name] = query.replace(/[\t\r\n]+/gm, ' ').trim();
					}
				} while (matches);
			} catch (err) {
				logger.error(`Failed to find queries in file: ${relativeFilePath}`, err);
			}
		});

		const outputFile = path.join(__dirname, 'client-whitelist.json');
		await fse.writeFile(outputFile, JSON.stringify(queries, null, 2));

		logger.info(
			`Found ${
				Object.keys(queries).length
			} queries, outputted to: ${outputFile}. Copy this file to /scripts folder in the avo2 proxy` // TODO
		);
	} catch (err) {
		logger.error('Failed to extract and upload graphql query whitelist', JSON.stringify(err));
	}
}

function copyWhitelistToProxy() {
	const sourceFile = path.join(__dirname, 'client-whitelist.json');
	const dest = path.join(process.env.PROXY_PATH, 'scripts', 'client-whitelist.json');
	fse.copySync(sourceFile, dest);
	logger.info('Whitelist file copied to proxy');
}

async function run() {
	await whitelistQueries();
	copyWhitelistToProxy();
}

run();
