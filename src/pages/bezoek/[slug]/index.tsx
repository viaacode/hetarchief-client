import { HTTPError } from 'ky';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { ComponentType, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectIsLoggedIn } from '@auth/store/user';
import { ErrorNoAccessToObject, ErrorNotFound, Loading } from '@shared/components';
import { ErrorSpaceNoLongerActive } from '@shared/components/ErrorSpaceNoLongerActive';
import { ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import useTranslation from '@shared/hooks/use-translation/use-translation';
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
	const { tText } = useTranslation();
	const router = useRouter();
	const { slug } = router.query;
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const [showNoAccess, setShowNoAccess] = useState(false);

	/**
	 * Data
	 */

	const { data: accessStatus, isLoading: isLoadingAccessStatus } = useGetVisitAccessStatus(
		slug as string,
		typeof slug === 'string'
	);

	// get visitor space info, used to display contact information
	const {
		data: visitorSpaceInfo,
		error: visitorSpaceError,
		isLoading: isLoadingSpaceInfo,
	} = useGetVisitorSpace(router.query.slug as string, false);

	const hasPendingRequest = accessStatus?.status === AccessStatus.PENDING;
	const hasAccess = accessStatus?.status === AccessStatus.ACCESS;
	const isErrorSpaceNotActive = (visitorSpaceError as HTTPError)?.response?.status === 410;
	const isErrorSpaceNotFound = (visitorSpaceError as HTTPError)?.response?.status === 404;

	/**
	 * Effects
	 */

	useEffect(() => {
		if (hasPendingRequest) {
			router.push(ROUTES.visitRequested.replace(':slug', slug as string));
			return;
		}

		if (hasAccess) {
			router.push(
				stringifyUrl({
					url: ROUTES.search,
					query: { [VisitorSpaceFilterId.Maintainer]: slug },
				})
			);
			return;
		}

		if (
			!isLoadingAccessStatus &&
			!isLoadingSpaceInfo &&
			!hasAccess &&
			!isErrorSpaceNotFound &&
			!isErrorSpaceNotActive
		) {
			// If not logged in show no access page
			if (!isLoggedIn || !hasAccess) {
				return;
			}

			// No access to the visitor space, but the maintainer exists => so we can redirect to the search page
			router.push(
				stringifyUrl({
					url: ROUTES.search,
					query: {
						[VisitorSpaceFilterId.Maintainers]:
							visitorSpaceInfo?.maintainerId + '---' + visitorSpaceInfo?.name,
					},
				})
			);
			return;
		}
	}, [
		router,
		hasPendingRequest,
		hasAccess,
		slug,
		isLoadingAccessStatus,
		isLoadingSpaceInfo,
		isErrorSpaceNotFound,
		visitorSpaceInfo?.maintainerId,
		visitorSpaceInfo?.name,
		isErrorSpaceNotActive,
	]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isLoadingAccessStatus) {
			return <Loading fullscreen owner="request access page" />;
		}
		if (!isLoggedIn || !hasAccess) {
			return (
				<ErrorNoAccessToObject
					description={tText(
						'pages/bezoek/slug/index___je-hebt-geen-toegang-tot-deze-bezoekersruimte-vraag-toegang-aan-of-doorzoek-de-publieke-catalogus'
					)}
					visitorSpaceName={(slug || null) as string | null}
					visitorSpaceSlug={(slug || null) as string | null}
				/>
			);
		}

		if (
			isLoadingAccessStatus ||
			isLoadingSpaceInfo ||
			hasPendingRequest ||
			hasAccess ||
			(!isLoadingAccessStatus &&
				!isLoadingSpaceInfo &&
				!hasAccess &&
				!isErrorSpaceNotFound &&
				!isErrorSpaceNotActive)
		) {
			// Show loading since we're handing the redirect in the useEffect above
			return <Loading fullscreen owner="request access page" />;
		}

		if (isErrorSpaceNotFound) {
			return <ErrorNotFound />;
		}

		if (isErrorSpaceNotActive) {
			return <ErrorSpaceNoLongerActive />;
		}

		return (
			<ErrorNoAccessToObject
				description={tText(
					'pages/bezoek/slug/index___je-hebt-geen-toegang-tot-deze-bezoekersruimte-vraag-toegang-aan-of-doorzoek-de-publieke-catalogus'
				)}
				visitorSpaceName={(slug || null) as string | null}
				visitorSpaceSlug={(slug || null) as string | null}
			/>
		);
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

export default VisitPage as ComponentType;
