import { NextPage } from 'next';
import Head from 'next/head';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestTableColumns } from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { createPageTitle } from '@shared/utils';
import VisitRequestsOverview from '@visits/components/VisitRequestsOverview/VisitRequestsOverview';

const CPRequestsPage: NextPage = () => {
	const { t, tText } = useTranslation();

	return (
		<>
			<Head>
				<title>{createPageTitle(tText('pages/beheer/aanvragen/index___aanvragen'))}</title>
				<meta
					name="description"
					content={tText('pages/beheer/aanvragen/index___aanvragen-meta-omschrijving')}
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

export default withAuth(
	withAllRequiredPermissions(CPRequestsPage, Permission.READ_CP_VISIT_REQUESTS)
);
