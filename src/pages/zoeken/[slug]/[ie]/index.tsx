import { kebabCase } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { useEffect } from 'react';

import { useGetIeObjectsInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { Loading } from '@shared/components';
import { ROUTE_PARTS_BY_LOCALE } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';

type MaintainerSearchPageProps = DefaultSeoInfo;

/**
 * Redirect page for urls of the form: /zoeken/:maintainerSlug/:ieObjectId => redirects to: /zoeken/:maintainerSlug/:ieObjectId/:ieObjectName
 * @constructor
 */
const IeObjectWithoutObjectNamePage: NextPage<MaintainerSearchPageProps> = () => {
	const router = useRouter();
	const { ie: objectId, slug } = router.query;

	const { data: ieObjectInfo, isError } = useGetIeObjectsInfo(objectId as string, {
		keepPreviousData: true,
		enabled: !!objectId,
	});

	// If the url is: /zoeken/:slug/:object-id => redirect to /zoeken/:slug/:object-id/:object-name
	useEffect(() => {
		if (ieObjectInfo || isError) {
			const objectTitleSlug = kebabCase(ieObjectInfo?.name || '');
			const searchUrl = stringifyUrl({
				url: `/${ROUTE_PARTS_BY_LOCALE[locale].search}/${
					ieObjectInfo?.maintainerSlug || slug
				}/${objectId}/${objectTitleSlug || 'titel'}`,
			});
			router.replace(searchUrl, undefined, { shallow: true });
		}
	}, [router, ieObjectInfo, isError, slug, objectId]);

	return <Loading owner="IeObjectWithoutObjectNamePage" fullscreen />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default IeObjectWithoutObjectNamePage;
