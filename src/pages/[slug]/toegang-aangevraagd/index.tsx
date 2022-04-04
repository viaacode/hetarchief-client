import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { ReadingRoomNavigation } from '@reading-room/components';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

import { VisitorLayout } from 'modules/visitors';

const ReadingRoomVisitRequestedPage: NextPage = () => {
	useNavigationBorder();

	const { t } = useTranslation();
	const router = useRouter();

	const { slug } = router.query;

	/**
	 * State
	 */

	const showNavigationBorder = useSelector(selectShowNavigationBorder);

	/**
	 * Data
	 */

	const { data: readingRoom } = useGetReadingRoom(slug as string, typeof slug === 'string');

	return (
		<VisitorLayout>
			<div className="p-reading-room__visit-requested">
				<Head>
					<title>{createPageTitle(readingRoom?.name)}</title>
					<meta
						name="description"
						content={readingRoom?.description || t('Beschrijving van een leeszaal')}
					/>
				</Head>

				<ReadingRoomNavigation
					title={readingRoom?.name}
					phone={readingRoom?.contactInfo.telephone || ''}
					email={readingRoom?.contactInfo.email || ''}
					showBorder={showNavigationBorder}
				/>
			</div>
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(ReadingRoomVisitRequestedPage);
