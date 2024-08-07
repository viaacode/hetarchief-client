import { type ContentPageInfo, fetchWithLogoutJson } from '@meemoo/admin-core-ui';
import { startsWith } from 'lodash-es';
import getConfig from 'next/config';
import { stringifyUrl } from 'query-string';

import { type Locale } from '@shared/utils/i18n';

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

		return fetchWithLogoutJson<ContentPageInfo | null>(url);
	}
}
