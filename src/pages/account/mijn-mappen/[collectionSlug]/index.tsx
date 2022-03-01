import { Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

import { CreateCollectionButton } from '@account/components';
import { EditCollectionTitle } from '@account/components/EditCollectionTitle';
import { useGetCollections } from '@account/hooks/get-collections';
import { AccountLayout } from '@account/layouts';
import { collectionsService } from '@account/services/collections';
import { Collection } from '@account/types';
import { createCollectionSlug } from '@account/utils';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import {
	Icon,
	ListNavigationItem,
	MediaCardViewMode,
	Toggle,
	ToggleOption,
} from '@shared/components';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';
import { ROUTES, VIEW_TOGGLE_OPTIONS } from '@shared/const';
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
	const [blockFallbackRedirect, setBlockFallbackRedirect] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [viewMode, setViewMode] = useState<MediaCardViewMode>('grid');

	const { data: collections, refetch } = useGetCollections();
	const sidebarLinks: ListNavigationCollectionItem[] = useMemo(
		() =>
			(collections?.items || []).map((collection) => {
				const slug = createCollectionSlug(collection);
				const href = `${ROUTES.myCollections}/${slug}`;

				return {
					...collection,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a className={linkClassName} title={collection.name}>
								{collection.name}
							</a>
						</Link>
					),
					active: decodeURIComponent(slug) === collectionSlug,
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

	const toggleOptions: ToggleOption[] = useMemo(
		() =>
			VIEW_TOGGLE_OPTIONS.map((option) => ({
				...option,
				active: option.id === viewMode,
			})),
		[viewMode]
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (!activeCollection && collections) {
			const favorites = collections?.items.find((col) => col.isDefault);
			!blockFallbackRedirect && favorites && router.push(createCollectionSlug(favorites));
		}
	}, [activeCollection, collections, router, blockFallbackRedirect]);

	/**
	 * Events
	 */

	const onCollectionTitleChanged = (collection: Collection) => {
		setBlockFallbackRedirect(true);

		refetch().then(() => {
			router.push(createCollectionSlug(collection)).then(() => {
				setBlockFallbackRedirect(false);
			});
		});
	};

	/**
	 * Render
	 */

	const renderTitleButtons = useMemo(
		() => [
			{
				before: true,
				node: (
					<Button
						className="p-account-my-collections__export--label"
						variants={['black']}
						name={t('Metadata exporteren')}
						label={t('Metadata exporteren')}
						iconStart={<Icon name="export" />}
						onClick={(e) => {
							e.stopPropagation();
						}}
					/>
				),
			},
			{
				before: true,
				node: (
					<Button
						className="p-account-my-collections__export--icon"
						variants={['black']}
						name={t('Metadata exporteren')}
						icon={<Icon name="export" />}
						onClick={(e) => {
							e.stopPropagation();
						}}
					/>
				),
			},
			...(activeCollection && !activeCollection.isDefault
				? [
						{
							before: false,
							node: (
								<Button
									className="p-account-my-collections__delete"
									variants={['silver']}
									icon={<Icon name="trash" />}
									name={t('Map verwijderen')}
									onClick={(e) => {
										e.stopPropagation();
										setShowConfirmDelete(true);
									}}
								/>
							),
						},
				  ]
				: []),
		],
		[t, activeCollection]
	);

	return (
		<>
			<Head>
				<title>
					{createPageTitle(
						t('pages/account/mijn-mappen/index___mijn-mappen') +
							` | ${activeCollection?.name || collectionSlug}`
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
					{activeCollection && (
						<>
							<div className="l-container u-mt-64 u-mb-48">
								<SidebarLayoutTitle>
									<EditCollectionTitle
										key={activeCollection.id}
										collection={activeCollection}
										afterSubmit={onCollectionTitleChanged}
										buttons={renderTitleButtons}
									/>
								</SidebarLayoutTitle>
							</div>

							<div className="l-container">
								<Toggle
									bordered
									className="p-account-my-collections__toggle u-bg-white"
									options={toggleOptions}
									onChange={(id) => setViewMode(id as MediaCardViewMode)}
								/>
							</div>
						</>
					)}
				</SidebarLayout>
			</AccountLayout>

			<ConfirmationModal
				isOpen={activeCollection && showConfirmDelete}
				onClose={() => setShowConfirmDelete(false)}
				onCancel={() => setShowConfirmDelete(false)}
				onConfirm={() => {
					setShowConfirmDelete(false);

					activeCollection &&
						collectionsService.delete(activeCollection.id).then(() => {
							refetch();
						});
				}}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(AccountMyCollections);
