import Cors from 'cors';
import { type NextApiRequest, type NextApiResponse } from 'next';

import { Locale } from '@shared/utils/i18n';

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

	if (!req.query.path) {
		res.status(400).json({
			message:
				'You must provide a valid path in the query param "path", containing the path of the page for which you want to clear the cache',
			query: req.query,
		});
		return;
	}

	if (!req.query.language) {
		res.status(400).json({
			message:
				'You must provide a valid path in the query param "language", containing the language code of the page for which you want to clear the cache',
			query: req.query,
		});
		return;
	}

	const language = req.query.language as string;
	const path = req.query.path as string;

	try {
		await res.revalidate(`/${language.toLowerCase()}${path}`);
		if (language === Locale.nl) {
			await res.revalidate(path);
		}
		res.json({ message: 'cache for route has been cleared' });
	} catch (err) {
		res.status(500).json({
			message: 'Failed to clear the cache',
			innerException: err,
			additionalInfo: { query: req.query },
		});
	}
}
