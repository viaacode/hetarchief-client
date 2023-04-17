import { HTTPError } from 'ky';
import { GetServerSidePropsResult, NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { ErrorNoAccess, Loading } from '@shared/components';
import { ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { setShowZendesk } from '@shared/store/ui';
import { AccessStatus } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceService } from '@visitor-space/services';
import { VisitorSpaceInfo } from '@visitor-space/types';
import { useGetVisitAccessStatus } from '@visits/hooks/get-visit-access-status';

import { WaitingPage } from '../../../../modules/visitor-space/components';

import { VisitorLayout } from 'modules/visitors';

type VisitRequestedPageProps = {
	name: string | null;
	description: string | null;
	url: string;
} & DefaultSeoInfo;

const VisitRequestedPage: NextPage<VisitRequestedPageProps> = ({ name, description, url }) => {
	const router = useRouter();
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

	const spaceLink = ROUTES.space.replace(':slug', slug as string);

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

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<VisitRequestedPageProps>> {
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

export default withAuth(VisitRequestedPage as ComponentType, true);
