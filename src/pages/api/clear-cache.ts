import fs from 'node:fs/promises';
import path from 'node:path';

import Cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next';

async function fileExists(filename: string): Promise<boolean> {
	try {
		await fs.access(filename);
		return true;
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			return false;
		} else {
			throw err;
		}
	}
}

async function deleteFolderRecursive(folderPath: string) {
	if (await fileExists(folderPath)) {
		await fs.rm(folderPath, { recursive: true, force: true });
	}
}

async function clearNextCache() {
	const nextCachePath = path.join(__dirname, '.next', 'cache');
	const nextServerPagesPath = path.join(__dirname, '.next', 'server', 'pages');

	await Promise.all([
		deleteFolderRecursive(nextCachePath),
		deleteFolderRecursive(nextServerPagesPath),
	]);
}

// Initializing the cors middleware
const cors = Cors({
	methods: ['GET', 'HEAD'],
});

type middlewareHandler = (
	req: NextApiRequest,
	res: NextApiResponse,
	fn: (result: unknown) => unknown
) => unknown;

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: middlewareHandler) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result: unknown) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
	await runMiddleware(req, res, cors);

	if (req.headers?.apikey !== process.env.CLIENT_API_KEY) {
		res.status(401).json({
			message: 'Invalid api key. You need to provide a valid api key in the "apikey" header',
			headers: req.headers,
		});
		return;
	}

	try {
		await clearNextCache();
		res.json({ message: 'The NextJS cache has been cleared' });
	} catch (err) {
		res.status(500).json({
			message: 'Failed to clear the cache',
			innerException: err,
			additionalInfo: { query: req.query },
		});
	}
}
