import { NextPage } from 'next';
import getConfig from 'next/config';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestTableColumns } from '@cp/const/requests.const';
import { CPAdminLayout } from '@cp/layouts';
import { withI18n } from '@i18n/wrappers';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import VisitRequestsOverview from '@visits/components/VisitRequestsOverview/VisitRequestsOverview';

const { publicRuntimeConfig } = getConfig();

const CPRequestsPage: NextPage = () => {
	const { tHtml, tText } = useTranslation();

	return (
		<>
			{renderOgTags(
				tText('pages/beheer/aanvragen/index___aanvragen'),
				tText('pages/beheer/aanvragen/index___aanvragen-meta-omschrijving'),
				publicRuntimeConfig.CLIENT_URL
			)}

			<CPAdminLayout
				className="p-cp-requests"
				pageTitle={tHtml('pages/beheer/aanvragen/index___aanvragen')}
			>
				<VisitRequestsOverview columns={RequestTableColumns()} />
			</CPAdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAllRequiredPermissions(CPRequestsPage, Permission.READ_CP_VISIT_REQUESTS)
);
