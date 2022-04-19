import { Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useQueryParams } from 'use-query-params';

import { CreateCollectionButton } from '@account/components';
import { EditCollectionTitle } from '@account/components/EditCollectionTitle';
import { ACCOUNT_COLLECTIONS_QUERY_PARAM_CONFIG, CollectionItemListSize } from '@account/const';
import { useGetCollectionMedia } from '@account/hooks/get-collection-media';
import { useGetCollections } from '@account/hooks/get-collections';
import { AccountLayout } from '@account/layouts';
import { collectionsService } from '@account/services/collections';
import { Collection, CollectionMedia } from '@account/types';
import { createCollectionSlug } from '@account/utils';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { AddToCollectionBlade } from '@reading-room/components';
import {
	Icon,
	IdentifiableMediaCard,
	ListNavigationItem,
	MediaCardList,
	PaginationBar,
	SearchBar,
} from '@shared/components';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';
import { Breakpoints } from '@shared/types';
import { asDate, createPageTitle, formatDate } from '@shared/utils';

import { VisitorLayout } from 'modules/visitors';

type ListNavigationCollectionItem = ListNavigationItem & Collection;

const AccountMyCollections: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { collectionSlug } = router.query;

	/**
	 * Data
	 */
	const [filters, setFilters] = useQueryParams(ACCOUNT_COLLECTIONS_QUERY_PARAM_CONFIG);
	const [blockFallbackRedirect, setBlockFallbackRedirect] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [isAddToCollectionBladeOpen, setShowAddToCollectionBlade] = useState(false);
	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);

	const collections = useGetCollections();

	const sidebarLinks: ListNavigationCollectionItem[] = useMemo(
		() =>
			(collections.data?.items || []).map((collection) => {
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
		[collections.data, collectionSlug]
	);

	const activeCollection = useMemo(
		() => sidebarLinks.find((link) => link.active),
		[sidebarLinks]
	);

	const collectionMedia = useGetCollectionMedia(
		activeCollection?.id,
		filters.search,
		filters.page,
		CollectionItemListSize
	);

	const keywords = useMemo(() => (filters.search ? [filters.search] : []), [filters.search]);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (!activeCollection && collections) {
			const favorites = collections.data?.items.find((col) => col.isDefault);
			!blockFallbackRedirect && favorites && router.push(createCollectionSlug(favorites));
		}
	}, [activeCollection, collections, router, blockFallbackRedirect]);

	useEffect(() => {
		if (activeCollection && collectionMedia.isStale) {
			collectionMedia.refetch();
		}
	}, [activeCollection]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Events
	 */

	const onCollectionTitleChanged = (collection: Collection) => {
		setBlockFallbackRedirect(true);

		collections.refetch().then(() => {
			router.push(createCollectionSlug(collection)).then(() => {
				setBlockFallbackRedirect(false);
			});
		});
	};

	const onMoveCollection = (item: IdentifiableMediaCard) => {
		setSelected(item);
		setShowAddToCollectionBlade(true);
	};

	const onRemoveFromCollection = (item: IdentifiableMediaCard, collection: Collection) => {
		collectionsService.removeFromCollection(collection.id, item.schemaIdentifier).then(() => {
			collectionMedia.refetch();
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
						key={'export-collection'}
						className="p-account-my-collections__export--label"
						variants={['black']}
						name={t(
							'pages/account/mijn-mappen/collection-slug/index___metadata-exporteren'
						)}
						label={t(
							'pages/account/mijn-mappen/collection-slug/index___metadata-exporteren'
						)}
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
						key={'export-collection-mobile'}
						className="p-account-my-collections__export--icon"
						variants={['black']}
						name={t(
							'pages/account/mijn-mappen/collection-slug/index___metadata-exporteren'
						)}
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
									key={'delete-collection'}
									className="p-account-my-collections__delete"
									variants={['silver']}
									icon={<Icon name="trash" />}
									name={t(
										'pages/account/mijn-mappen/collection-slug/index___map-verwijderen'
									)}
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

	const renderActions = (item: IdentifiableMediaCard, collection: Collection) => (
		<>
			<Button
				variants={['text']}
				label={t('pages/account/mijn-mappen/collection-slug/index___verwijderen')}
				onClick={() => onRemoveFromCollection(item, collection)}
			/>
			<Button
				variants={['text']}
				label={t('pages/account/mijn-mappen/collection-slug/index___verplaatsen')}
				onClick={() => onMoveCollection(item)}
			/>
		</>
	);

	// We need to use Highlighter because we're passing a Link, MediaCard needs a string to auto-highlight
	const renderTitle = (item: CollectionMedia): ReactNode => (
		<Link href={`/${item.visitorSpaceSlug}/${item.schemaIdentifier}`}>
			<a className="u-text-no-decoration" title={item.schemaIdentifier}>
				<b>
					<Highlighter
						searchWords={keywords}
						autoEscape={true}
						textToHighlight={item.name}
					/>
				</b>
			</a>
		</Link>
	);

	const renderDescription = (item: CollectionMedia): ReactNode => {
		const items: { label: string; value: ReactNode }[] = [
			{
				label: t('pages/account/mijn-mappen/collection-slug/index___aanbieder'),
				value: item.maintainerName,
			},
			{
				label: t('pages/account/mijn-mappen/collection-slug/index___programma'),
				value: item.series.join(', '),
			},
			{
				label: t('pages/account/mijn-mappen/collection-slug/index___serie'),
				value: item.programs.join(', '),
			},
			{
				label: t('pages/account/mijn-mappen/collection-slug/index___type'),
				value: item.format,
			},
			{
				label: t('pages/account/mijn-mappen/collection-slug/index___creatiedatum'),
				value: formatDate(asDate(item.dateCreatedLowerBound)),
			},
			{
				label: t('pages/account/mijn-mappen/collection-slug/index___uitzenddatum'),
				value: formatDate(asDate(item.datePublished)),
			},
			{
				label: t('pages/account/mijn-mappen/collection-slug/index___identifier-bij-meemoo'),
				value: item.meemooIdentifier,
			},
			{
				label: t(
					'pages/account/mijn-mappen/collection-slug/index___identifier-bij-aanbieder'
				),
				value: item.schemaIdentifier,
			},
		];

		return (
			<div className="p-account-my-collections__card-description">
				{items.map((item, i) => {
					return item.value ? (
						<p key={i} className="u-pr-24 u-text-break">
							<b>{item.label}: </b>
							{item.value}
						</p>
					) : null;
				})}
			</div>
		);
	};

	return (
		<VisitorLayout>
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
					responsiveTo={Breakpoints.md}
					sidebarTitle={t(
						'pages/account/mijn-mappen/collection-slug/index___mijn-mappen'
					)}
					sidebarLinks={[
						...sidebarLinks,
						{
							id: 'p-account-my-collections__new-collection',
							variants: ['c-list-navigation__item--no-interaction'],
							node: <CreateCollectionButton afterSubmit={collections.refetch} />,
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

							<div className="l-container u-mb-24:md u-mb-32">
								<SearchBar
									isDisabled={collectionMedia.isFetching}
									backspaceRemovesValue={false}
									className="p-account-my-collections__search"
									instanceId="collections-search-bar"
									light={true}
									placeholder={t(
										'pages/account/mijn-mappen/collection-slug/index___zoek'
									)}
									searchValue={filters.search}
									onClear={() => {
										setFilters({
											[SEARCH_QUERY_KEY]: '',
											page: 1,
										});
									}}
									onSearch={(searchValue: string) => {
										// TODO: avoid rerender
										// Force rerender to avoid visual disconnect in edge-case
										searchValue === filters.search &&
											setFilters({ [SEARCH_QUERY_KEY]: '' });

										setFilters({
											[SEARCH_QUERY_KEY]: searchValue,
											page: 1,
										});
									}}
								/>
							</div>

							<div className="l-container">
								<MediaCardList
									keywords={keywords}
									items={collectionMedia?.data?.items.map((media) => {
										const base: IdentifiableMediaCard = {
											schemaIdentifier: media.schemaIdentifier,
											description: renderDescription(media),
											title: renderTitle(media),
											type: media.format,
											preview: media.thumbnailUrl,
										};

										return {
											...base,
											actions: renderActions(base, activeCollection),
										};
									})}
									view={'list'}
								/>

								{collectionMedia.data &&
									collectionMedia.data?.total > CollectionItemListSize && (
										<PaginationBar
											className="u-mb-48"
											start={(filters.page - 1) * CollectionItemListSize}
											count={CollectionItemListSize}
											showBackToTop
											total={collectionMedia.data?.total || 0}
											onPageChange={(page) =>
												setFilters({
													...filters,
													page: page + 1,
												})
											}
										/>
									)}
							</div>
						</>
					)}
				</SidebarLayout>
			</AccountLayout>

			<ConfirmationModal
				text={{
					yes: t('pages/account/mijn-mappen/collection-slug/index___verwijderen'),
					no: t('pages/account/mijn-mappen/collection-slug/index___annuleren'),
				}}
				isOpen={activeCollection && showConfirmDelete}
				onClose={() => setShowConfirmDelete(false)}
				onCancel={() => setShowConfirmDelete(false)}
				onConfirm={() => {
					setShowConfirmDelete(false);

					activeCollection &&
						collectionsService.delete(activeCollection.id).then(() => {
							collections.refetch();
						});
				}}
			/>

			<AddToCollectionBlade
				isOpen={isAddToCollectionBladeOpen}
				selected={selected || undefined}
				onClose={() => {
					setShowAddToCollectionBlade(false);
					setSelected(null);
				}}
				onSubmit={() => {
					setShowAddToCollectionBlade(false);
					setSelected(null);
				}}
			/>
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(AccountMyCollections);
