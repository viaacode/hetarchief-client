import { HTTPError } from 'ky';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { ComponentType, useEffect } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { ErrorNotFound, Loading } from '@shared/components';
import { ErrorSpaceNoLongerActive } from '@shared/components/ErrorSpaceNoLongerActive';
import { ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { AccessStatus } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceService } from '@visitor-space/services';
import { VisitorSpaceFilterId, VisitorSpaceInfo } from '@visitor-space/types';
import { useGetVisitAccessStatus } from '@visits/hooks/get-visit-access-status';

import { VisitorLayout } from 'modules/visitors';

type VisitPageProps = {
	name: string | null;
	description: string | null;
	url: string;
} & DefaultSeoInfo;

const VisitPage: NextPage<VisitPageProps> = () => {
	const router = useRouter();
	const { slug } = router.query;

	/**
	 * Data
	 */

	const { data: accessStatus, isLoading: isLoadingAccessStatus } = useGetVisitAccessStatus(
		slug as string,
		typeof slug === 'string'
	);

	// get visitor space info, used to display contact information
	const { error: visitorSpaceError } = useGetVisitorSpace(router.query.slug as string, false);

	const hasPendingRequest = accessStatus?.status === AccessStatus.PENDING;
	const hasNoAccess = accessStatus?.status === AccessStatus.NO_ACCESS;
	const hasAccess = accessStatus?.status === AccessStatus.ACCESS;
	const isErrorSpaceNotActive = (visitorSpaceError as HTTPError)?.response?.status === 410;

	/**
	 * Effects
	 */

	useEffect(() => {
		if (hasPendingRequest) {
			router.push(ROUTES.visitRequested.replace(':slug', slug as string));
		}

		if (hasAccess) {
			router.push(
				stringifyUrl({
					url: ROUTES.search,
					query: { [VisitorSpaceFilterId.Maintainer]: slug },
				})
			);
		}
	}, [router, accessStatus?.status, hasPendingRequest]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isLoadingAccessStatus || hasPendingRequest || hasAccess) {
			return <Loading fullscreen owner="request access page" />;
		}

		if (isErrorSpaceNotActive) {
			return <ErrorSpaceNoLongerActive />;
		}

		if (hasNoAccess) {
			return <ErrorNotFound />;
		}
	};

	return <VisitorLayout>{renderPageContent()}</VisitorLayout>;
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<VisitPageProps>> {
	let space: VisitorSpaceInfo | null = null;
	try {
		space = await VisitorSpaceService.getBySlug(context.query.slug as string, true);
	} catch (err) {
		console.error('Failed to fetch media info by id: ' + context.query.ie, err);
	}

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> = await getDefaultServerSideProps(
		context
	);

	return {
		props: {
			...(defaultProps as { props: DefaultSeoInfo }).props,
			name: space?.name || null,
			description: space?.info || null,
		},
	};
}

export default withAuth(VisitPage as ComponentType, true);
