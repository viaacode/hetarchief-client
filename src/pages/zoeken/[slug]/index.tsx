import { kebabCase } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { useEffect } from 'react';

import { useGetIeObjectsInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { Loading } from '@shared/components';
import { ROUTE_PARTS } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetOrganisationBySlug } from '@visitor-space/hooks/get-organisation-by-slug';
import { FILTER_LABEL_VALUE_DELIMITER, VisitorSpaceFilterId } from '@visitor-space/types';

type MaintainerSearchPageProps = DefaultSeoInfo;

const MaintainerSearchPage: NextPage<MaintainerSearchPageProps> = () => {
	const router = useRouter();
	const { slug: slugOrObjectId } = router.query;
	const { data: organisation } = useGetOrganisationBySlug(
		(slugOrObjectId || null) as string | null,
		true,
		{
			enabled: !!slugOrObjectId,
		}
	);
	const { data: ieObjectInfo } = useGetIeObjectsInfo(slugOrObjectId as string, {
		keepPreviousData: true,
		enabled: !!slugOrObjectId,
	});

	// If url is: /zoeken/slug/:object-id => redirect to /zoeken/:slug/:object-id/:object-name
	useEffect(() => {
		if (organisation) {
			const searchUrl = stringifyUrl({
				url: `/${ROUTE_PARTS.search}`,
				query: {
					[VisitorSpaceFilterId.Maintainers]: `${organisation.schemaIdentifier}${FILTER_LABEL_VALUE_DELIMITER}${organisation.schemaName}`,
				},
			});
			router.replace(searchUrl, undefined, { shallow: true });
		}
	}, [router, organisation]);

	// If the url is: /zoeken/:object-id => redirect to /zoeken/:slug/:object-id/:object-name
	useEffect(() => {
		if (ieObjectInfo) {
			const searchUrl = stringifyUrl({
				url: `/${ROUTE_PARTS.search}/${ieObjectInfo.maintainerSlug}/${
					ieObjectInfo.schemaIdentifier
				}/${kebabCase(ieObjectInfo.name)}`,
			});
			router.replace(searchUrl, undefined, { shallow: true });
		}
	}, [router, ieObjectInfo]);

	return <Loading owner="maintainer search page redirect" fullscreen />;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default MaintainerSearchPage;
