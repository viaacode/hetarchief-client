import { ContentPageInfo, fetchWithLogoutJson } from '@meemoo/admin-core-ui';
import { startsWith } from 'lodash-es';
import getConfig from 'next/config';
import { stringifyUrl } from 'query-string';

import { isBrowser } from '@shared/utils';

const { publicRuntimeConfig } = getConfig();

export class ContentPageClientService {
	public static async getBySlug(slug?: string | null): Promise<ContentPageInfo | null> {
		if (!slug) {
			return null;
		}

		if (!startsWith(slug, '/')) {
			throw new Error(`Given path doesn't start with a slash. Received path: ${slug}`);
		}

		const url = stringifyUrl({
			url: `${
				isBrowser() ? publicRuntimeConfig.PROXY_URL : process.env.PROXY_URL
			}/admin/content-pages`,
			query: {
				path: slug,
			},
		});

		return fetchWithLogoutJson<ContentPageInfo | null>(url);
	}
}
