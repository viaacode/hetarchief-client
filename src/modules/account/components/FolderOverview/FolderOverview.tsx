import { CreateFolderButton } from '@account/components/CreateFolderButton';
import { EditFolderBlade } from '@account/components/EditFolderBlade';
import { FolderLevelDisclaimer } from '@account/components/FolderLevelDisclaimer';
import { FolderSortDropdown } from '@account/components/FolderSortDropdown';
import {
	ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG,
	FOLDER_SORT_STORAGE_KEYS,
	FolderItemListSize,
	Permission,
} from '@account/const';
import { useGetFolderMedia } from '@account/hooks/get-folder-media';
import { useGetFolders } from '@account/hooks/get-folders';
import { useFolderSort } from '@account/hooks/use-folder-sort';
import { FoldersService } from '@account/services/folders';
import type { Folder, FolderIeObject } from '@account/types';
import { createFolderSlug } from '@account/utils';
import { getOrganisationFolders, getPersonalFolders, sortFolders } from '@account/utils/folders';
import { Button, FormControl, PaginationBar } from '@meemoo/react-components';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import type { ListNavigationItem } from '@shared/components/ListNavigation';
import { Loading } from '@shared/components/Loading';
import { getIconFromObjectType, type IdentifiableMediaCard } from '@shared/components/MediaCard';
import { MediaCardList } from '@shared/components/MediaCardList';
import { getDefaultPaginationBarProps } from '@shared/components/PaginationBar/PaginationBar.consts';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ShareFolderBlade } from '@shared/components/ShareFolderBlade';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';
import { ROUTE_PARTS_BY_LOCALE, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { getIeObjectDetailPath } from '@shared/helpers/ie-object-urls';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';
import { toastService } from '@shared/services/toast-service';
import { setFolders } from '@shared/store/ie-objects';
import { selectLastScrollPosition, setBreadcrumbs, setLastScrollPosition } from '@shared/store/ui';
import { Breakpoints } from '@shared/types';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { asDate, formatMediumDate } from '@shared/utils/dates';
import {
	HetArchiefIeObjectAccessThrough,
	HetArchiefIeObjectLicense,
	HetArchiefIsPartOfKey,
} from '@viaa/avo2-types';
import { AddToFolderBlade } from '@visitor-space/components/AddToFolderBlade';
import clsx from 'clsx';
import { isEmpty, isNil } from 'es-toolkit/compat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import queryString from 'query-string';
import { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import styles from './FolderOverview.module.scss';

type ListNavigationFolderItem = ListNavigationItem & Folder;

const labelKeys = {
	search: 'AccountMyFolders__search',
};

export type FolderLevel = 'personal' | 'organisation';

interface FolderOverviewProps extends Pick<DefaultSeoInfo, 'url' | 'canonicalUrl'> {
	/**
	 * personal: the folders of the user, on /account/mijn-mappen
	 * organisation: the folders shared between all CP admins of the organisation, on /beheer/organisatiemappen
	 */
	level: FolderLevel;
	folderSlug: string | undefined;
}

/**
 * Overview of folders: sidebar with the list of folders and the objects of the active folder
 * Used for both the personal folders and the organisation folders, the outer layout is provided by the page
 */
export const FolderOverview: FC<FolderOverviewProps> = ({
	level,
	folderSlug,
	url,
	canonicalUrl,
}) => {
	const router = useRouter();
	const locale = useLocale();
	const dispatch = useDispatch();
	const isOrganisationLevel = level === 'organisation';
	const canManageOrganisationFolders = useHasAllPermission(Permission.MANAGE_ORGANISATION_FOLDERS);
	const isSlugDefaultFolder =
		!isOrganisationLevel &&
		(!folderSlug ||
			Object.values(ROUTE_PARTS_BY_LOCALE)
				.map((routeParts) => routeParts.favorites)
				.includes(folderSlug as string));
	const foldersPath = isOrganisationLevel
		? ROUTES_BY_LOCALE[locale].cpAdminOrganisationFolders
		: ROUTES_BY_LOCALE[locale].accountMyFolders;
	const overviewTitle = isOrganisationLevel
		? tText('modules/account/components/folder-overview/folder-overview___organisatiemappen')
		: tText('pages/account/mijn-mappen/folder-slug/index___mijn-mappen');

	/**
	 * Data
	 */
	const [filters, setFilters] = useQueryParams(ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [showShareMapBlade, setShowShareMapBlade] = useState(false);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [selected, setSelected] = useState<Partial<IdentifiableMediaCard> | null>(null);
	const lastScrollPosition = useSelector(selectLastScrollPosition);
	const [folderSort, setFolderSort] = useFolderSort(
		isOrganisationLevel ? FOLDER_SORT_STORAGE_KEYS.organisation : FOLDER_SORT_STORAGE_KEYS.personal
	);
	const { data: allFolders, refetch: refetchFolders } = useGetFolders();
	// The folders endpoint returns personal and organisation folders, only show the ones of this level
	const folders = useMemo(
		() =>
			sortFolders(
				isOrganisationLevel ? getOrganisationFolders(allFolders) : getPersonalFolders(allFolders),
				folderSort
			),
		[allFolders, isOrganisationLevel, folderSort]
	);
	const defaultFolder = folders.find((folder) => folder.isDefault);

	const isActive = useCallback(
		(folder: Folder): boolean => {
			if (
				folder.isDefault &&
				(folderSlug === ROUTE_PARTS_BY_LOCALE.nl.favorites ||
					folderSlug === ROUTE_PARTS_BY_LOCALE.en.favorites)
			) {
				return true;
			}
			return decodeURIComponent(createFolderSlug(folder, locale)) === folderSlug;
		},
		[folderSlug, locale]
	);
	const activeFolder: Folder | undefined = isSlugDefaultFolder
		? defaultFolder
		: folders.find((folder) => isActive(folder)) || defaultFolder || folders[0];

	const sidebarLinks: ListNavigationFolderItem[] = useMemo(
		() =>
			folders.map((folder) => {
				const slug = createFolderSlug(folder, locale);
				const href = `${foldersPath}/${slug}`;
				const active = folder.id === activeFolder?.id;

				return {
					...folder,
					node: ({ linkClassName }) => (
						<Link
							href={href}
							className={clsx(linkClassName, 'p-account-my-folders__link')}
							aria-label={folder.name}
							aria-current={active ? 'page' : undefined}
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
						</Link>
					),
					active,
					// Favorites are always on top, separated from the sorted folders
					hasDivider: folder.isDefault && folders.length > 1,
				};
			}),
		[folders, locale, foldersPath, activeFolder?.id]
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

	const mappedKeywords = useMemo(
		() => keywords.map((value) => ({ value, isLiteral: true })),
		[keywords]
	);

	/**
	 * Effects
	 */

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
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
					label: isOrganisationLevel
						? tText(
								'modules/account/components/folder-overview/folder-overview___organisatiemappen'
							)
						: tText('pages/slug/ie/index___breadcrumbs-mijn-mappen'),
					to: foldersPath,
				},
				{
					label: activeFolder.name,
					to: `${foldersPath}/${createFolderSlug(activeFolder, locale)}`,
				},
			])
		);
	}, [activeFolder]);

	// Organisation folders have no default folder, so the url should always point to an existing folder
	// eg: when arriving on the overview without a folder, or after the active folder was deleted
	useEffect(() => {
		if (!isOrganisationLevel || !allFolders || !activeFolder) {
			return;
		}
		if (!folderSlug || !folders.some((folder) => isActive(folder))) {
			router.replace(`${foldersPath}/${createFolderSlug(activeFolder, locale)}`);
		}
	}, [
		isOrganisationLevel,
		allFolders,
		activeFolder,
		folderSlug,
		folders,
		isActive,
		router.replace,
		foldersPath,
		locale,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		// Ward: wait until items are rendered on the screen before scrolling
		if (lastScrollPosition && lastScrollPosition.page === foldersPath && folderMedia?.data?.items) {
			setTimeout(() => {
				const item = document.getElementById(`${lastScrollPosition.itemId}`) as HTMLElement | null;

				item?.scrollIntoView({ block: 'center', behavior: 'smooth' });
				dispatch(setLastScrollPosition(null));
			}, 100);
		}
	}, [folderMedia?.data?.items, dispatch]);

	/**
	 * Events
	 */

	const onFolderDataEdited = async (newFolder: Folder) => {
		// Temp set folders with new name in redux store
		if (allFolders) {
			dispatch(
				setFolders(
					allFolders.map((folder): Folder => {
						if (folder.id === newFolder.id) {
							return newFolder;
						}
						return folder;
					})
				)
			);
		}

		// Fetch folders from the network
		await refetchFolders();
		await router.push(`${foldersPath}/${createFolderSlug(newFolder, locale)}`);
	};

	const onMoveFolder = (item: Partial<IdentifiableMediaCard>) => {
		setSelected(item);
		setShowAddToFolderBlade(true);
	};

	const onRemoveFromFolder = (item: Partial<IdentifiableMediaCard>, folder: Folder) => {
		FoldersService.removeFromFolder(folder.id, item.schemaIdentifier as string).then((response) => {
			if (response === undefined) {
				return;
			}

			folderMedia.refetch();

			const descriptionVariables = {
				item: item.name,
				folder: folder?.name || tText('pages/account/mijn-mappen/folder-slug/index___onbekend'),
			};

			toastService.notify({
				maxLines: 3,
				title: tHtml('pages/account/mijn-mappen/folder-slug/index___item-verwijderd-uit-map-titel'),
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
			(item.licenses?.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL) ||
				item.licenses?.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT))
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
			(item.licenses?.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL) ||
				item.licenses?.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT))
		);
	};

	/**
	 * Render
	 */

	const renderTitleButtons = useMemo(() => {
		return [
			// Organisation folders are shared automatically with the other CP admins, so they cannot be shared via email
			...(activeFolder?.id && !isOrganisationLevel
				? [
						{
							before: false,
							node: (
								<Button
									key={'share-folder'}
									variants={['silver']}
									icon={<Icon name={IconNamesLight.Share} aria-hidden />}
									name={tText('pages/account/mijn-mappen/folder-slug/index___map-delen')}
									ariaLabel={tText('pages/account/mijn-mappen/folder-slug/index___map-delen')}
									onClick={(e) => {
										e.stopPropagation();
										setShowShareMapBlade(true);
									}}
									tooltipText={tText('pages/account/mijn-mappen/folder-slug/index___map-delen')}
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
									name={tText('pages/account/mijn-mappen/folder-slug/index___map-verwijderen')}
									ariaLabel={tText('pages/account/mijn-mappen/folder-slug/index___map-verwijderen')}
									onClick={(e) => {
										e.stopPropagation();
										setShowConfirmDelete(true);
									}}
									tooltipText={
										activeFolder.usedForLimitedAccessUntil
											? tText(
													'pages/account/mijn-mappen/folder-slug/index___map-beperkte-toegang-niet-verwijderen'
												)
											: tText('pages/account/mijn-mappen/folder-slug/index___map-verwijderen')
									}
								/>
							),
						},
					]
				: []),
		];
	}, [activeFolder, isOrganisationLevel]);

	const renderButtons = () => {
		return (
			<>
				{renderTitleButtons.filter((b) => b.before).map((b) => b.node)}
				<Button
					key={'edit-title'}
					onClick={() => setEditMode((prevState) => !prevState)}
					className={styles['c-folder-overview__folder-edit']}
					variants={['silver']}
					name={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___map-aanpassen'
					)}
					ariaLabel={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___map-aanpassen'
					)}
					icon={<Icon name={IconNamesLight.Edit} aria-hidden />}
					tooltipText={tText(
						'modules/account/components/edit-folder-title/edit-folder-title___titel-aanpassen'
					)}
				/>

				{renderTitleButtons.filter((b) => !b.before).map((b) => b.node)}
			</>
		);
	};

	const renderActions = (item: Partial<IdentifiableMediaCard>, folder: Folder | undefined) => {
		if (!folder) {
			return null;
		}
		return (
			<>
				<Button
					variants={['text']}
					label={tText('pages/account/mijn-mappen/folder-slug/index___verwijderen')}
					onClick={() => onRemoveFromFolder(item, folder)}
				/>
				<Button
					variants={['text']}
					label={tText('pages/account/mijn-mappen/folder-slug/index___verplaatsen')}
					onClick={() => onMoveFolder(item)}
				/>
			</>
		);
	};

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
			folderIeObject?.accessThrough.includes(HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FULL) ||
			folderIeObject?.accessThrough.includes(HetArchiefIeObjectAccessThrough.VISITOR_SPACE_FOLDERS);

		const metadataEntries: { label: string | ReactNode; value: string }[] = [
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___aanbieder'),
				value: folderIeObject.maintainerName,
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___programma'),
				value: folderIeObject?.isPartOf?.[HetArchiefIsPartOfKey.program]?.join(', ') || '',
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___serie'),
				value: folderIeObject?.isPartOf?.[HetArchiefIsPartOfKey.series]?.join(', ') || '',
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
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___identifier-bij-aanbieder'),
				value: folderIeObject.meemooLocalId || '',
			},
		];

		return (
			<div className="p-account-my-folders__card-description">
				{metadataEntries.map((metadataEntry) => {
					return metadataEntry.value ? (
						<p
							key={`metadata-entry--${metadataEntry.label}--${metadataEntry.value}`}
							className="u-pr-24 u-text-break"
						>
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
							{tText('pages/account/mijn-mappen/folder-slug/index___tijdelijke-toegang')}
						</span>
					</p>
				)}
			</div>
		);
	};

	const renderObjectsInFolder = () => {
		if (folderMedia?.isError) {
			return (
				<div className="l-container">
					<p>
						{tHtml(
							'modules/account/views/my-folders___het-laden-van-de-objecten-in-deze-folder-is-mislukt'
						)}
					</p>
				</div>
			);
		}
		if (folderMedia?.isLoading) {
			return (
				<div className="l-container u-color-neutral">
					<Loading locationId="my folders load objects" />
				</div>
			);
		}
		if ((folderMedia?.data?.items?.length || 0) === 0) {
			return (
				<div className="l-container u-color-neutral">
					<p>
						{tHtml(
							'modules/account/views/my-folders___er-zitten-nog-geen-objecten-in-deze-folder-br-voeg-er-toe-via-het-bookmark-icoon-op-de-zoek-of-detail-paginas'
						)}
					</p>
				</div>
			);
		}
		return (
			<div className="l-container">
				<MediaCardList
					keywords={mappedKeywords}
					items={folderMedia?.data?.items.map((media) => {
						let link: string | undefined = queryString.stringifyUrl({
							url: getIeObjectDetailPath(
								locale,
								media.maintainerSlug,
								media.schemaIdentifier,
								media.name
							),
							query: {
								[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]: JSON.stringify(mappedKeywords),
							},
						});
						if (isEmpty(media.accessThrough)) {
							// If the user has no access to the object, do not make the card clickable
							link = undefined;
						}
						const base: Partial<IdentifiableMediaCard> = {
							schemaIdentifier: media.schemaIdentifier,
							maintainerSlug: media.maintainerSlug,
							description: renderDescription(media),
							title: renderTitle(media),
							name: media.name,
							type: media.dctermsFormat,
							thumbnail: media.thumbnailUrl,
							hasAccessToEssence: !!media.hasAccessToEssence,
							duration: media.duration,
							licenses: media.licenses,
							showKeyUserLabel: media.accessThrough.includes(
								HetArchiefIeObjectAccessThrough.SECTOR
							),
							showLocallyAvailable: getShowLocallyAvailableLabel(media),
							showPlanVisitButtons: getShowPlanVisitButtons(media),
							previousPage: foldersPath,
							link: link,
						};

						return {
							...base,
							actions: renderActions(base, activeFolder),
							...(!isNil(media.dctermsFormat) && {
								icon: getIconFromObjectType(media.dctermsFormat, true),
							}),
						} as IdentifiableMediaCard;
					})}
					view={'list'}
				/>

				{(folderMedia?.data?.total || 0) > FolderItemListSize && (
					<PaginationBar
						{...getDefaultPaginationBarProps()}
						className="u-mb-48"
						startItem={(filters.page - 1) * FolderItemListSize}
						itemsPerPage={FolderItemListSize}
						totalItems={folderMedia.data?.total || 0}
						showBackToTop
						onPageChange={(page: number) =>
							setFilters({
								...filters,
								page: page + 1,
							})
						}
					/>
				)}
			</div>
		);
	};

	const renderActiveFolder = () => {
		if (!activeFolder) {
			if (isOrganisationLevel && allFolders) {
				// No organisation folders exist yet
				return (
					<div className="l-container u-mt-64 u-mb-48">
						<SidebarLayoutTitle>{overviewTitle}</SidebarLayoutTitle>
						<p className={clsx('u-color-neutral', styles['c-folder-overview__empty'])}>
							{tHtml(
								'modules/account/components/folder-overview/folder-overview___er-zijn-nog-geen-organisatiemappen-maak-een-nieuwe-organisatiemap-aan-via-de-knop-nieuwe-organisatiemap-aanmaken-in-het-menu-deze-map-is-meteen-zichtbaar-voor-alle-beheerders-van-je-organisatie'
							)}
						</p>
					</div>
				);
			}
			return null;
		}

		return (
			<>
				<div className="l-container u-mt-64 u-mb-48">
					<div className="p-account-my-folders__active-card">
						<SidebarLayoutTitle className={'p-account-my-folders__active-card__title'}>
							{activeFolder.name}
						</SidebarLayoutTitle>
						<div className="p-account-my-folders__active-card__buttons">{renderButtons()}</div>
					</div>
					<p className="p-account-my-folders__active-card__description">
						{activeFolder.description || ''}
					</p>
				</div>

				<div className="l-container u-mb-24-md u-mb-32">
					<FormControl
						className="c-form-control--label-hidden"
						id={`${labelKeys.search}--${activeFolder.id}`}
						label={tHtml('pages/account/mijn-mappen/folder-slug/index___zoeken-in-deze-map')}
					>
						{activeFolder.usedForLimitedAccessUntil && (
							<div className="p-account-my-folders__limited-access-wrapper">
								<div>
									<Icon className="u-mr-4 u-font-size-18" name={IconNamesLight.OpenDoor} />
								</div>
								<p>
									{tText('pages/account/mijn-mappen/folder-slug/index___map-beperkte-toegang')}
									{` ${formatMediumDate(new Date(activeFolder?.usedForLimitedAccessUntil))}`}
								</p>
							</div>
						)}
						<SearchBar
							ariaLabel={tText('modules/account/views/my-folders___zoekveld-aria-label')}
							id={`${labelKeys.search}--${activeFolder.id}`}
							value={search}
							className="p-account-my-folders__search"
							placeholder={tText('pages/account/mijn-mappen/folder-slug/index___zoek')}
							onChange={setSearch}
							onSearch={(newValue) =>
								setFilters({
									[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: newValue || undefined,
								})
							}
						/>
					</FormControl>
				</div>

				{renderObjectsInFolder()}
			</>
		);
	};

	const showDisclaimer = isOrganisationLevel || canManageOrganisationFolders;

	return (
		<>
			<SeoTags
				title={`${overviewTitle} | ${activeFolder?.name || folderSlug || ''}`}
				description={tText(
					'pages/account/mijn-mappen/folder-slug/index___mijn-mappen-meta-omschrijving'
				)}
				imgUrl={undefined}
				translatedPages={[]}
				relativeUrl={url}
				canonicalUrl={canonicalUrl}
			/>
			<SidebarLayout
				color="platinum"
				responsiveTo={Breakpoints.md}
				sidebarTitle={overviewTitle}
				sidebarTitleActions={
					<FolderSortDropdown
						id={`folder-overview--${level}`}
						activeSort={folderSort}
						onSortChange={setFolderSort}
					/>
				}
				sidebarSubtitle={showDisclaimer ? <FolderLevelDisclaimer level={level} /> : undefined}
				sidebarLinks={[
					...sidebarLinks,
					{
						id: 'p-account-my-folders__new-folder',
						variants: ['c-list-navigation__item--no-interaction'],
						node: (
							<CreateFolderButton
								isOrganisation={isOrganisationLevel}
								afterSubmit={() => refetchFolders()}
							/>
						),
						hasDivider: true,
					},
				]}
			>
				{renderActiveFolder()}
			</SidebarLayout>

			<ConfirmationModal
				text={{
					yes: tText('pages/account/mijn-mappen/folder-slug/index___verwijderen'),
					no: tText('pages/account/mijn-mappen/folder-slug/index___annuleren'),
				}}
				isOpen={!!activeFolder && showConfirmDelete}
				onClose={() => setShowConfirmDelete(false)}
				onCancel={() => setShowConfirmDelete(false)}
				onConfirm={() => {
					setShowConfirmDelete(false);

					activeFolder &&
						FoldersService.delete(activeFolder.id).then(() => {
							refetchFolders();
						});
				}}
			/>
			<EditFolderBlade
				isOpen={editMode}
				onClose={() => setEditMode((prevState) => !prevState)}
				currentFolder={activeFolder as Folder}
				onSave={onFolderDataEdited}
			/>
			<AddToFolderBlade
				isOpen={!!selected && isAddToFolderBladeOpen}
				objectsToAdd={
					selected
						? [
								{
									schemaIdentifier: selected.schemaIdentifier as string,
									title: selected.name,
								},
							]
						: []
				}
				onClose={() => {
					setShowAddToFolderBlade(false);
					setSelected(null);
				}}
				onSubmit={async () => {
					setShowAddToFolderBlade(false);
					setSelected(null);
					folderMedia.refetch();
				}}
				id="folder-detail__add-to-folder-blade"
				ariaLabel={tText(
					'modules/account/views/account-my-folders___voeg-dit-object-toe-aan-een-map-blade-aria-label'
				)}
			/>
			{activeFolder?.id && !isOrganisationLevel && (
				<ShareFolderBlade
					onClose={() => setShowShareMapBlade(false)}
					isOpen={showShareMapBlade}
					folderId={activeFolder.id}
				/>
			)}
		</>
	);
};
