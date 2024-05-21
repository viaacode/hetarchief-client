import { HTTPError } from 'ky';
import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ErrorNoAccess, Loading } from '@shared/components';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { setShowZendesk } from '@shared/store/ui';
import { AccessStatus } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import { WaitingPage } from '@visitor-space/components/WaitingPage';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

import { useGetVisitAccessStatus } from '../../visit-requests/hooks/get-visit-access-status';

import { VisitorLayout } from 'modules/visitor-layout';

type VisitRequestedPageProps = {
	name: string | null;
	description: string | null;
	url: string;
} & DefaultSeoInfo;

export const VisitRequestedPage: FC<VisitRequestedPageProps> = ({ name, description, url }) => {
	const router = useRouter();
	const locale = useLocale();
	const { tHtml, tText } = useTranslation();
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

	const { data: space, isLoading: isLoadingSpace } = useGetVisitorSpace(slug as string, false, {
		enabled: enabled && hasPendingRequest,
	});

	/**
	 * Computed
	 */

	const spaceLink = ROUTES_BY_LOCALE[locale].space.replace(':slug', slug as string);

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
		return <WaitingPage space={space} />;
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				name,
				description ||
					tText(
						'pages/slug/toegang-aangevraagd/index___beschrijving-van-een-bezoekersruimte'
					),
				url
			)}

			{renderPageContent()}
		</VisitorLayout>
	);
};
