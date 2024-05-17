import { HTTPError } from 'ky';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { ComponentType } from 'react';
import { useSelector } from 'react-redux';

import { selectIsLoggedIn } from '@auth/store/user';
import { ErrorNoAccessToObject, ErrorNotFound, Loading } from '@shared/components';
import { ErrorSpaceNoLongerActive } from '@shared/components/ErrorSpaceNoLongerActive';
import { NextRedirect } from '@shared/components/Redirect/Redirect.tsx';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { getDefaultStaticProps } from '@shared/helpers/get-default-server-side-props';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { AccessStatus } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetOrganisationBySlug } from '@visitor-space/hooks/get-organisation-by-slug';
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
	const locale = useLocale();
	const { slug } = router.query;
	const isLoggedIn = useSelector(selectIsLoggedIn);

	/**
	 * Data
	 */

	const { data: accessStatus, isLoading: isLoadingAccessStatus } = useGetVisitAccessStatus(
		slug as string,
		typeof slug === 'string'
	);

	const { data: organisation, isLoading: isLoadingOrganisation } = useGetOrganisationBySlug(
		(slug || null) as string | null
	);

	// get visitor space info, used to display contact information
	const {
		data: visitorSpaceInfo,
		error: visitorSpaceError,
		isLoading: isLoadingSpaceInfo,
	} = useGetVisitorSpace(slug as string, false);

	const hasPendingRequest = accessStatus?.status === AccessStatus.PENDING;
	const hasAccess = accessStatus?.status === AccessStatus.ACCESS;
	const isErrorSpaceNotActive = (visitorSpaceError as HTTPError)?.response?.status === 410;

	/**
	 * Render
	 */

	const renderNoAccess = () => {
		return (
			<ErrorNoAccessToObject
				description={tText(
					'pages/bezoek/slug/index___je-hebt-geen-toegang-tot-deze-bezoekersruimte-vraag-toegang-aan-of-doorzoek-de-publieke-catalogus'
				)}
				visitorSpaceName={(visitorSpaceInfo?.name || slug || null) as string | null}
				visitorSpaceSlug={(slug || null) as string | null}
			/>
		);
	};

	const renderLoading = () => {
		return <Loading fullscreen owner="request access page" />;
	};

	const renderPageContent = () => {
		if (isLoadingAccessStatus || isLoadingSpaceInfo || isLoadingOrganisation) {
			return renderLoading();
		}

		// https://meemoo.atlassian.net/browse/ARC-1965
		if (!isLoggedIn) {
			return renderNoAccess();
		} else {
			if (isErrorSpaceNotActive) {
				// Visitor space no longer active
				return <ErrorSpaceNoLongerActive />;
			} else if (visitorSpaceInfo) {
				if (hasPendingRequest) {
					// Redirect to the waiting page
					return (
						<>
							{renderLoading()}
							<NextRedirect
								to={ROUTES_BY_LOCALE[locale].visitRequested.replace(
									':slug',
									slug as string
								)}
								method="replace"
							/>
						</>
					);
				} else if (!hasAccess) {
					// No access to visitor space
					return renderNoAccess();
				} else {
					// Has access => redirect to search page for visitor space
					return (
						<>
							{renderLoading()}
							<NextRedirect
								to={stringifyUrl({
									url: ROUTES_BY_LOCALE[locale].search,
									query: { [VisitorSpaceFilterId.Maintainer]: slug },
								})}
								method="replace"
							/>
						</>
					);
				}
			} else {
				// Visitor space does not exist
				if (organisation) {
					// Maintainer does exist => redirect to search page with filter on maintainer
					return (
						<>
							{renderLoading()}
							<NextRedirect
								to={stringifyUrl({
									url: ROUTES_BY_LOCALE[locale].search,
									query: {
										[VisitorSpaceFilterId.Maintainers]:
											organisation?.schemaIdentifier +
											'---' +
											organisation?.schemaName,
									},
								})}
								method="replace"
							/>
						</>
					);
				} else {
					// Maintainer also doesn't exist
					return <ErrorNotFound />;
				}
			}
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

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> =
		await getDefaultStaticProps(context);

	return {
		props: {
			...(defaultProps as { props: DefaultSeoInfo }).props,
			name: space?.name || null,
			description: space?.info || null,
		},
	};
}

export default VisitPage as ComponentType;
