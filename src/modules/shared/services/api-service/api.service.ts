import ky from 'ky-universal';
import { KyInstance } from 'ky/distribution/types/ky';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export abstract class ApiService {
	private static api: KyInstance | null = null;

	public static getApi(): KyInstance {
		if (!ApiService.api) {
			this.api = ky.create({
				prefixUrl: publicRuntimeConfig.PROXY_URL,
				headers: {
					'content-type': 'application/json',
				},
				credentials: 'include', // TODO change to same-origin once working on server
			});
		}
		return this.api as KyInstance;
	}
}
