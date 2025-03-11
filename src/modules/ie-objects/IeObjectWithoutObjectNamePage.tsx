import { kebabCase } from 'lodash-es';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC, useEffect } from 'react';

import { useGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { Loading } from '@shared/components/Loading';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import type { DefaultSeoInfo } from '@shared/types/seo';

type MaintainerSearchPageProps = DefaultSeoInfo;

/**
 * Redirect page for urls of the form: /zoeken/:maintainerSlug/:ieObjectId => redirects to: /zoeken/:maintainerSlug/:ieObjectId/:ieObjectName
 * @constructor
 */
export const IeObjectWithoutObjectNamePage: FC<MaintainerSearchPageProps> = () => {
	const router = useRouter();
	const locale = useLocale();
	const { ie: schemaIdentifier, slug } = router.query;

	const { data: ieObjectInfo, isError } = useGetIeObjectInfo(schemaIdentifier as string, {
		keepPreviousData: true,
		enabled: !!schemaIdentifier,
	});

	// If the url is: /zoeken/:slug/:object-id => redirect to /zoeken/:slug/:object-id/:object-name
	useEffect(() => {
		if (ieObjectInfo || isError) {
			const objectTitleSlug = kebabCase(ieObjectInfo?.name || '');
			const searchUrl = stringifyUrl({
				url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}/${ieObjectInfo?.maintainerSlug || slug}/${schemaIdentifier}/${objectTitleSlug || 'titel'}`,
			});
			router.replace(searchUrl, undefined, { shallow: true });
		}
	}, [router, ieObjectInfo, isError, slug, schemaIdentifier, locale]);

	return <Loading owner="IeObjectWithoutObjectNamePage" fullscreen />;
};
