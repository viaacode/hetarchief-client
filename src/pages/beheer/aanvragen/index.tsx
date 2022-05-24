import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestTableColumns } from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { createPageTitle } from '@shared/utils';
import VisitRequestsOverview from '@visits/components/VisitRequestsOverview/VisitRequestsOverview';

const CPRequestsPage: NextPage = () => {
	const { t } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(t('pages/beheer/aanvragen/index___aanvragen'))}</title>
				<meta
					name="description"
					content={t('pages/beheer/aanvragen/index___aanvragen-meta-omschrijving')}
				/>
			</Head>

			<CPAdminLayout
				className="p-cp-requests"
				pageTitle={t('pages/beheer/aanvragen/index___aanvragen')}
			>
				<VisitRequestsOverview columns={RequestTableColumns()} />
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(
	withAllRequiredPermissions(CPRequestsPage, Permission.READ_CP_VISIT_REQUESTS)
);
