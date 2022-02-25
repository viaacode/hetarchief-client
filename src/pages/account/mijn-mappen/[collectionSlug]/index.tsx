import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { CreateCollectionButton } from '@account/components';
import { useGetCollections } from '@account/hooks/get-collections';
import { AccountLayout } from '@account/layouts';
import { Collection } from '@account/types';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { ListNavigationItem } from '@shared/components';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';
import { ROUTES } from '@shared/const';
import { capitalise } from '@shared/helpers';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';
import { createPageTitle } from '@shared/utils';

type ListNavigationCollectionItem = ListNavigationItem & Collection;

const AccountMyCollections: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { collectionSlug } = router.query;

	/**
	 * Data
	 */

	const { data: collections, isFetching, refetch } = useGetCollections();
	const sidebarLinks: ListNavigationCollectionItem[] = useMemo(
		() =>
			(collections?.items || []).map((collection) => {
				const href = `${ROUTES.myCollections}/${collection.name.toLowerCase()}`;

				return {
					...collection,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a className={linkClassName} title={collection.name}>
								{collection.name}
							</a>
						</Link>
					),
					active: collection.name.toLowerCase() === collectionSlug,
				};
			}),
		[collections, collectionSlug]
	);

	/**
	 * Computed
	 */

	const activeCollection = useMemo(
		() => sidebarLinks.find((link) => link.active),
		[sidebarLinks]
	);

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/account/mijn-mappen/index___mijn-mappen') +
							` | ${capitalise(collectionSlug)}`
					)}
				</title>

				<meta
					name="description"
					content={t('pages/account/mijn-mappen/index___mijn-mappen-meta-omschrijving')}
				/>
			</Head>

			<AccountLayout className="p-account-my-collections">
				<SidebarLayout
					color="platinum"
					sidebarTitle={t(
						'pages/account/mijn-mappen/collection-slug/index___mijn-mappen'
					)}
					sidebarLinks={[
						...sidebarLinks,
						{
							id: 'p-account-my-collections__new-collection',
							variants: ['c-list-navigation__item--no-interaction'],
							node: <CreateCollectionButton afterSubmit={refetch} />,
							hasDivider: true,
						},
					]}
				>
					<div className="l-container u-mt-64 u-mb-48">
						<SidebarLayoutTitle>
							{isFetching ? capitalise(collectionSlug) : activeCollection?.name}
						</SidebarLayoutTitle>
					</div>
				</SidebarLayout>
			</AccountLayout>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(AccountMyCollections);
