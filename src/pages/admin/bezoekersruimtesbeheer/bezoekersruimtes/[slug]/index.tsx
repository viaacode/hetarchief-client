import { GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { ComponentType, FC } from 'react';

import { Permission } from '@account/const';
import { AdminLayout } from '@admin/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import { VisitorSpaceSettings } from '@cp/components';
import { Loading } from '@shared/components';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

const VisitorSpaceEdit: FC<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const { slug } = router.query;

	const { data: visitorSpaceInfo, isLoading, refetch } = useGetVisitorSpace(slug as string);

	const renderPageContent = () => {
		return (
			<AdminLayout
				pageTitle={tHtml(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen'
				)}
			>
				<AdminLayout.Content>
					<div className="l-container">
						{isLoading && <Loading owner="admin visitor spaces slug page" />}
						{visitorSpaceInfo && (
							<VisitorSpaceSettings room={visitorSpaceInfo} refetch={refetch} />
						)}
					</div>
				</AdminLayout.Content>
			</AdminLayout>
		);
	};

	return (
		<>
			{renderOgTags(
				tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen'
				),
				tText(
					'pages/admin/bezoekersruimtesbeheer/bezoekersruimtes/slug/index___instellingen-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.UPDATE_ALL_SPACES]}>
				{renderPageContent()}
			</PermissionsCheck>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(VisitorSpaceEdit as ComponentType);
