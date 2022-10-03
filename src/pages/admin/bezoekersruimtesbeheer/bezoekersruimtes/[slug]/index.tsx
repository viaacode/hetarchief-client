import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { VisitorSpaceSettings } from '@cp/components';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

const { publicRuntimeConfig } = getConfig();

const VisitorSpaceEdit: FC = () => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const { slug } = router.query;

	const { data: visitorSpaceInfo, isLoading, refetch } = useGetVisitorSpace(slug as string);

	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen'
				),
				tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen-meta-omschrijving'
				),
				publicRuntimeConfig.CLIENT_URL
			)}

			<AdminLayout
				pageTitle={tHtml(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen'
				)}
			>
				<AdminLayout.Content>
					<div className="l-container">
						{isLoading && <Loading />}
						{visitorSpaceInfo && (
							<VisitorSpaceSettings room={visitorSpaceInfo} refetch={refetch} />
						)}
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		</>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(withAllRequiredPermissions(VisitorSpaceEdit, Permission.UPDATE_ALL_SPACES));
