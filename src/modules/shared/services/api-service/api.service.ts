import ky from 'ky-universal';

import { getEnv } from '@shared/helpers/env';

export abstract class ApiService {
	protected baseUrl: string;
	protected api: typeof ky;

	constructor(path: string) {
		this.baseUrl = getEnv('PROXY_URL') + path;
		this.api = ky.create({
			prefixUrl: this.baseUrl,
			headers: {
				'content-type': 'application/json',
			},
		});
	}
}
