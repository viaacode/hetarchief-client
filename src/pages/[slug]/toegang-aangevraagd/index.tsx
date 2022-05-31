import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';
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

	const { slug } = router.query;

	/**
	 * Data
	 */

	const enabled = typeof slug === 'string';
	const { data: accessStatus, isLoading: isLoadingAccessStatus } = useGetVisitAccessStatus(
		slug as string,
		typeof slug === 'string'
	);

	const hasPendingRequest = accessStatus?.status === AccessStatus.PENDING;

	const { data: space, isLoading: isLoadingSpace } = useGetVisitorSpace(slug as string, false, {
		enabled: enabled && hasPendingRequest,
	});

	/**
	 * Computed
	 */

	const backLink = ROUTES.home;
	const spaceLink = ROUTES.space.replace(':slug', slug as string);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (!hasPendingRequest) {
			switch (accessStatus?.status) {
				case AccessStatus.NO_ACCESS:
					router.push(backLink);
					break;
				case AccessStatus.ACCESS:
					router.push(spaceLink);
					break;
			}
		}
	}, [router, backLink, accessStatus?.status, spaceLink, hasPendingRequest]);

	/**
	 * Render
	 */

	const renderPageContent = () => {
		if (isLoadingAccessStatus || isLoadingSpace || !hasPendingRequest) {
			return <Loading fullscreen />;
		}
		return <WaitingPage space={space} />;
	};

	return <VisitorLayout>{renderPageContent()}</VisitorLayout>;
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(VisitRequestedPage);
