import { type HTTPError } from 'ky';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { type FC } from 'react';
import { useSelector } from 'react-redux';

import { selectIsLoggedIn } from '@auth/store/user';
import { ErrorNoAccessToObject } from '@shared/components/ErrorNoAccessToObject';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { ErrorSpaceNoLongerActive } from '@shared/components/ErrorSpaceNoLongerActive';
import { Loading } from '@shared/components/Loading';
import { NextRedirect } from '@shared/components/Redirect/Redirect.tsx';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { AccessStatus } from '@shared/types/visit';
import { useGetVisitAccessStatus } from '@visit-requests/hooks/get-visit-access-status';
import { useGetOrganisationBySlug } from '@visitor-space/hooks/get-organisation-by-slug';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { SearchFilterId } from '@visitor-space/types';

import { VisitorLayout } from '../../visitor-layout';

export const VisitPage: FC<DefaultSeoInfo> = ({ title, description, url }) => {
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
									query: { [SearchFilterId.Maintainer]: slug },
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
										[SearchFilterId.Maintainers]:
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

	return (
		<VisitorLayout>
			<SeoTags
				title={title}
				description={description}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			{renderPageContent()}
		</VisitorLayout>
	);
};
