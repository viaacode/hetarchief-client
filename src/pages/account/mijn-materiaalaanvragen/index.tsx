import { GetServerSidePropsResult, NextPage } from 'next';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType } from 'react';

import { Permission } from '@account/const';
import { AccountLayout } from '@account/layouts';
import { withAuth } from '@auth/wrappers/with-auth';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { DefaultSeoInfo } from '@shared/types/seo';

import { VisitorLayout } from 'modules/visitors';

const AccountMyMaterialRequests: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tText } = useTranslation();

	const renderPageContent = () => {
		return (
			<AccountLayout
				className="p-account-my-material-requests"
				pageTitle={tText('pages/account/mijn-profiel/index___mijn-materiaalaanvragen')}
			>
				<div className="l-container" />
			</AccountLayout>
		);
	};

	return (
		<VisitorLayout>
			{renderOgTags(
				tText('pages/account/mijn-profiel/index___mijn-materiaalaanvragen'),
				tText(
					'pages/account/mijn-profiel/index___mijn-materiaalaanvragen-meta-omschrijving'
				),
				url
			)}

			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<DefaultSeoInfo>> {
	return getDefaultServerSideProps(context);
}

export default withAuth(AccountMyMaterialRequests as ComponentType);
