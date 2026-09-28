import { GroupName, Permission } from '@account/const';
import { useGetFolders } from '@account/hooks/get-folders';
import { selectUser } from '@auth/store/user';
import type { User } from '@auth/types';
import { CopyrightConfirmationModal } from '@ie-objects/components/CopyrightConfirmationModal';
import {
	type ActionItem,
	DynamicActionMenu,
	type DynamicActionMenuProps,
} from '@ie-objects/components/DynamicActionMenu';
import type { MetadataItem } from '@ie-objects/components/Metadata/Metadata.types';
import { ObjectDetailPageMetadataAiDescription } from '@ie-objects/components/ObjectDetailPageMetadata/ObjectDetailPageMetadataAiDescription';
import { useIsPublicNewspaper } from '@ie-objects/hooks/use-get-is-public-newspaper';
import {
	ANONYMOUS_ACTION_SORT_MAP,
	CP_ADMIN_ACTION_SORT_MAP,
	GET_NEWSPAPER_DOWNLOAD_OPTIONS,
	KEY_USER_ACTION_SORT_MAP,
	KIOSK_ACTION_SORT_MAP,
	MEDIA_ACTIONS,
	MEEMOO_ADMIN_ACTION_SORT_MAP,
	METADATA_EXPORT_OPTIONS,
	VISITOR_ACTION_SORT_MAP,
} from '@ie-objects/ie-objects.consts';
import {
	type ButtonsSortOrder,
	MediaActions,
	MetadataExportFormats,
} from '@ie-objects/ie-objects.types';
import {
	IE_OBJECTS_SERVICE_BASE_URL,
	IE_OBJECTS_SERVICE_EXPORT,
	NEWSPAPERS_SERVICE_BASE_URL,
} from '@ie-objects/services/ie-objects/ie-objects.service.const';
import { checkIeObjectPermissions } from '@ie-objects/utils/check-ie-object-permissions';
import { isInAFolder } from '@ie-objects/utils/folders';
import { getExternalMaterialRequestUrlIfAvailable } from '@ie-objects/utils/get-external-form-url';
import { isNewspaperType } from '@meemoo/admin-core-ui/admin';
import {
	type Breadcrumb,
	Breadcrumbs,
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
} from '@meemoo/react-components';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import { Blade } from '@shared/components/Blade/Blade';
import Callout from '@shared/components/Callout/Callout';
import HighlightedMetadata from '@shared/components/HighlightedMetadata/HighlightedMetadata';
import HighlightSearchTerms from '@shared/components/HighlightedMetadata/HighlightSearchTerms';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import MetaDataFieldWithHighlightingAndMaxLength from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { Pill } from '@shared/components/Pill';
import getConfig from '@shared/config/public-runtime-config';
import { KNOWN_STATIC_ROUTES, ROUTES_BY_LOCALE } from '@shared/const';
import { getSearchLink } from '@shared/helpers/get-search-link';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission, useHasAnyPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectBreadcrumbs } from '@shared/store/ui';
import { isMobileSize } from '@shared/utils/is-mobile';
import { HetArchiefIeObjectAccessThrough, HetArchiefIeObjectLicense } from '@viaa/avo2-types';
import { SearchFilterId } from '@visitor-space/types';
import clsx from 'clsx';
import { compact, indexOf, isEmpty, isNil, noop, sortBy } from 'es-toolkit/compat';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import React, { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './ObjectDetailPageHeader.module.scss';
import type { ObjectDetailPageHeaderProps } from './ObjectDetailPageHeader.types';

const { publicRuntimeConfig } = getConfig();

export const ObjectDetailPageHeader: React.FC<ObjectDetailPageHeaderProps> = ({
	mediaInfo,
	onClickAction,
	hasAccessToVisitorSpaceOfObject,
	currentPageIndex,
	isCollapsed,
	onShowDetails,
}) => {
	const router = useRouter();
	const locale = useLocale();

	/**
	 * Content
	 */

	const isNewspaper = isNewspaperType(mediaInfo?.dctermsFormat);
	const isPublicNewspaper: boolean = useIsPublicNewspaper(mediaInfo);
	const [selectedMetadataField, setSelectedMetadataField] = useState<MetadataItem | null>(null);
	const breadcrumbs = useSelector(selectBreadcrumbs);

	/**
	 * User
	 */

	const user: User | null = useSelector(selectUser);
	const isAnonymous = useHasAnyGroup(GroupName.ANONYMOUS);
	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);
	const isCPAdmin = useHasAnyGroup(GroupName.CP_ADMIN);
	const isKeyUser = useIsKeyUser();

	/**
	 * Permissions
	 */

	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const canViewAllSpaces = useHasAllPermission(Permission.READ_ALL_SPACES);
	const { data: accessibleVisitorSpaces } = useGetAccessibleVisitorSpaces({
		canViewAllSpaces,
	});

	const canRequestMaterial: boolean | null = useHasAllPermission(
		Permission.CREATE_MATERIAL_REQUESTS
	);
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const canViewObjectVisitorSpace: boolean = !!accessibleVisitorSpaces?.find(
		(space) => space.maintainerId === mediaInfo?.maintainerId
	);
	const canRequestAccess =
		!canViewObjectVisitorSpace &&
		mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		!mediaInfo.hasAccessToEssence;
	const showKeyUserPill = mediaInfo?.accessThrough?.includes(
		HetArchiefIeObjectAccessThrough.SECTOR
	);
	const ieObjectPermissions = checkIeObjectPermissions({
		isNewspaper,
		hasLicensePublicDomainOrCopyrightUndetermined: !!(
			mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.PUBLIC_DOMAIN) ||
			mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.COPYRIGHT_UNDETERMINED)
		),
		hasLicensePublicContent: !!mediaInfo?.licenses?.includes(
			HetArchiefIeObjectLicense.PUBLIEK_CONTENT
		),
		hasLicenseVisitorToolMetadataAllOrContent:
			!!mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_METADATA_ALL) ||
			!!mediaInfo?.licenses?.includes(HetArchiefIeObjectLicense.BEZOEKERTOOL_CONTENT),
		hasAccessToVisitorSpace: hasAccessToVisitorSpaceOfObject,
		hasPermissionExportObject: useHasAnyPermission(Permission.EXPORT_OBJECT),
		hasPermissionDownloadObject: useHasAnyPermission(Permission.DOWNLOAD_OBJECT),
		isLoggedOutUser: !user,
	});
	const canDownloadMetadata: boolean = ieObjectPermissions.canExportMetadata;

	// The AI title and synopsis are two independent fields: either one on its own is enough to show
	// the block. Newspapers are out of scope and kiosk visitors never see AI metadata. See ARC-3897.
	const showAiDescription: boolean =
		!isNewspaper && !isKiosk && (!!mediaInfo?.nameAi || !!mediaInfo?.synopsisAi);

	// You need the permission or not to be logged in to download the newspaper
	// https://meemoo.atlassian.net/browse/ARC-2617
	// https://meemoo.atlassian.net/browse/ARC-3117
	const canDownloadNewspaper: boolean = ieObjectPermissions.canDownloadEssence;

	const windowSize = useWindowSizeContext();
	const { data: folders } = useGetFolders();

	/**
	 * State
	 */

	const [metadataExportDropdownOpen, setMetadataExportDropdownOpen] = useState(false);
	const [onConfirmCopyright, setOnConfirmCopyright] = useState<() => void>(noop);
	const [copyrightModalOpen, setCopyrightModalOpen] = useState(false);

	/**
	 * Close dropdown while resizing
	 */

	// biome-ignore lint/correctness/useExhaustiveDependencies: always close when the window is resized
	useEffect(() => {
		setMetadataExportDropdownOpen(false);
	}, [windowSize]);

	/**
	 * Event handlers
	 */

	const onExportClick = useCallback(
		(format: MetadataExportFormats) => {
			if (!mediaInfo) {
				console.error('No media info available');
				return;
			}
			const newspaperExportEndpoint = `${
				publicRuntimeConfig.PROXY_URL
			}/${NEWSPAPERS_SERVICE_BASE_URL}/${IE_OBJECTS_SERVICE_EXPORT}/zip`;

			switch (format) {
				case MetadataExportFormats.fullNewspaperZip:
					setCopyrightModalOpen(true);
					setOnConfirmCopyright(() => () => {
						window.open(
							stringifyUrl({
								url: newspaperExportEndpoint,
								query: {
									ieObjectId: mediaInfo.iri,
									currentPageUrl: window.origin + router.asPath,
								},
							})
						);
					});
					break;

				case MetadataExportFormats.onePageNewspaperZip:
					setCopyrightModalOpen(true);
					setOnConfirmCopyright(() => () => {
						window.open(
							stringifyUrl({
								url: newspaperExportEndpoint,
								query: {
									ieObjectId: mediaInfo.iri,
									page: currentPageIndex,
									currentPageUrl: window.origin + router.asPath,
								},
							})
						);
					});
					break;
				default: {
					const objectExportEndpoint = `${
						publicRuntimeConfig.PROXY_URL
					}/${IE_OBJECTS_SERVICE_BASE_URL}/${IE_OBJECTS_SERVICE_EXPORT}/${format}`;
					window.open(
						stringifyUrl({
							url: objectExportEndpoint,
							query: {
								ieObjectId: mediaInfo.iri,
								currentPageUrl: window.origin + router.asPath,
							},
						})
					);
				}
			}
			setMetadataExportDropdownOpen(false);
		},
		[currentPageIndex, mediaInfo, router.asPath]
	);

	const getActionButtonSortMapByUserType = useCallback((): ButtonsSortOrder[] => {
		const canExport = canDownloadMetadata || canDownloadNewspaper;
		if (isNil(user)) {
			return ANONYMOUS_ACTION_SORT_MAP(canExport);
		}

		if (isKeyUser) {
			return KEY_USER_ACTION_SORT_MAP(canExport);
		}

		if (isKiosk) {
			return KIOSK_ACTION_SORT_MAP();
		}

		if (isMeemooAdmin) {
			return MEEMOO_ADMIN_ACTION_SORT_MAP(canExport);
		}

		if (isCPAdmin) {
			return CP_ADMIN_ACTION_SORT_MAP(canExport);
		}

		return VISITOR_ACTION_SORT_MAP(canExport);
	}, [
		canDownloadMetadata,
		isKeyUser,
		isMeemooAdmin,
		isKiosk,
		user,
		isCPAdmin,
		canDownloadNewspaper,
	]);

	const renderExportDropdown = useCallback(
		(isPrimary: boolean) => {
			const icon = <Icon name={IconNamesLight.Export} aria-hidden />;

			const buttonLabelDesktop = isPublicNewspaper
				? tText('modules/ie-objects/object-detail-page___download-deze-krant-desktop')
				: tText('modules/ie-objects/object-detail-page___export-metadata-desktop');
			const buttonLabelMobile = isPublicNewspaper
				? tText('modules/ie-objects/object-detail-page___download-deze-krant-mobile')
				: tText('modules/ie-objects/object-detail-page___export-metadata-mobile');

			const exportOptions = [];

			if (canDownloadNewspaper) {
				exportOptions.push(...GET_NEWSPAPER_DOWNLOAD_OPTIONS());
			}

			if (canDownloadMetadata) {
				exportOptions.push(...METADATA_EXPORT_OPTIONS());
			}

			return (
				<div className={styles['p-object-detail__export']}>
					<Dropdown
						isOpen={metadataExportDropdownOpen}
						onOpen={() => setMetadataExportDropdownOpen(true)}
						onClose={() => setMetadataExportDropdownOpen(false)}
						id={`object-detail-page__metadata__export-dropdown--${mediaInfo?.schemaIdentifier}`}
						placement="bottom-start"
					>
						<DropdownButton>
							{isPrimary ? (
								<Button
									variants={['black']}
									className={styles['p-object-detail__export-dropdown']}
									iconStart={icon}
									iconEnd={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
									title={buttonLabelDesktop}
								>
									<span className="u-text-ellipsis u-display-none u-display-block-lg">
										{buttonLabelDesktop}
									</span>
									<span className="u-text-ellipsis u-display-block u-display-none-lg">
										{buttonLabelMobile}
									</span>
								</Button>
							) : (
								<Button icon={icon} variants={['white']} title={buttonLabelDesktop} />
							)}
						</DropdownButton>
						<DropdownContent>
							<MenuContent
								rootClassName="c-dropdown-menu"
								className={styles['p-object-detail__export-dropdown__menu']}
								menuItems={exportOptions}
								onClick={(id) => onExportClick(id as MetadataExportFormats)}
							/>
						</DropdownContent>
					</Dropdown>
				</div>
			);
		},
		[
			isPublicNewspaper,
			canDownloadNewspaper,
			canDownloadMetadata,
			metadataExportDropdownOpen,
			onExportClick,
			mediaInfo?.schemaIdentifier,
		]
	);

	// The primary CTA in the header is styled in black, explicitly different from the normal
	// (teal) primary CTA used everywhere else on the site. See "FA: Nieuwe structuur objectdetailpagina".
	const mediaActions: DynamicActionMenuProps = useMemo(() => {
		const isMobile = isMobileSize(windowSize);
		const originalActions = MEDIA_ACTIONS({
			isMobile,
			canManageFolders: canManageFolders || isAnonymous,
			isInAFolder: isInAFolder(folders, mediaInfo?.schemaIdentifier),
			canReport: !isKiosk,
			canRequestAccess: !!canRequestAccess,
			canRequestMaterial: isAnonymous || canRequestMaterial,
			canExport: canDownloadMetadata || canDownloadNewspaper || false,
			externalFormUrl: getExternalMaterialRequestUrlIfAvailable(mediaInfo, isAnonymous, user),
		});

		// Sort, filter and tweak actions according to the given sort map
		const sortMap = getActionButtonSortMapByUserType();
		const sortMapIds = sortMap.map((d) => d.id);
		const sortedActions: ActionItem[] = sortBy(originalActions.actions, ({ id }: ActionItem) =>
			indexOf(sortMapIds, id)
		);
		const sortedActionsWithCustomElements = sortedActions.map(
			(action: ActionItem): ActionItem | null => {
				const sortInfo = sortMap.find((d) => action.id === d.id);
				const existsInSortMap = !isNil(sortInfo);
				const isPrimary = sortInfo?.isPrimary ?? false;

				if (existsInSortMap) {
					if (action.id === MediaActions.Export) {
						// Render custom dropdown for export action
						return {
							...action,
							isPrimary,
							customElement: renderExportDropdown(isPrimary),
						};
					}
					// Render button
					return {
						...action,
						isPrimary,
					};
				}
				// Button is not present in action order map, so we hide it
				return null;
			}
		);

		return {
			...originalActions,
			actions: compact(sortedActionsWithCustomElements),
		};
	}, [
		windowSize,
		canManageFolders,
		isAnonymous,
		folders,
		mediaInfo,
		isKiosk,
		canRequestAccess,
		canRequestMaterial,
		canDownloadMetadata,
		canDownloadNewspaper,
		user,
		getActionButtonSortMapByUserType,
		renderExportDropdown,
	]);

	const renderMetaDataActions = (): ReactNode => (
		<div className="p-object-detail__actions">
			<div className="p-object-detail__primary-actions">
				<DynamicActionMenu
					{...mediaActions}
					onClickAction={onClickAction}
					primaryButtonVariants={['black', 'md']}
					secondaryButtonVariants={['white']}
				/>
			</div>
		</div>
	);

	const renderResearchWarning = (): ReactNode => (
		<Callout
			className={styles['p-object-detail-header__research-warning']}
			icon={<Icon name={IconNamesLight.Info} aria-hidden />}
			text={tHtml(
				'pages/slug/ie/index___door-gebruik-te-maken-van-deze-applicatie-bevestigt-u-dat-u-het-beschikbare-materiaal-enkel-raadpleegt-voor-wetenschappelijk-of-prive-onderzoek'
			)}
			action={
				<Link
					passHref
					href={KNOWN_STATIC_ROUTES[locale].kioskConditions}
					aria-label={tText('pages/slug/index___meer-info')}
				>
					<Button
						className={styles['p-object-detail-header__read-more']}
						label={tText('pages/slug/index___meer-info')}
						variants={['text', 'sm']}
						tabIndex={-1}
					/>
				</Link>
			}
		/>
	);

	const renderKeyUserPill = (): ReactNode => (
		<Pill
			isExpanded
			icon={IconNamesLight.Key}
			label={tText(
				'pages/bezoekersruimte/visitor-space-slug/object-id/index___voor-sleutelgebruikers'
			)}
			className="u-bg-mustard"
		/>
	);

	const renderBreadcrumbs = (): ReactNode => {
		const defaultBreadcrumbs: Breadcrumb[] = [
			...(isKiosk
				? []
				: [
						{
							label: tText('modules/ie-objects/object-detail-page___home'),
							to: ROUTES_BY_LOCALE[locale].home,
						},
					]),
			{
				label: tText('modules/ie-objects/object-detail-page___zoeken'),
				to: ROUTES_BY_LOCALE[locale].search,
			},
		];

		const staticBreadcrumbs: Breadcrumb[] = !isEmpty(breadcrumbs)
			? breadcrumbs
			: defaultBreadcrumbs;

		const dynamicBreadcrumbs: Breadcrumb[] = !isNil(mediaInfo)
			? [
					...(hasAccessToVisitorSpaceOfObject
						? [
								{
									label: mediaInfo?.maintainerName,
									to: isKiosk
										? ROUTES_BY_LOCALE[locale].search
										: getSearchLink(locale, {
												[SearchFilterId.Maintainer]: mediaInfo?.maintainerSlug ?? '',
											}),
								},
							]
						: []),
					{
						label: mediaInfo?.name,
						to: `${ROUTES_BY_LOCALE[locale].search}/${mediaInfo?.maintainerSlug}/${mediaInfo?.schemaIdentifier}`,
					},
				]
			: [];

		return (
			<Breadcrumbs
				className={styles['p-object-detail-header__breadcrumbs']}
				items={[...staticBreadcrumbs, ...dynamicBreadcrumbs]}
				icon={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
				linkComponent={NextLinkWrapper}
			/>
		);
	};

	if (isNil(mediaInfo)) {
		return null;
	}

	return (
		<div
			className={clsx(styles['p-object-detail-header'], {
				[styles['p-object-detail-header--collapsed']]: isCollapsed,
			})}
		>
			{/* Both states render at once so the max-height transition has stable content to animate around */}
			<div className={styles['p-object-detail-header__collapsed-content']}>
				<h3 className={styles['p-object-detail__title']} title={mediaInfo?.name}>
					<HighlightSearchTerms toHighlight={mediaInfo?.name} />
				</h3>
				<Button
					className={styles['p-object-detail-header__details']}
					label={tText(
						'modules/ie-objects/components/object-detail-page-header/object-detail-page-header___toon-details'
					)}
					iconEnd={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
					variants={['text']}
					onClick={onShowDetails}
				/>
			</div>

			<div className={styles['p-object-detail-header__expanded-content']}>
				{showResearchWarning && renderResearchWarning()}
				{renderBreadcrumbs()}
				{showKeyUserPill && renderKeyUserPill()}
				<h3 className={styles['p-object-detail__title']}>
					<HighlightSearchTerms toHighlight={mediaInfo?.name} />
				</h3>

				{renderMetaDataActions()}

				{mediaInfo.description && (
					<MetaDataFieldWithHighlightingAndMaxLength
						title={tText('modules/visitor-space/utils/metadata/metadata___beschrijving')}
						data={mediaInfo.description}
						className={clsx(
							styles['p-object-detail-header__description'],
							'u-line-height-1-4 u-font-size-14'
						)}
						onReadMoreClicked={setSelectedMetadataField}
						readMoreButtonClassName={styles['p-object-detail-header__read-more']}
					/>
				)}

				{!mediaInfo.description && !isNewspaper && (
					<div className={styles['p-object-detail-header__description-fallback']}>
						<div className={styles['p-object-detail-header__description-fallback__text']}>
							{tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___geen-beschrijving'
							)}
						</div>
						<Icon
							name={IconNamesLight.MissingText}
							className={styles['p-object-detail-header__description-fallback__icon']}
							aria-hidden
						/>
					</div>
				)}

				{showAiDescription && (
					<>
						<hr className={styles['p-object-detail-header__divider']} />
						<ObjectDetailPageMetadataAiDescription
							name={mediaInfo.nameAi}
							synopsis={mediaInfo.synopsisAi}
							onReadMoreClicked={setSelectedMetadataField}
							readMoreButtonClassName={styles['p-object-detail-header__read-more']}
						/>
					</>
				)}
			</div>

			{/* Read more metadata field blade (main description / AI synopsis) */}
			<Blade
				isOpen={!!selectedMetadataField}
				onClose={() => setSelectedMetadataField(null)}
				title={selectedMetadataField?.title ?? ''}
				stickyFooter={false}
				footerButtons={[
					{
						label: tText(
							'modules/ie-objects/components/object-detail-page-header/object-detail-page-header___sluit'
						),
						mobileLabel: tText(
							'modules/ie-objects/components/object-detail-page-header/object-detail-page-header___sluit-mobiel'
						),
						type: 'secondary',
						onClick: () => setSelectedMetadataField(null),
					},
				]}
				id="object-detail-page__header-field-detail-blade"
				ariaLabel={tText(
					'modules/ie-objects/components/object-detail-page-header/object-detail-page-header___lees-de-volledige-waarde-van-het-metadata-veld-selected-metadata-field-name-blade-aria-label',
					{ selectedMetadataFieldName: selectedMetadataField?.title }
				)}
			>
				<HighlightedMetadata
					title={selectedMetadataField?.title}
					data={selectedMetadataField?.data}
				/>
			</Blade>

			<CopyrightConfirmationModal
				isOpen={copyrightModalOpen}
				onClose={() => setCopyrightModalOpen((prevState) => !prevState)}
				onConfirm={() => {
					onConfirmCopyright();
					setCopyrightModalOpen((prevState) => !prevState);
				}}
			/>
		</div>
	);
};
