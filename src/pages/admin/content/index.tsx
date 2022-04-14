import { ContentPageOverview } from '@meemoo/react-admin';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectUser } from '@auth/store/user';
import { withI18n } from '@i18n/wrappers';
import { setShowFooter, setShowZendesk } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

import { MeemooAdminLayout } from 'modules/admin/layouts';
// import { withAdminCoreConfig } from 'modules/admin/wrappers/with-admin-core-config';

const ContentPagesOverviewPage: NextPage = () => {
	const dispatch = useDispatch();
	// const { t } = useTranslation();

	// const user = useSelector(selectUser);

	useEffect(() => {
		dispatch(setShowZendesk(false));
		dispatch(setShowFooter(false));
	}, [dispatch]);

	return (
		<>
			<Head>
				<title>{createPageTitle("Content pagina's")}</title>
				<meta name="description" content={"admin content pagina's beschrijving"} />
			</Head>

			<MeemooAdminLayout className="p-cp-visitors" contentTitle={"Content pagina's"}>
				<ContentPageOverview user={{}} />
			</MeemooAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default ContentPagesOverviewPage;
