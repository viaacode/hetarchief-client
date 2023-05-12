import {
	Button,
	FormControl,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil, kebabCase } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ComponentType, ReactNode, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import save from 'save-file';
import { useQueryParams } from 'use-query-params';

import { CreateFolderButton } from '@account/components';
import { EditFolderTitle } from '@account/components/EditFolderTitle';
import { ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG, FolderItemListSize, Permission } from '@account/const';
import { useGetFolderExport } from '@account/hooks/get-folder-export';
import { useGetFolderMedia } from '@account/hooks/get-folder-media';
import { useGetFolders } from '@account/hooks/get-folders';
import { AccountLayout } from '@account/layouts';
import { foldersService } from '@account/services/folders';
import { Folder, FolderIeObject } from '@account/types';
import { createFolderSlug } from '@account/utils';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	Icon,
	IconNamesLight,
	IdentifiableMediaCard,
	ListNavigationItem,
	MediaCardList,
	PaginationBar,
	SearchBar,
} from '@shared/components';
import { ConfirmationModal } from '@shared/components/ConfirmationModal';
import { TYPE_TO_ICON_MAP } from '@shared/components/MediaCard/MediaCard.consts';
import PermissionsCheck from '@shared/components/PermissionsCheck/PermissionsCheck';
import { ShareFolderBlade } from '@shared/components/ShareFolderBlade';
import { SidebarLayoutTitle } from '@shared/components/SidebarLayoutTitle';
import { ROUTES } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { SidebarLayout } from '@shared/layouts/SidebarLayout';
import { toastService } from '@shared/services/toast-service';
import { selectFolders, setFolders } from '@shared/store/ie-objects';
import { selectLastScrollPosition, setBreadcrumbs, setLastScrollPosition } from '@shared/store/ui';
import { Breakpoints } from '@shared/types';
import { AccessThroughType } from '@shared/types/access';
import { DefaultSeoInfo } from '@shared/types/seo';
import { asDate, formatMediumDate } from '@shared/utils';

import { AddToFolderBlade } from '../../../../modules/visitor-space/components';

import { VisitorLayout } from 'modules/visitors';

type ListNavigationFolderItem = ListNavigationItem & Folder;

const labelKeys = {
	search: 'AccountMyFolders__search',
};

const AccountMyFolders: NextPage<DefaultSeoInfo> = ({ url }) => {
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const dispatch = useDispatch();
	const { folderSlug } = router.query;

	/**
	 * Data
	 */
	const [filters, setFilters] = useQueryParams(ACCOUNT_FOLDERS_QUERY_PARAM_CONFIG);
	const [search, setSearch] = useState<string>(filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] || '');
	const [blockFallbackRedirect, setBlockFallbackRedirect] = useState(false);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [showShareMapBlade, setShowShareMapBlade] = useState(false);
	const [isAddToFolderBladeOpen, setShowAddToFolderBlade] = useState(false);
	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);
	const getFolders = useGetFolders();
	const folders = useSelector(selectFolders);
	const lastScrollPosition = useSelector(selectLastScrollPosition);

	const sidebarLinks: ListNavigationFolderItem[] = useMemo(
		() =>
			(folders?.items || []).map((folder) => {
				const slug = createFolderSlug(folder);
				const href = `${ROUTES.myFolders}/${slug}`;

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
					active: decodeURIComponent(slug) === folderSlug,
				};
			}),
		[folders, folderSlug]
	);

	const activeFolder = useMemo(() => sidebarLinks.find((link) => link.active), [sidebarLinks]);

	const folderMedia = useGetFolderMedia(
		activeFolder?.id,
		filters[QUERY_PARAM_KEY.SEARCH_QUERY_KEY],
		filters.page,
		FolderItemListSize
	);

	// export
	const { mutateAsync: getFolderExport } = useGetFolderExport();

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
		if (!activeFolder && folders) {
			const favorites = folders?.items.find((col) => col.isDefault);
			!blockFallbackRedirect && favorites && router.push(createFolderSlug(favorites));
		}
	}, [activeFolder, folders, router, blockFallbackRedirect]);

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
					label: tText('pages/slug/ie/index___breadcrumbs___mijn-mappen'),
					to: ROUTES.myFolders,
				},
				{
					label: activeFolder.name,
					to: `${ROUTES.myFolders}/${createFolderSlug(activeFolder)}`,
				},
			])
		);
	}, [activeFolder]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// Ward: wait until items are rendered on the screen before scrolling
		if (
			lastScrollPosition &&
			lastScrollPosition.page === ROUTES.myFolders &&
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
	}, [folderMedia?.data?.items]);

	/**
	 * Events
	 */

	const onFolderTitleChanged = async (newFolder: Folder) => {
		setBlockFallbackRedirect(true);

		// Temp set folders with new name in redux store
		if (folders) {
			dispatch(
				setFolders({
					...folders,
					items: (folders?.items || []).map((folder): Folder => {
						if (folder.id === newFolder.id) {
							return newFolder;
						} else {
							return folder;
						}
					}),
				})
			);
		}

		// Fetch folders from the network
		await getFolders.refetch();
		await router.push(createFolderSlug(newFolder));
		setBlockFallbackRedirect(false);
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

	const getShowLocallyAvailable = (item: FolderIeObject) => {
		const userHasAccessToMaintainer =
			item.accessThrough.includes(AccessThroughType.VISITOR_SPACE_FOLDERS) ||
			item.accessThrough.includes(AccessThroughType.VISITOR_SPACE_FULL);

		const itemHasThumbnail = item.thumbnailUrl;

		return (
			!userHasAccessToMaintainer &&
			item.accessThrough.includes(AccessThroughType.SECTOR) &&
			!itemHasThumbnail
		);
	};

	/**
	 * Render
	 */

	const renderTitleButtons = useMemo(() => {
		return [
			...(activeFolder && !activeFolder.isDefault
				? [
						{
							before: false,
							node: (
								<Tooltip position="top">
									<TooltipTrigger>
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
										/>
									</TooltipTrigger>
									<TooltipContent>
										<span>
											{tText(
												'pages/account/mijn-mappen/folder-slug/index___map-beperkte-toegang-niet-verwijderen'
											)}
										</span>
									</TooltipContent>
								</Tooltip>
							),
						},
				  ]
				: []),
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
								/>
							),
						},
				  ]
				: []),
		];
	}, [tText, activeFolder, getFolderExport, tHtml]);

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
	const renderTitle = (item: FolderIeObject): ReactNode => (
		<b>
			<Highlighter searchWords={keywords} autoEscape={true} textToHighlight={item.name} />
		</b>
	);

	const renderDescription = (item: FolderIeObject): ReactNode => {
		const showAccessLabel =
			item?.accessThrough.includes(AccessThroughType.VISITOR_SPACE_FULL) ||
			item?.accessThrough.includes(AccessThroughType.VISITOR_SPACE_FOLDERS);

		const items: { label: string | ReactNode; value: ReactNode }[] = [
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___aanbieder'),
				value: item.maintainerName,
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___programma'),
				value: item?.isPartOf?.programma?.join(', ') || '',
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___serie'),
				value: item?.isPartOf?.serie?.join(', ') || '',
			},
			{
				label: tHtml('pages/account/mijn-mappen/folder-slug/index___type'),
				value: item.dctermsFormat,
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
			<div className="p-account-my-folders__card-description">
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
								node: <CreateFolderButton afterSubmit={getFolders.refetch} />,
								hasDivider: true,
							},
						]}
					>
						{activeFolder && (
							<>
								<div className="l-container u-mt-64 u-mb-48">
									<SidebarLayoutTitle>
										<EditFolderTitle
											key={activeFolder.id}
											folder={activeFolder}
											afterSubmit={onFolderTitleChanged}
											buttons={renderTitleButtons}
										/>
									</SidebarLayoutTitle>
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
														AccessThroughType.SECTOR
													),
													showLocallyAvailable:
														getShowLocallyAvailable(media),
													previousPage: ROUTES.myFolders,
												};

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
			{renderOgTags(
				tText('pages/account/mijn-mappen/folder-slug/index___mijn-mappen') +
					` | ${activeFolder?.name || folderSlug}`,
				tText(
					'pages/account/mijn-mappen/folder-slug/index___mijn-mappen-meta-omschrijving'
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

export default withAuth(AccountMyFolders as ComponentType, true);
