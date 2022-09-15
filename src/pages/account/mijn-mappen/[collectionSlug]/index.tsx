import { Button, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { kebabCase } from 'lodash-es';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useSelector } from 'react-redux';
import save from 'save-file';
import { useQueryParams } from 'use-query-params';

import { CreateCollectionButton } from '@account/components';
import { EditCollectionTitle } from '@account/components/EditCollectionTitle';
import {
	ACCOUNT_COLLECTIONS_QUERY_PARAM_CONFIG,
	CollectionItemListSize,
	Permission,
} from '@account/const';
import { useGetCollectionExport } from '@account/hooks/get-collection-export';
import { useGetCollectionMedia } from '@account/hooks/get-collection-media';
import { useGetCollections } from '@account/hooks/get-collections';
import { AccountLayout } from '@account/layouts';
import { collectionsService } from '@account/services/collections';
import { Folder, FolderMedia } from '@account/types';
import { createCollectionSlug } from '@account/utils';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
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
import { withAllRequiredPermissions } from '@shared/hoc/withAllRequiredPermissions';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/media';
import { Breakpoints } from '@shared/types';
import { asDate, createPageTitle, formatMediumDate } from '@shared/utils';

import { AddToFolderBlade } from '../../../../modules/visitor-space/components';

import { VisitorLayout } from 'modules/visitors';

type ListNavigationCollectionItem = ListNavigationItem & Folder;

const labelKeys = {
	search: 'AccountMyCollections__search',
};

const AccountMyCollections: NextPage = () => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const { collectionSlug } = router.query;
	const canDownloadMetadata: boolean | null = useHasAllPermission(Permission.EXPORT_OBJECT);

	/**
	 * Data
	 */
	const [filters, setFilters] = useQueryParams(ACCOUNT_COLLECTIONS_QUERY_PARAM_CONFIG);
	const [blockFallbackRedirect, setBlockFallbackRedirect] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);
	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);

	const getCollections = useGetCollections();
	const collections = useSelector(selectFolders);

	const sidebarLinks: ListNavigationCollectionItem[] = useMemo(
		() =>
			(collections?.items || []).map((collection) => {
				const slug = createCollectionSlug(collection);
				const href = `${ROUTES.myCollections}/${slug}`;

				return {
					...collection,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a
								className={clsx(linkClassName, 'p-account-my-collections__link')}
								aria-label={collection.name}
							>
								{collection.name}
								<Icon
									className="u-font-size-24 u-text-left"
									name="angle-right"
									aria-hidden
								/>
							</a>
						</Link>
					),
					active: decodeURIComponent(slug) === collectionSlug,
				};
			}),
		[collections, collectionSlug]
	);

	const activeCollection = useMemo(
		() => sidebarLinks.find((link) => link.active),
		[sidebarLinks]
	);

	const folderMedia = useGetCollectionMedia(
		activeCollection?.id,
		filters.search,
		filters.page,
		CollectionItemListSize
	);

	// export
	const { mutateAsync: getCollectionExport } = useGetCollectionExport();

	const keywords = useMemo(() => (filters.search ? [filters.search] : []), [filters.search]);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (!activeCollection && collections) {
			const favorites = collections?.items.find((col) => col.isDefault);
			!blockFallbackRedirect && favorites && router.push(createCollectionSlug(favorites));
		}
	}, [activeCollection, collections, router, blockFallbackRedirect]);

	useEffect(() => {
		if (activeCollection && folderMedia.isStale) {
			folderMedia.refetch();
		}
	}, [activeCollection]); // eslint-disable-line react-hooks/exhaustive-deps

	/**
	 * Events
	 */

	const onCollectionTitleChanged = (collection: Folder) => {
		setBlockFallbackRedirect(true);

		getCollections.refetch().then(() => {
			router.push(createCollectionSlug(collection)).then(() => {
				setBlockFallbackRedirect(false);
			});
		});
	};

	const onMoveCollection = (item: IdentifiableMediaCard) => {
		setSelected(item);
		setShowAddToFolderBlade(true);
	};

	const onRemoveFromCollection = (item: IdentifiableMediaCard, folder: Folder) => {
		collectionsService
			.removeFromCollection(folder.id, item.schemaIdentifier)
			.then((response) => {
				if (response === undefined) {
					return;
				}

				folderMedia.refetch();

				const descriptionVariables = {
					item: item.name,
					folder:
						folder?.name ||
						tText('pages/account/mijn-mappen/folder-slug/index___onbekend'),
				};

				toastService.notify({
					maxLines: 3,
					title: tHtml(
						'pages/account/mijn-mappen/folder-slug/index___item-verwijderd-uit-map-titel'
					),
					description: tHtml(
						'pages/account/mijn-mappen/folder-slug/index___item-is-verwijderd-uit-map-beschrijving',
						descriptionVariables
					),
				});
			});
	};

	/**
	 * Render
	 */

	const renderTitleButtons = useMemo(() => {
		const onExportClick = async () => {
			if (activeCollection?.id) {
				const xmlBlob = await getCollectionExport(activeCollection?.id);

				if (xmlBlob) {
					save(xmlBlob, `${kebabCase(activeCollection?.name) || 'map'}.xml`);
				} else {
					toastService.notify({
						title:
							tHtml('pages/account/mijn-mappen/folder-slug/index___error') || 'error',
						description: tHtml(
							'pages/account/mijn-mappen/folder-slug/index___het-ophalen-van-de-metadata-is-mislukt'
						),
					});
				}
			}
		};

		return [
			...(canDownloadMetadata
				? [
						{
							before: true,
							node: (
								<Button
									key={'export-collection'}
									className="p-account-my-collections__export--label"
									variants={['black']}
									name={tText(
										'pages/account/mijn-mappen/folder-slug/index___metadata-exporteren'
									)}
									label={tText(
										'pages/account/mijn-mappen/folder-slug/index___metadata-exporteren'
									)}
									aria-label={tText(
										'pages/account/mijn-mappen/folder-slug/index___metadata-exporteren'
									)}
									iconStart={<Icon name="export" aria-hidden />}
									onClick={(e) => {
										e.stopPropagation();
										onExportClick();
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
									name={tText(
										'pages/account/mijn-mappen/folder-slug/index___metadata-exporteren'
									)}
									icon={<Icon name="export" aria-hidden />}
									aria-label={tText(
										'pages/account/mijn-mappen/folder-slug/index___metadata-exporteren'
									)}
									onClick={(e) => {
										e.stopPropagation();
										onExportClick();
									}}
								/>
							),
						},
				  ]
				: []),
			...(activeCollection && !activeCollection.isDefault
				? [
						{
							before: false,
							node: (
								<Button
									key={'delete-collection'}
									className="p-account-my-collections__delete"
									variants={['silver']}
									icon={<Icon name="trash" aria-hidden />}
									aria-label={tText(
										'pages/account/mijn-mappen/folder-slug/index___map-verwijderen'
									)}
									name={tText(
										'pages/account/mijn-mappen/folder-slug/index___map-verwijderen'
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
		];
	}, [tHtml, activeCollection, getCollectionExport, canDownloadMetadata]);

	const renderActions = (item: IdentifiableMediaCard, collection: Folder) => (
		<>
			<Button
				variants={['text']}
				label={tHtml('pages/account/mijn-mappen/folder-slug/index___verwijderen')}
				onClick={() => onRemoveFromCollection(item, collection)}
			/>
			<Button
				variants={['text']}
				label={tHtml('pages/account/mijn-mappen/folder-slug/index___verplaatsen')}
				onClick={() => onMoveCollection(item)}
			/>
		</>
	);

	// We need to use Highlighter because we're passing a Link, MediaCard needs a string to auto-highlight
	const renderTitle = (item: FolderMedia): ReactNode => (
		<Link href={`/${item.visitorSpaceSlug}/${item.schemaIdentifier}`}>
			<a className="u-text-no-decoration" aria-label={item.schemaIdentifier}>
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

	const renderDescription = (item: FolderMedia): ReactNode => {
		const items: { label: string | ReactNode; value: ReactNode }[] = [
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___aanbieder'),
				value: item.maintainerName,
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___programma'),
				value: item.programs.join(', '),
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___serie'),
				value: item.series.join(', '),
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___type'),
				value: item.format,
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___creatiedatum'),
				value: formatMediumDate(asDate(item.dateCreatedLowerBound)),
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___uitzenddatum'),
				value: formatMediumDate(asDate(item.datePublished)),
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___identifier-bij-meemoo'),
				value: item.meemooIdentifier,
			},
			{
				label: tHtml(
					'pages/account/mijn-mappen/folder-slug/index___identifier-bij-aanbieder'
				),
				value: item.meemooLocalId,
			},
		];

		return (
			<div className="p-account-my-collections__card-description">
				{items.map((item, i) => {
					return item.value ? (
						<p key={i} className="u-pr-24 u-text-break">
							<b>{item.label}: </b>
							<Highlighter
								searchWords={keywords}
								autoEscape={true}
								textToHighlight={item.value as string}
							/>
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
						tText('pages/account/mijn-mappen/index___mijn-mappen') +
							` | ${activeCollection?.name || collectionSlug}`
					)}
				</title>

				<meta
					name="description"
					content={tText(
						'pages/account/mijn-mappen/index___mijn-mappen-meta-omschrijving'
					)}
				/>
			</Head>

			<AccountLayout className="p-account-my-collections">
				<SidebarLayout
					color="platinum"
					responsiveTo={Breakpoints.md}
					sidebarTitle={tHtml(
						'pages/account/mijn-mappen/folder-slug/index___mijn-mappen'
					)}
					sidebarLinks={[
						...sidebarLinks,
						{
							id: 'p-account-my-collections__new-collection',
							variants: ['c-list-navigation__item--no-interaction'],
							node: <CreateCollectionButton afterSubmit={getCollections.refetch} />,
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
								<FormControl
									className="c-form-control--label-hidden"
									id={`${labelKeys.search}--${activeCollection.id}`}
									label={tHtml(
										'pages/account/mijn-mappen/folder-slug/index___zoeken-in-deze-map'
									)}
								>
									<SearchBar
										id={`${labelKeys.search}--${activeCollection.id}`}
										default={filters[SEARCH_QUERY_KEY]}
										className="p-account-my-collections__search"
										placeholder={tText(
											'pages/account/mijn-mappen/folder-slug/index___zoek'
										)}
										onSearch={(value) =>
											setFilters({ [SEARCH_QUERY_KEY]: value })
										}
									/>
								</FormControl>
							</div>

							<div className="l-container">
								{!folderMedia?.isError && (
									<MediaCardList
										keywords={keywords}
										items={folderMedia?.data?.items.map((media) => {
											const base: IdentifiableMediaCard = {
												schemaIdentifier: media.schemaIdentifier,
												description: renderDescription(media),
												title: renderTitle(media),
												name: media.name,
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
								)}

								{folderMedia.data &&
									folderMedia.data?.total > CollectionItemListSize && (
										<PaginationBar
											className="u-mb-48"
											start={(filters.page - 1) * CollectionItemListSize}
											count={CollectionItemListSize}
											showBackToTop
											total={folderMedia.data?.total || 0}
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
					yes: tHtml('pages/account/mijn-mappen/folder-slug/index___verwijderen'),
					no: tHtml('pages/account/mijn-mappen/folder-slug/index___annuleren'),
				}}
				isOpen={activeCollection && showConfirmDelete}
				onClose={() => setShowConfirmDelete(false)}
				onCancel={() => setShowConfirmDelete(false)}
				onConfirm={() => {
					setShowConfirmDelete(false);

					activeCollection &&
						collectionsService.delete(activeCollection.id).then(() => {
							getCollections.refetch();
						});
				}}
			/>

			<AddToFolderBlade
				isOpen={isAddToFolderBladeOpen}
				selected={
					selected
						? {
								schemaIdentifier: selected.schemaIdentifier,
								title: selected.name,
						  }
						: undefined
				}
				onClose={() => {
					setShowAddToFolderBlade(false);
					setSelected(null);
				}}
				onSubmit={async () => {
					setShowAddToFolderBlade(false);
					setSelected(null);
				}}
			/>
		</VisitorLayout>
	);
};

export const getServerSideProps = withI18n();

export default withAuth(
	withAllRequiredPermissions(AccountMyCollections, Permission.MANAGE_ACCOUNT)
);
