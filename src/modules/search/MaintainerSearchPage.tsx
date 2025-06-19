import { kebabCase } from 'lodash-es';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC, useEffect } from 'react';

import { useGetIeObjectInfo } from '@ie-objects/hooks/use-get-ie-objects-info';
import { Loading } from '@shared/components/Loading';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { useGetOrganisationBySlug } from '@visitor-space/hooks/get-organisation-by-slug';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '@visitor-space/types';

type MaintainerSearchPageProps = DefaultSeoInfo;

export const MaintainerSearchPage: FC<MaintainerSearchPageProps> = () => {
	const router = useRouter();
	const locale = useLocale();

	/**
	 * url format is either
	 *  /zoeken/slug/:object-id
	 *  /zoeken/:object-id (deprecated, use /pid/object-id instead)
	 */
	const { slug: orgSlugOrObjectSchemaIdentifier } = router.query;
	const { data: organisation } = useGetOrganisationBySlug(
		(orgSlugOrObjectSchemaIdentifier || null) as string | null,
		true,
		{
			enabled: !!orgSlugOrObjectSchemaIdentifier,
		}
	);
	const { data: ieObjectInfo } = useGetIeObjectInfo(orgSlugOrObjectSchemaIdentifier as string, {
		keepPreviousData: true,
		enabled: !!orgSlugOrObjectSchemaIdentifier,
	});

	// If url is: /zoeken/slug/:object-id => redirect to /zoeken/:slug/:object-id/:object-name
	useEffect(() => {
		if (organisation) {
			const searchUrl = stringifyUrl({
				url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}`,
				query: {
					[SearchFilterId.Maintainers]: `${organisation.schemaIdentifier}${FILTER_LABEL_VALUE_DELIMITER}${organisation.schemaName}`,
				},
			});
			router.replace(searchUrl, undefined, { shallow: true });
		}
	}, [router, organisation, locale]);

	// If the url is: /zoeken/:object-id => redirect to /zoeken/:slug/:object-id/:object-name
	useEffect(() => {
		if (ieObjectInfo) {
			const searchUrl = stringifyUrl({
				url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}/${ieObjectInfo.maintainerSlug}/${ieObjectInfo.schemaIdentifier}/${kebabCase(ieObjectInfo.name)}`,
			});
			router.replace(searchUrl, undefined, { shallow: true });
		}
	}, [router, ieObjectInfo, locale]);

	return <Loading owner="maintainer search page redirect" fullscreen />;
};
