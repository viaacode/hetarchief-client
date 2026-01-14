import { ErrorNoAccess } from '@shared/components/ErrorNoAccess';
import { Loading } from '@shared/components/Loading';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { setShowZendesk } from '@shared/store/ui';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { AccessStatus } from '@shared/types/visit-request';
import { useGetVisitAccessStatus } from '@visit-requests/hooks/get-visit-access-status';
import { VisitorLayout } from '@visitor-layout/index';
import { WaitingPage } from '@visitor-space/components/WaitingPage';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import type { HTTPError } from 'ky';
import { useRouter } from 'next/router';
import { type FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

export const VisitRequestedPage: FC<DefaultSeoInfo> = ({
	title,
	description,
	url,
	canonicalUrl,
}) => {
	const router = useRouter();
	const locale = useLocale();
	const dispatch = useDispatch();

	const { slug } = router.query;

	/**
	 * Data
	 */

	const enabled = typeof slug === 'string';
	const {
		data: accessStatus,
		isLoading: isLoadingAccessStatus,
		error: accessStatusError,
	} = useGetVisitAccessStatus(slug as string, typeof slug === 'string');

	const hasPendingRequest = accessStatus?.status === AccessStatus.PENDING;
	const isNoAccessError = (accessStatusError as HTTPError)?.response?.status === 403;

	const { data: visitorSpace, isLoading: isLoadingSpace } = useGetVisitorSpace(
		slug as string,
		false,
		enabled && hasPendingRequest
	);

	/**
	 * Computed
	 */

	const spaceLink = ROUTES_BY_LOCALE[locale].searchSpace.replace(':slug', slug as string);

	/**
	 * Effects
	 */

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	useEffect(() => {
		if (!hasPendingRequest) {
			if (accessStatus?.status === AccessStatus.ACCESS) {
				router.replace(spaceLink);
			}
		}
	}, [router, accessStatus?.status, spaceLink, hasPendingRequest]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isLoadingAccessStatus || isLoadingSpace) {
			return <Loading fullscreen owner="request access page" />;
		}
		if (isNoAccessError) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={slug as string}
					description={tHtml(
						'pages/slug/toegang-aangevraagd/index___deze-pagina-is-niet-toegankelijk-doe-een-bezoekersaavraag-op-de-startpagina'
					)}
				/>
			);
		}
		return <WaitingPage visitorSpace={visitorSpace} />;
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={title}
				description={
					description ||
					tText('pages/slug/toegang-aangevraagd/index___beschrijving-van-een-bezoekersruimte')
				}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			{renderPageContent()}
		</VisitorLayout>
	);
};
