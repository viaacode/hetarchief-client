import { useGetIeObjectBySchemaIdentifier } from '@ie-objects/hooks/use-get-ie-object-by-schema-identifier';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { Loading } from '@shared/components/Loading';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { getIeObjectDetailPath } from '@shared/helpers/ie-object-urls';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { keepPreviousData } from '@tanstack/react-query';
import { useGetOrganisationBySlug } from '@visitor-space/hooks/get-organisation-by-slug';
import { FILTER_LABEL_VALUE_DELIMITER, SearchFilterId } from '@visitor-space/types';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC, useEffect } from 'react';

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
	const { data: organisation, isError: isErrorOrganisation } = useGetOrganisationBySlug(
		(orgSlugOrObjectSchemaIdentifier || null) as string | null,
		true,
		!!orgSlugOrObjectSchemaIdentifier
	);
	const { data: ieObjectInfo, isError: isErrorObject } = useGetIeObjectBySchemaIdentifier(
		orgSlugOrObjectSchemaIdentifier as string,
		false,
		{
			enabled: !!orgSlugOrObjectSchemaIdentifier,
			placeholderData: keepPreviousData,
		}
	);

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
				url: getIeObjectDetailPath(
					locale,
					ieObjectInfo.maintainerSlug,
					ieObjectInfo.schemaIdentifier,
					ieObjectInfo.name
				),
			});
			router.replace(searchUrl, undefined, { shallow: true });
		}
	}, [router, ieObjectInfo, locale]);

	if (isErrorOrganisation && isErrorObject) {
		return <ErrorNotFound />;
	}

	return <Loading locationId="maintainer search page redirect" fullscreen />;
};
