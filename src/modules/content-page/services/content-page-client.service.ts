import type { ContentPageInfo } from '@meemoo/admin-core-ui/client';
import getConfig from '@shared/config/public-runtime-config';
import type { Locale } from '@shared/utils/i18n';
import { startsWith } from 'es-toolkit/compat';
import { stringifyUrl } from 'query-string';

const { publicRuntimeConfig } = getConfig();

export class ContentPageClientService {
	public static async getByLanguageAndPath(
		language: Locale,
		path?: string | null
	): Promise<ContentPageInfo | null> {
		if (!path) {
			return null;
		}

		if (!startsWith(path, '/')) {
			throw new Error(`Given path doesn't start with a slash. Received path: ${path}`);
		}

		const url = stringifyUrl({
			url: `${publicRuntimeConfig.PROXY_URL}/admin/content-pages/by-language-and-path`,
			query: {
				language,
				path,
			},
		});
		const { fetchWithLogoutJson } = await import('@meemoo/admin-core-ui/admin');
		return fetchWithLogoutJson(url);
	}
}
