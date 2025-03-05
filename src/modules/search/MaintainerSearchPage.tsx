import { kebabCase } from 'lodash-es';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC, useEffect } from 'react';

import { useGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { Loading } from '@shared/components/Loading';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { IeObjectsSearchFilterField } from '@shared/types/ie-objects';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { AdvancedFilterArrayParam } from '@visitor-space/const/advanced-filter-array-param';
import { useGetOrganisationBySlug } from '@visitor-space/hooks/get-organisation-by-slug';
import { FILTER_LABEL_VALUE_DELIMITER, type FilterValue, Operator } from '@visitor-space/types';

type MaintainerSearchPageProps = DefaultSeoInfo;

export const MaintainerSearchPage: FC<MaintainerSearchPageProps> = () => {
	const router = useRouter();
	const locale = useLocale();
	const { slug: slugOrObjectId } = router.query;
	const { data: organisation } = useGetOrganisationBySlug(
		(slugOrObjectId || null) as string | null,
		true,
		{
			enabled: !!slugOrObjectId,
		}
	);
	const { data: ieObjectInfo } = useGetIeObjectInfo(slugOrObjectId as string, {
		keepPreviousData: true,
		enabled: !!slugOrObjectId,
	});

	// If url is: /zoeken/slug/:object-id => redirect to /zoeken/:slug/:object-id/:object-name
	useEffect(() => {
		if (organisation) {
			const filterValue: FilterValue = {
				field: IeObjectsSearchFilterField.MAINTAINER_ID,
				operator: Operator.IS,
				multiValue: [
					`${organisation.schemaIdentifier}${FILTER_LABEL_VALUE_DELIMITER}${organisation.schemaName}`,
				],
			};
			const searchUrl = stringifyUrl({
				url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}`,
				query: {
					[IeObjectsSearchFilterField.MAINTAINER_ID]: AdvancedFilterArrayParam.encode([
						filterValue,
					]),
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
