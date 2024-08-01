import { Button, FormControl } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEmpty, isNil, kebabCase } from 'lodash-es';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import React, { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { CreateFolderButton } from '@account/components';
import { EditFolderBlade } from '@account/components/EditFolderBlade';
import { ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG, FolderItemListSize, Permission } from '@account/const';
import { useGetFolderMedia } from '@account/hooks/get-folder-media';
import { useGetFolders } from '@account/hooks/get-folders';
import { AccountLayout } from '@account/layouts';
import { foldersService } from '@account/services/folders';
import { type Folder, type FolderIeObject } from '@account/types';
import { createFolderSlug } from '@account/utils';
import { IeObjectAccessThrough, IeObjectLicense } from '@ie-objects/ie-objects.types';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { type ListNavigationItem } from '@shared/components/ListNavigation';
import { type IdentifiableMediaCard, TYPE_TO_ICON_MAP } from '@shared/components/MediaCard';
import { MediaCardList } from '@shared/components/MediaCardList';
import { PaginationBar } from '@shared/components/PaginationBar';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ShareFolderBlade } from '@shared/components/ShareFolderBlade';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';
import { ROUTE_PARTS_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import {
	HIGHLIGHTED_SEARCH_TERMS_SEPARATOR,
	QUERY_PARAM_KEY,
} from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';
import { toastService } from '@shared/services/toast-service';
import { selectFolders, setFolders } from '@shared/store/ie-objects';
import { selectLastScrollPosition, setBreadcrumbs, setLastScrollPosition } from '@shared/store/ui';
import { Breakpoints } from '@shared/types';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { asDate, formatMediumDate } from '@shared/utils/dates';
import { VisitorLayout } from '@visitor-layout/index';
import { AddToFolderBlade } from '@visitor-space/components/AddToFolderBlade';

import styles from './MyFolders.module.scss';

type ListNavigationFolderItem = ListNavigationItem & Folder;

const labelKeys = {
	search: 'AccountMyFolders__search',
};

interface AccountMyFolders {
	folderSlug: string | undefined;
}

export const AccountMyFolders: FC<DefaultSeoInfo & AccountMyFolders> = ({ url, folderSlug }) => {
	const router = useRouter();
	const locale = useLocale();
	const dispatch = useDispatch();
	const isSlugDefaultFolder =
		!folderSlug ||
		Object.values(ROUTE_PARTS_BY_LOCALE)
			.map((routeParts) => routeParts.favorites)
			.includes(folderSlug as string);
	const myFoldersPath = ROUTES_BY_LOCALE[locale].accountMyFolders;

	/**
	 * Data
	 */
	const [filters, setFilters] = useQueryParams(ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [showShareMapBlade, setShowShareMapBlade] = useState(false);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);
	const lastScrollPosition = useSelector(selectLastScrollPosition);
	const getFolders = useGetFolders();
	const folders = useSelector(selectFolders);
	const defaultFolder = (folders || []).find((folder) => folder.isDefault);

	const isActive = useCallback(
		(folder: Folder): boolean => {
			return decodeURIComponent(createFolderSlug(folder)) === folderSlug;
		},
		[folderSlug]
	);
	const activeFolder = isSlugDefaultFolder
		? defaultFolder
		: (folders || []).find((folder) => isActive(folder)) || defaultFolder;

	console.log({ folders });
	const sidebarLinks: ListNavigationFolderItem[] = useMemo(
		() =>
			(folders || []).map((folder) => {
				const slug = createFolderSlug(folder);
				const href = myFoldersPath + '/' + slug;
				const active = isActive(folder);

				console.log({ folder });
				return {
					...folder,
					node: ({ linkClassName }) => (
						<Link href={href}>
							<a
								className={clsx(linkClassName, 'p-account-my-folders__link')}
								aria-label={folder.name}
							>
								{folder.name}
								<Icon
									className={clsx(
										'p-account-my-folders__link__hide-icon',
										'u-font-size-24 u-text-left'
									)}
									name={IconNamesLight.AngleRight}
									aria-hidden
								/>
								{folder.usedForLimitedAccessUntil && (
									<Icon
										name={IconNamesLight.OpenDoor}
										className="p-account-my-folders__link__limited-access-icon"
									/>
								)}
							</a>
						</Link>
					),
					active,
				};
			}),
		[folders, myFoldersPath, isActive]
	);

	const folderMedia = useGetFolderMedia(
		activeFolder?.id,
		filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		filters.page,
		FolderItemListSize
	);

	const keywords = useMemo(
		() =>
			filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]
				? [filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] as string]
				: [],
		[filters]
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (!activeFolder) {
			return;
		}

		if (folderMedia.isStale) {
			folderMedia.refetch();
		}

		dispatch(
			setBreadcrumbs([
				{
					label: tText('pages/slug/ie/index___breadcrumbs-mijn-mappen'),
					to: myFoldersPath,
				},
				{
					label: activeFolder.name,
					to: `${myFoldersPath}/${createFolderSlug(activeFolder)}`,
				},
			])
		);
	}, [activeFolder]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Ward: wait until items are rendered on the screen before scrolling
		if (
			lastScrollPosition &&
			lastScrollPosition.page === myFoldersPath &&
			folderMedia?.data?.items
		) {
			setTimeout(() => {
				const item = document.getElementById(
					`${lastScrollPosition.itemId}`
				) as HTMLElement | null;

				item?.scrollIntoView({ block: 'center', behavior: 'smooth' });
				dispatch(setLastScrollPosition(null));
			}, 100);
		}
		// eslint-disable-next-line
	}, [folderMedia?.data?.items, dispatch]);

	/**
	 * Events
	 */

	const onFolderDataEdited = async (newFolder: Folder) => {
		// Temp set folders with new name in redux store
		if (folders) {
			dispatch(
				setFolders(
					folders.map((folder): Folder => {
						if (folder.id === newFolder.id) {
							return newFolder;
						} else {
							return folder;
						}
					})
				)
			);
		}

		// Fetch folders from the network
		await getFolders.refetch();
		await router.push(createFolderSlug(newFolder));
	};

	const onMoveFolder = (item: IdentifiableMediaCard) => {
		setSelected(item);
		setShowAddToFolderBlade(true);
	};

	const onRemoveFromFolder = (item: IdentifiableMediaCard, folder: Folder) => {
		foldersService.removeFromFolder(folder.id, item.schemaIdentifier).then((response) => {
			if (response === undefined) {
				return;
			}

			folderMedia.refetch();

			const descriptionVariables = {
				item: item.name,
				folder:
					folder?.name || tText('pages/account/mijn-mappen/folder-slug/index___onbekend'),
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
	 * Show label if
	 * - user doesn't have access to detail page of the object
	 * - and object has one of the visitor space licenses
	 * https://meemoo.atlassian.net/browse/ARC-1957
	 * @param item
	 */
	const getShowLocallyAvailableLabel = (item: FolderIeObject) => {
		// ARC-2021: Do not show locally available label if no visitor space
		if (!item.maintainerSlug) {
			return false;
		}
		return (
			isEmpty(item.accessThrough) &&
			(item.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_METADATA_ALL) ||
				item.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT))
		);
	};

	/**
	 * Show buttons if
	 * - user doesn't have access to detail page of the object
	 * - and object has one of the visitor space licenses
	 * https://meemoo.atlassian.net/browse/ARC-1957
	 * @param item
	 */
	const getShowPlanVisitButtons = (item: FolderIeObject) => {
		// ARC-2021: Do not show plan visit buttons if no visitor space
		if (!item.maintainerSlug) {
			return false;
		}
		return (
			isEmpty(item.accessThrough) &&
			(item.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_METADATA_ALL) ||
				item.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT))
		);
	};

	/**
	 * Render
	 */

	const renderTitleButtons = useMemo(() => {
		return [
			...(activeFolder?.id
				? [
						{
							before: false,
							node: (
								<Button
									variants={['silver']}
									icon={<Icon name={IconNamesLight.Share} aria-hidden />}
									aria-label={tText(
										'pages/account/mijn-mappen/folder-slug/index___map-delen'
									)}
									name={tText(
										'pages/account/mijn-mappen/folder-slug/index___map-delen'
									)}
									onClick={(e) => {
										e.stopPropagation();
										setShowShareMapBlade(true);
									}}
									tooltipText={tText(
										'pages/account/mijn-mappen/folder-slug/index___map-delen'
									)}
								/>
							),
						},
				  ]
				: []),
			...(activeFolder && !activeFolder.isDefault
				? [
						{
							before: false,
							node: (
								<Button
									key={'delete-folder'}
									disabled={!!activeFolder.usedForLimitedAccessUntil}
									className="p-account-my-folders__delete"
									variants={['silver']}
									icon={<Icon name={IconNamesLight.Trash} aria-hidden />}
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
									tooltipText={
										activeFolder.usedForLimitedAccessUntil
											? tText(
													'pages/account/mijn-mappen/folder-slug/index___map-beperkte-toegang-niet-verwijderen'
											  )
											: tText(
													'pages/account/mijn-mappen/folder-slug/index___map-verwijderen'
											  )
									}
								/>
							),
						},
				  ]
				: []),
		];
	}, [activeFolder]);

	const renderButtons = () => {
		return (
			<>
				{renderTitleButtons.filter((b) => b.before).map((b) => b.node)}
				<Button
					key={'edit-title'}
					onClick={() => setEditMode((prevState) => !prevState)}
					className={styles['p-my-folders__folder-edit']}
					variants={['silver']}
					name={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___map-aanpassen'
					)}
					icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
					aria-label={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___titel-aanpassen'
					)}
					tooltipText={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___titel-aanpassen'
					)}
				/>

				{renderTitleButtons.filter((b) => !b.before).map((b) => b.node)}
			</>
		);
	};

	const renderActions = (item: IdentifiableMediaCard, folder: Folder) => (
		<>
			<Button
				variants={['text']}
				label={tHtml('pages/account/mijn-mappen/folder-slug/index___verwijderen')}
				onClick={() => onRemoveFromFolder(item, folder)}
			/>
			<Button
				variants={['text']}
				label={tHtml('pages/account/mijn-mappen/folder-slug/index___verplaatsen')}
				onClick={() => onMoveFolder(item)}
			/>
		</>
	);

	// We need to use Highlighter because we're passing a Link, MediaCard needs a string to auto-highlight
	const renderTitle = (item: FolderIeObject): ReactNode => {
		return (
			<b>
				<Highlighter searchWords={keywords} autoEscape={true} textToHighlight={item.name} />
			</b>
		);
	};

	const renderDescription = (folderIeObject: FolderIeObject): ReactNode => {
		const showAccessLabel =
			folderIeObject?.accessThrough.includes(IeObjectAccessThrough.VISITOR_SPACE_FULL) ||
			folderIeObject?.accessThrough.includes(IeObjectAccessThrough.VISITOR_SPACE_FOLDERS);

		const metadataEntries: { label: string | ReactNode; value: string }[] = [
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___aanbieder'),
				value: folderIeObject.maintainerName,
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___programma'),
				value: folderIeObject?.isPartOf?.programma?.join(', ') || '',
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___serie'),
				value: folderIeObject?.isPartOf?.serie?.join(', ') || '',
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___type'),
				value: folderIeObject.dctermsFormat || '',
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___creatiedatum'),
				value: formatMediumDate(asDate(folderIeObject.dateCreatedLowerBound)),
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___uitzenddatum'),
				value: formatMediumDate(asDate(folderIeObject.datePublished)),
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___identifier-bij-meemoo'),
				value: folderIeObject.schemaIdentifier || '',
			},
			{
				label: tHtml(
					'pages/account/mijn-mappen/folder-slug/index___identifier-bij-aanbieder'
				),
				value: folderIeObject.meemooLocalId || '',
			},
		];

		return (
			<div className="p-account-my-folders__card-description">
				{metadataEntries.map((metadataEntry, i) => {
					return metadataEntry.value ? (
						<p key={i} className="u-pr-24 u-text-break">
							<b>{metadataEntry.label}: </b>
							<Highlighter
								searchWords={keywords}
								autoEscape={true}
								textToHighlight={metadataEntry.value || ''}
							/>
						</p>
					) : null;
				})}
				{showAccessLabel && (
					<p className="p-account-my-folders__card-description-access">
						<Icon name={IconNamesLight.Clock} />
						<span className="u-ml-4">
							{tText(
								'pages/account/mijn-mappen/folder-slug/index___tijdelijke-toegang'
							)}
						</span>
					</p>
				)}
			</div>
		);
	};

	const renderPageContent = () => {
		return (
			<>
				<AccountLayout className="p-account-my-folders">
					<SidebarLayout
						color="platinum"
						responsiveTo={Breakpoints.md}
						sidebarTitle={tHtml(
							'pages/account/mijn-mappen/folder-slug/index___mijn-mappen'
						)}
						sidebarLinks={[
							...sidebarLinks,
							{
								id: 'p-account-my-folders__new-folder',
								variants: ['c-list-navigation__item--no-interaction'],
								node: (
									<CreateFolderButton afterSubmit={() => getFolders.refetch()} />
								),
								hasDivider: true,
							},
						]}
					>
						{activeFolder && (
							<>
								<div className="l-container u-mt-64 u-mb-48">
									<div className="p-account-my-folders__active-card">
										<SidebarLayoutTitle
											className={'p-account-my-folders__active-card__title'}
										>
											{activeFolder.name}
										</SidebarLayoutTitle>
										<div className="p-account-my-folders__active-card__buttons">
											{renderButtons()}
										</div>
									</div>
									<p className="p-account-my-folders__active-card__description">
										{activeFolder.description || ''}
									</p>
								</div>

								<div className="l-container u-mb-24:md u-mb-32">
									<FormControl
										className="c-form-control--label-hidden"
										id={`${labelKeys.search}--${activeFolder.id}`}
										label={tHtml(
											'pages/account/mijn-mappen/folder-slug/index___zoeken-in-deze-map'
										)}
									>
										{activeFolder.usedForLimitedAccessUntil && (
											<div className="p-account-my-folders__limited-access-wrapper">
												<div>
													<Icon
														className="u-mr-4 u-font-size-18"
														name={IconNamesLight.OpenDoor}
													/>
												</div>
												<p>
													{tText(
														'pages/account/mijn-mappen/folder-slug/index___map-beperkte-toegang'
													)}
													{` ${formatMediumDate(
														new Date(
															activeFolder?.usedForLimitedAccessUntil
														)
													)}`}
												</p>
											</div>
										)}
										<SearchBar
											id={`${labelKeys.search}--${activeFolder.id}`}
											value={search}
											className="p-account-my-folders__search"
											placeholder={tText(
												'pages/account/mijn-mappen/folder-slug/index___zoek'
											)}
											onChange={setSearch}
											onSearch={(newValue) =>
												setFilters({
													[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]:
														newValue || undefined,
												})
											}
										/>
									</FormControl>
								</div>

								<div className="l-container">
									{!folderMedia?.isError && (
										<MediaCardList
											keywords={keywords}
											items={folderMedia?.data?.items.map((media) => {
												let link: string | undefined = stringifyUrl({
													url: `/${
														ROUTE_PARTS_BY_LOCALE[locale].search
													}/${media.maintainerSlug}/${
														media.schemaIdentifier
													}/${kebabCase(media.name) || 'titel'}`,
													query: {
														[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]:
															(keywords || []).join(
																HIGHLIGHTED_SEARCH_TERMS_SEPARATOR
															),
													},
												});
												if (isEmpty(media.accessThrough)) {
													// If the user has no access to the object, do not make the card clickable
													link = undefined;
												}
												const base: IdentifiableMediaCard = {
													schemaIdentifier: media.schemaIdentifier,
													maintainerSlug: media.maintainerSlug,
													description: renderDescription(media),
													title: renderTitle(media),
													name: media.name,
													type: media.dctermsFormat,
													preview: media.thumbnailUrl,
													duration: media.duration,
													licenses: media.licenses,
													showKeyUserLabel: media.accessThrough.includes(
														IeObjectAccessThrough.SECTOR
													),
													showLocallyAvailable:
														getShowLocallyAvailableLabel(media),
													showPlanVisitButtons:
														getShowPlanVisitButtons(media),
													previousPage: myFoldersPath,
													link: link,
												} as any;

												return {
													...base,
													actions: renderActions(base, activeFolder),
													...(!isNil(media.dctermsFormat) && {
														icon: TYPE_TO_ICON_MAP[media.dctermsFormat],
													}),
												};
											})}
											view={'list'}
										/>
									)}

									{folderMedia.data &&
										folderMedia.data?.total > FolderItemListSize && (
											<PaginationBar
												className="u-mb-48"
												start={(filters.page - 1) * FolderItemListSize}
												count={FolderItemListSize}
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
					isOpen={activeFolder && showConfirmDelete}
					onClose={() => setShowConfirmDelete(false)}
					onCancel={() => setShowConfirmDelete(false)}
					onConfirm={() => {
						setShowConfirmDelete(false);

						activeFolder &&
							foldersService.delete(activeFolder.id).then(() => {
								getFolders.refetch();
							});
					}}
				/>
				<EditFolderBlade
					isOpen={editMode}
					onClose={() => setEditMode((prevState) => !prevState)}
					currentFolder={activeFolder}
					onSave={onFolderDataEdited}
				/>
				<AddToFolderBlade
					isOpen={!!selected && isAddToFolderBladeOpen}
					objectToAdd={
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
					id="folder-detail__add-to-folder-blade"
				/>
				{activeFolder?.id && (
					<ShareFolderBlade
						onClose={() => setShowShareMapBlade(false)}
						isOpen={showShareMapBlade}
						folderId={activeFolder.id}
						folderName={activeFolder.name}
					/>
				)}
			</>
		);
	};

	return (
		<VisitorLayout>
			<SeoTags
				title={
					tText('pages/account/mijn-mappen/folder-slug/index___mijn-mappen') +
					` | ${activeFolder?.name || folderSlug}`
				}
				description={tText(
					'pages/account/mijn-mappen/folder-slug/index___mijn-mappen-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
			/>
			<PermissionsCheck allPermissions={[Permission.MANAGE_ACCOUNT]}>
				{renderPageContent()}
			</PermissionsCheck>
		</VisitorLayout>
	);
};
