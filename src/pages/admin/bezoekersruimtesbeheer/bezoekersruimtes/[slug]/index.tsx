import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { VisitorSpaceSettings } from '@cp/components';
import { withI18n } from '@i18n/wrappers';
import { Loading } from '@shared/components';
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { createPageTitle } from '@shared/utils';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

const VisitorSpaceEdit: FC = () => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const { slug } = router.query;

	const { data: visitorSpaceInfo, isLoading, refetch } = useGetVisitorSpace(slug as string);

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						tText(
							'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen'
						)
					)}
				</title>
				<meta
					name="description"
					content={tText(
						'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen-meta-omschrijving'
					)}
				/>
			</Head>

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
