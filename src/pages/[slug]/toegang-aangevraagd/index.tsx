import { HTTPError } from 'ky';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { ErrorNoAccess, Loading } from '@shared/components';
import { ROUTES } from '@shared/const';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { AccessStatus } from '@shared/types';
import { useGetVisitAccessStatus } from '@visits/hooks/get-visit-access-status';

import { WaitingPage } from '../../../modules/visitor-space/components';
import { useGetVisitorSpace } from '../../../modules/visitor-space/hooks/get-visitor-space';

import { VisitorLayout } from 'modules/visitors';

const VisitRequestedPage: NextPage = () => {
	useNavigationBorder();

	const router = useRouter();
	const { t } = useTranslation();

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
			return <Loading fullscreen />;
		}
		if (isNoAccessError) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={slug as string}
					description={t(
						'pages/slug/toegang-aangevraagd/index___deze-pagina-is-niet-toegankelijk-doe-een-bezoekersaavraag-op-de-startpagina'
					)}
				/>
			);
		}
		return <WaitingPage space={space} />;
	};

	return <VisitorLayout>{renderPageContent()}</VisitorLayout>;
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(VisitRequestedPage);
