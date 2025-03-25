import {
	Alert,
	type Breadcrumb,
	Breadcrumbs,
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	MenuContent,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { compact, indexOf, isEmpty, isNil, isString, noop, sortBy } from 'lodash-es';
import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import React, { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

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
import type { MetadataItem } from '@ie-objects/components/Metadata';
import Metadata from '@ie-objects/components/Metadata/Metadata';
import { NamesList } from '@ie-objects/components/NamesList/NamesList';
import type { ObjectDetailPageMetadataProps } from '@ie-objects/components/ObjectDetailPageMetadata/ObjectDetailPageMetadata.types';
import { SearchLinkTag } from '@ie-objects/components/SearchLinkTag/SearchLinkTag';
import { useIsPublicNewspaper } from '@ie-objects/hooks/get-is-public-newspaper';
import { useGetIeObjectPreviousNextIds } from '@ie-objects/hooks/use-get-ie-object-previous-next-ids';
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
	renderAbrahamLink,
	renderDate,
	renderIsPartOfValue,
} from '@ie-objects/ie-objects.consts';
import {
	type IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	IsPartOfKey,
	MediaActions,
	MetadataExportFormats,
	type MetadataSortMap,
} from '@ie-objects/ie-objects.types';
import {
	IE_OBJECTS_SERVICE_BASE_URL,
	IE_OBJECTS_SERVICE_EXPORT,
	NEWSPAPERS_SERVICE_BASE_URL,
} from '@ie-objects/services/ie-objects/ie-objects.service.const';
import { isInAFolder } from '@ie-objects/utils/folders';
import { getExternalMaterialRequestUrlIfAvailable } from '@ie-objects/utils/get-external-form-url';
import { getIeObjectRightsOwnerAsText } from '@ie-objects/utils/get-ie-object-rights-owner-as-text';
import { getIeObjectRightsStatusInfo } from '@ie-objects/utils/get-ie-object-rights-status';
import {
	mapArrayToMetadataData,
	mapObjectOrArrayToMetadata,
	mapObjectsToMetadata,
	renderKeywordsAsTags,
} from '@ie-objects/utils/map-metadata';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import { Blade } from '@shared/components/Blade/Blade';
import { CopyButton } from '@shared/components/CopyButton';
import HighlightSearchTerms from '@shared/components/HighlightedMetadata/HighlightSearchTerms';
import HighlightedMetadata from '@shared/components/HighlightedMetadata/HighlightedMetadata';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import MetaDataFieldWithHighlightingAndMaxLength from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { Pill } from '@shared/components/Pill';
import { KNOWN_STATIC_ROUTES, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission, useHasAnyPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { selectBreadcrumbs } from '@shared/store/ui';
import { Breakpoints } from '@shared/types';
import { IeObjectType } from '@shared/types/ie-objects';
import { Locale } from '@shared/utils/i18n';
import {
	LANGUAGES,
	type LanguageCode,
} from '@visitor-space/components/LanguageFilterForm/languages';
import {
	filterNameToAcronym,
	operatorToAcronym,
} from '@visitor-space/const/advanced-filter-array-param';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	FilterProperty,
	Operator,
	SearchFilterId,
} from '@visitor-space/types';

import Callout from '../../../shared/components/Callout/Callout';
import MetadataList from '../Metadata/MetadataList';

import styles from './ObjectDetailPageMetadata.module.scss';

const { publicRuntimeConfig } = getConfig();

export const ObjectDetailPageMetadata: FC<ObjectDetailPageMetadataProps> = ({
	mediaInfo,
	currentPage,
	currentPageIndex,
	hasAccessToVisitorSpaceOfObject,
	showVisitButton,
	visitRequest,
	activeFile,
	simplifiedAltoInfo,
	onClickAction,
	openRequestAccessBlade,
	iiifZoomTo,
}) => {
	const router = useRouter();
	const locale = useLocale();

	/**
	 * Content
	 */

	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const isNewspaper = mediaInfo?.dctermsFormat === IeObjectType.Newspaper;
	const isPublicNewspaper: boolean = useIsPublicNewspaper(mediaInfo);
	const [selectedMetadataField, setSelectedMetadataField] = useState<MetadataItem | null>(null);
	const breadcrumbs = useSelector(selectBreadcrumbs);
	const { data: ieObjectPreviousNextIds } = useGetIeObjectPreviousNextIds(
		mediaInfo?.collectionId,
		mediaInfo?.iri,
		{
			enabled:
				mediaInfo?.dctermsFormat === IeObjectType.Newspaper &&
				!!mediaInfo?.collectionId &&
				!!mediaInfo?.schemaIdentifier,
		}
	);

	/**
	 * User
	 */

	const user: User | null = useSelector(selectUser);
	const isKeyUser = useIsKeyUser();
	const isAnonymous = useHasAnyGroup(GroupName.ANONYMOUS);
	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);
	const isCPAdmin = useHasAnyGroup(GroupName.CP_ADMIN);

	/**
	 * Permissions
	 */

	// spaces
	const canViewAllSpaces = useHasAllPermission(Permission.READ_ALL_SPACES);
	const { data: accessibleVisitorSpaces } = useGetAccessibleVisitorSpaces({
		canViewAllSpaces,
	});

	const canRequestMaterial: boolean | null = useHasAllPermission(
		Permission.CREATE_MATERIAL_REQUESTS
	);
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const canRequestAccess =
		isNil(
			accessibleVisitorSpaces?.find((space) => space.maintainerId === mediaInfo?.maintainerId)
		) &&
		mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		isNil(mediaInfo.thumbnailUrl);
	const showKeyUserPill = mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.SECTOR);
	const canDownloadMetadata: boolean = useHasAnyPermission(Permission.EXPORT_OBJECT) || !user;

	// You need the permission or not to be logged in to download the newspaper
	// https://meemoo.atlassian.net/browse/ARC-2617
	const canDownloadNewspaper: boolean =
		(useHasAnyPermission(Permission.DOWNLOAD_OBJECT) || !user) && isPublicNewspaper;

	const windowSize = useWindowSizeContext();
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const { data: folders } = useGetFolders();

	/**
	 * State
	 */

	const [metadataExportDropdownOpen, setMetadataExportDropdownOpen] = useState(false);
	const [onConfirmCopyright, setOnConfirmCopyright] = useState<() => void>(noop);
	const [copyrightModalOpen, setCopyrightModalOpen] = useState(false);

	/**
	 * UseEffects
	 */

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

	const handleOnDownloadEvent = useCallback(() => {
		const path = window.location.href;
		const eventData = {
			type: mediaInfo?.dctermsFormat,
			fragment_id: mediaInfo?.schemaIdentifier,
			pid: mediaInfo?.schemaIdentifier,
			user_group_name: user?.groupName,
			or_id: mediaInfo?.maintainerId,
		};
		EventsService.triggerEvent(LogEventType.DOWNLOAD, path, eventData).then(noop);
	}, [
		mediaInfo?.dctermsFormat,
		mediaInfo?.maintainerId,
		mediaInfo?.schemaIdentifier,
		user?.groupName,
	]);

	const onExportClick = useCallback(
		(format: MetadataExportFormats) => {
			if (!mediaInfo) {
				console.error('No media info available');
				return;
			}
			switch (format) {
				case MetadataExportFormats.fullNewspaperZip:
					setCopyrightModalOpen(true);
					setOnConfirmCopyright(() => () => {
						window.open(
							`${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${encodeURIComponent(mediaInfo?.schemaIdentifier)}/${IE_OBJECTS_SERVICE_EXPORT}/zip`
						);
						handleOnDownloadEvent();
					});
					break;

				case MetadataExportFormats.onePageNewspaperZip:
					setCopyrightModalOpen(true);
					setOnConfirmCopyright(() => () => {
						window.open(
							`${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${encodeURIComponent(mediaInfo.schemaIdentifier)}/${IE_OBJECTS_SERVICE_EXPORT}/zip?page=${currentPageIndex}`
						);
						handleOnDownloadEvent();
					});
					break;
				default:
					window.open(
						`${publicRuntimeConfig.PROXY_URL}/${IE_OBJECTS_SERVICE_BASE_URL}/${encodeURIComponent(mediaInfo.schemaIdentifier)}/${IE_OBJECTS_SERVICE_EXPORT}/${format}`
					);
			}
			setMetadataExportDropdownOpen(false);
		},
		[currentPageIndex, handleOnDownloadEvent, mediaInfo]
	);

	const getActionButtonSortMapByUserType = useCallback((): MetadataSortMap[] => {
		if (isNil(user)) {
			return ANONYMOUS_ACTION_SORT_MAP(canDownloadMetadata || canDownloadNewspaper);
		}

		if (isKeyUser) {
			return KEY_USER_ACTION_SORT_MAP(canDownloadMetadata || canDownloadNewspaper);
		}

		if (isKiosk) {
			return KIOSK_ACTION_SORT_MAP();
		}

		if (isMeemooAdmin) {
			return MEEMOO_ADMIN_ACTION_SORT_MAP(canDownloadMetadata || canDownloadNewspaper);
		}

		if (isCPAdmin) {
			return CP_ADMIN_ACTION_SORT_MAP(canDownloadMetadata || canDownloadNewspaper);
		}

		return VISITOR_ACTION_SORT_MAP(canDownloadMetadata || canDownloadNewspaper);
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
					>
						<DropdownButton>
							{isPrimary ? (
								<Button
									variants={[isPrimary ? 'teal' : 'silver']}
									className={styles['p-object-detail__export']}
									iconStart={icon}
									iconEnd={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
									aria-label={buttonLabelDesktop}
									title={buttonLabelDesktop}
								>
									<span className="u-text-ellipsis u-display-none u-display-block-md">
										{buttonLabelDesktop}
									</span>
									<span className="u-text-ellipsis u-display-block u-display-none-md">
										{buttonLabelMobile}
									</span>
								</Button>
							) : (
								<Button
									icon={icon}
									variants={['silver']}
									aria-label={buttonLabelDesktop}
									title={buttonLabelDesktop}
								/>
							)}
						</DropdownButton>
						<DropdownContent>
							<MenuContent
								rootClassName="c-dropdown-menu"
								className={styles['p-object-detail__export-dropdown']}
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
		]
	);

	const mediaActions: DynamicActionMenuProps = useMemo(() => {
		const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
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
		windowSize.width,
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

	const renderMaintainerMetaTitle = ({
		maintainerName,
		maintainerLogo,
		maintainerId,
	}: IeObject): ReactNode => {
		const maintainerSearchLink = stringifyUrl({
			url: ROUTES_BY_LOCALE[locale].search,
			query: {
				[SearchFilterId.Maintainers]: [
					`${maintainerId}${FILTER_LABEL_VALUE_DELIMITER}${maintainerName}`,
				],
			},
		});
		return (
			<div className={styles['p-object-detail__metadata-maintainer-title']}>
				<div>
					<p className={styles['p-object-detail__metadata-label']}>
						{tText('modules/ie-objects/const/index___aanbieder')}
					</p>
					{!isKiosk && <SearchLinkTag label={maintainerName} link={maintainerSearchLink} />}
				</div>

				{!isKiosk && maintainerLogo && (
					<div className={styles['p-object-detail__sidebar__content-logo']}>
						{/* TODO remove this hack once we fully switched to the new graph.organisations table */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src={maintainerLogo} alt={`Logo ${maintainerName}`} />
					</div>
				)}
			</div>
		);
	};

	const renderMetaDataActions = (): ReactNode => (
		<div className="u-pb-24 p-object-detail__actions">
			<div className="p-object-detail__primary-actions">
				<DynamicActionMenu {...mediaActions} onClickAction={onClickAction} />
			</div>
		</div>
	);

	const renderVisitButton = (): ReactNode => (
		<Button
			label={tText('modules/ie-objects/components/metadata/metadata___plan-een-bezoek')}
			variants={['dark', 'sm']}
			className={styles['p-object-detail__visit-button']}
			onClick={openRequestAccessBlade}
		/>
	);

	const renderMaintainerMetaData = ({
		maintainerDescription,
		maintainerSiteUrl,
	}: IeObject): ReactNode => {
		if (!isKiosk) {
			return (
				<div className={styles['p-object-detail__sidebar__content-maintainer-data']}>
					{maintainerDescription && locale === Locale.nl && (
						<p className={styles['p-object-detail__sidebar__content-description']}>
							{maintainerDescription}
						</p>
					)}
					{maintainerSiteUrl && (
						<p className={styles['p-object-detail__sidebar__content-link']}>
							<a href={maintainerSiteUrl} target="_blank" rel="noopener noreferrer">
								{maintainerSiteUrl}
							</a>
							<Icon className="u-ml-8" name={IconNamesLight.Extern} />
						</p>
					)}
					{showVisitButton && isMobile && renderVisitButton()}
				</div>
			);
		}
	};

	const renderKeyUserPill = (): ReactNode => (
		<div className="u-mt-24">
			<Pill
				isExpanded
				icon={IconNamesLight.Key}
				label={tText(
					'pages/bezoekersruimte/visitor-space-slug/object-id/index___voor-sleutelgebruikers'
				)}
				className="u-bg-mustard"
			/>
		</div>
	);

	const renderSimpleMetadataField = (
		title: string | ReactNode,
		data: string | ReactNode | null | undefined
	): ReactNode => {
		if (!data) {
			return null;
		}
		if (isString(data)) {
			return (
				<Metadata title={title} key={`metadata-${title}`}>
					<MetaDataFieldWithHighlightingAndMaxLength
						title={title}
						data={data}
						onReadMoreClicked={setSelectedMetadataField}
					/>
				</Metadata>
			);
		}
		return (
			<Metadata title={title} key={`metadata-${title}`}>
				{data}
			</Metadata>
		);
	};

	const renderResearchWarning = (): ReactNode => (
		<Callout
			className={clsx(styles['p-object-detail__callout'], 'u-pt-32 u-pb-24')}
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
						className="u-py-0 u-px-8 u-color-neutral u-font-size-14 u-height-auto"
						label={tHtml('pages/slug/index___meer-info')}
						variants={['text', 'underline']}
					/>
				</Link>
			}
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
										: `${ROUTES_BY_LOCALE[locale].search}?${SearchFilterId.Maintainer}=${mediaInfo?.maintainerSlug}`,
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
				className="u-mt-32"
				items={[...staticBreadcrumbs, ...dynamicBreadcrumbs]}
				icon={<Icon name={IconNamesLight.AngleRight} />}
				linkComponent={NextLinkWrapper}
			/>
		);
	};

	function renderSeriesTitle(mediaInfo: IeObject) {
		if (!mediaInfo.collectionName) {
			return null;
		}
		if (mediaInfo.dctermsFormat === IeObjectType.Newspaper) {
			// Use the series filter
			return (
				<SearchLinkTag
					label={mediaInfo.collectionName}
					link={`${ROUTES_BY_LOCALE[locale].search}?format=${IeObjectType.Newspaper}&${
						SearchFilterId.NewspaperSeriesName
					}=${encodeURIComponent(mediaInfo.collectionName)}`}
				/>
			);
		}
		// Use the generic text filter
		const searchLink = stringifyUrl({
			url: ROUTES_BY_LOCALE[locale].search,
			query: {
				[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: mediaInfo.collectionName,
			},
		});
		return <SearchLinkTag label={mediaInfo.collectionName} link={searchLink} />;
	}

	function renderPreviousAndNextButtons(): ReactNode | null {
		if (
			!mediaInfo ||
			(!ieObjectPreviousNextIds?.previousIeObjectId && !ieObjectPreviousNextIds?.nextIeObjectId)
		) {
			return null;
		}
		const previousButton = (
			<Button
				variants={['text']}
				iconStart={<Icon name={IconNamesLight.ArrowLeft} />}
				label={tText(
					'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___vorige'
				)}
				disabled={!ieObjectPreviousNextIds?.previousIeObjectId}
			/>
		);
		const nextButton = (
			<Button
				variants={['text']}
				iconEnd={<Icon name={IconNamesLight.ArrowRight} />}
				label={tText(
					'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___volgende'
				)}
				disabled={!ieObjectPreviousNextIds?.nextIeObjectId}
			/>
		);
		return (
			<div className={styles['p-object-detail__metadata-content__previous-next']}>
				{ieObjectPreviousNextIds?.previousIeObjectId ? (
					<Link href={`/pid/${ieObjectPreviousNextIds?.previousIeObjectId}`}>{previousButton}</Link>
				) : (
					previousButton
				)}

				<span>{mediaInfo?.datePublished || mediaInfo?.dateCreated || '-'}</span>

				{ieObjectPreviousNextIds?.nextIeObjectId ? (
					<Link href={`/pid/${ieObjectPreviousNextIds?.nextIeObjectId}`}>{nextButton}</Link>
				) : (
					nextButton
				)}
			</div>
		);
	}

	const renderMetaData = () => {
		if (isNil(mediaInfo)) {
			return;
		}

		const showAlert = !mediaInfo.description;
		const rightsStatusInfo = isNewspaper ? getIeObjectRightsStatusInfo(mediaInfo, locale) : null;
		let rightsAttributionText: string | null = null;
		if (
			isNewspaper &&
			mediaInfo?.licenses?.includes(IeObjectLicense.PUBLIEK_CONTENT) &&
			rightsStatusInfo
		) {
			rightsAttributionText = compact([
				getIeObjectRightsOwnerAsText(mediaInfo),
				mediaInfo.datePublished,
				mediaInfo.name,
				mediaInfo.maintainerName,
				rightsStatusInfo.label,
				publicRuntimeConfig.CLIENT_URL +
					ROUTES_BY_LOCALE[locale].permalink.replace(':pid', mediaInfo.schemaIdentifier),
			]).join(', ');
		}

		return (
			<div className={styles['p-object-detail__metadata-wrapper']}>
				<div className={styles['p-object-detail__metadata-content']}>
					{showResearchWarning && renderResearchWarning()}
					{renderBreadcrumbs()}
					{showKeyUserPill && renderKeyUserPill()}
					<h3
						className={clsx(
							'u-pb-32',
							styles['p-object-detail__title'],
							showKeyUserPill ? 'u-pt-8' : 'u-pt-24'
						)}
					>
						<HighlightSearchTerms toHighlight={mediaInfo?.name} />
					</h3>

					{renderMetaDataActions()}

					{!!rightsAttributionText && (
						<>
							<Alert
								content={tHtml(
									'modules/ie-objects/object-detail-page___deze-bronvermelding-is-automatisch-gegenereerd-en-kan-fouten-bevatten-a-href-bronvermelding-fouten-meer-info-a'
								)}
							/>
							<Metadata
								title={tHtml('modules/ie-objects/object-detail-page___bronvermelding')}
								key="metadata-source-attribution"
								renderRight={<CopyButton text={rightsAttributionText} variants={['white']} />}
								className="u-bt-0"
							>
								<span>{rightsAttributionText}</span>
							</Metadata>
						</>
					)}

					<MetaDataFieldWithHighlightingAndMaxLength
						title={tText('modules/visitor-space/utils/metadata/metadata___beschrijving')}
						data={mediaInfo.description}
						className="u-pb-24 u-line-height-1-4 u-font-size-14"
						onReadMoreClicked={setSelectedMetadataField}
					/>

					{showAlert && (
						<Alert
							className="c-Alert__margin-bottom"
							icon={<Icon name={IconNamesLight.Info} />}
							content={tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___geen-beschrijving'
							)}
							title=""
						/>
					)}
				</div>

				<MetadataList allowTwoColumns={false}>
					<Metadata
						title={tText(
							'modules/ie-objects/components/object-detail-page-metadata/object-detail-page-metadata___editie-newspaper-series-title',
							{
								newspaperSeriesTitle: mediaInfo.collectionName,
							}
						)}
						key={'collectionNamePreviousNext'}
					>
						{renderPreviousAndNextButtons()}
					</Metadata>
				</MetadataList>
				<MetadataList allowTwoColumns={true}>
					<Metadata title={renderMaintainerMetaTitle(mediaInfo)} key={'metadata-maintainer'}>
						{renderMaintainerMetaData(mediaInfo)}
					</Metadata>
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___media-type'),
						mediaInfo.dctermsFormat
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bestandstype'),
						activeFile?.mimeType
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___pid'),
						mediaInfo.schemaIdentifier
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___titel-van-de-reeks'),
						renderSeriesTitle(mediaInfo)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___publicatiedatum'),
						renderDate(mediaInfo.datePublished)
					)}
					{!!rightsStatusInfo && (
						<Metadata
							title={tHtml('modules/ie-objects/object-detail-page___rechten')}
							className={styles['p-object-detail__metadata-content__rights-status']}
							key="metadata-rights-status"
							renderRight={
								<a target="_blank" href={rightsStatusInfo.internalLink} rel="noreferrer">
									<Button variants={['white']} icon={<Icon name={IconNamesLight.Extern} />} />
								</a>
							}
						>
							<span className="u-flex u-flex-items-center u-gap-xs">
								<a
									href={rightsStatusInfo.externalLink}
									className="u-text-no-decoration"
									target="_blank"
									rel="noreferrer"
								>
									{rightsStatusInfo.icon}
								</a>
								<a href={rightsStatusInfo.externalLink} target="_blank" rel="noreferrer">
									{rightsStatusInfo?.label}
								</a>
							</span>
						</Metadata>
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___rechtenstatus'),
						mediaInfo?.copyrightNotice
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___abraham-id'),
						renderAbrahamLink(mediaInfo?.abrahamInfo)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___identifier-bij-aanbieder'),
						mediaInfo.meemooLocalId
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___editie-nummer'),
						mediaInfo.issueNumber
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___plaats-van-uitgave'),
						mediaInfo.locationCreated
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___fysieke-drager'),
						mapArrayToMetadataData(mediaInfo.dctermsMedium)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bestandsnaam'),
						activeFile?.name
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___uitgebreide-beschrijving'),
						mediaInfo?.abstract ? mediaInfo?.abstract : null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___locatie-van-de-inhoud'),
						mapArrayToMetadataData(mediaInfo.spatial)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___tijdsperiode-van-de-inhoud'),
						mapArrayToMetadataData(mediaInfo.temporal)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___categorie'),
						mediaInfo.genre
							? mediaInfo.genre.map((genre) => (
									<SearchLinkTag
										key={genre}
										label={genre}
										link={`${ROUTES_BY_LOCALE[locale].search}?advanced=${filterNameToAcronym(
											FilterProperty.GENRE
										)}${operatorToAcronym(Operator.EQUALS)}${genre}`}
									/>
								))
							: null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___programmabeschrijving'),
						mediaInfo.synopsis
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___publicatietype'),
						mediaInfo.bibframeEdition
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___transcriptie'),
						mediaInfo?.transcript
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___taal'),
						mapArrayToMetadataData(
							mediaInfo.inLanguage?.map(
								(languageCode) => LANGUAGES[locale][languageCode as LanguageCode] || languageCode
							)
						)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___alternatieve-titels'),
						mapArrayToMetadataData(mediaInfo.alternativeTitle)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___gerelateerde-titels'),
						mapArrayToMetadataData([
							...(mediaInfo?.preceededBy || []),
							...(mediaInfo?.succeededBy || []),
						])
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___periode-van-uitgave'),
						compact([mediaInfo.startDate, mediaInfo.endDate]).join(' - ')
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___uitgevers-van-krant'),
						mediaInfo?.newspaperPublisher
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___aantal-paginas'),
						isNil(mediaInfo?.numberOfPages) ? null : String(mediaInfo.numberOfPages)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___afmetingen-in-cm'),
						(mediaInfo?.width
							? tText('modules/ie-objects/ie-objects___breedte') + mediaInfo?.width
							: '') +
							(mediaInfo?.height
								? ` ${tText('modules/ie-objects/ie-objects___hoogte')}${mediaInfo?.height}`
								: '') || null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___digitaliseringsdatum'),
						mediaInfo.digitizationDate
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-software'),
						simplifiedAltoInfo?.description.softwareName
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-software-version'),
						simplifiedAltoInfo?.description.softwareVersion
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-software-maker'),
						simplifiedAltoInfo?.description.softwareCreator
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-software-maker'),
						simplifiedAltoInfo?.description.softwareCreator
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-gemaakt-op'),
						simplifiedAltoInfo?.description.processingDateTime
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___ocr-betrouwbaarheid'),
						simplifiedAltoInfo?.description.processingStepSettings
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___scanresolutie'),
						simplifiedAltoInfo?.description.width || simplifiedAltoInfo?.description.height
							? [
									simplifiedAltoInfo?.description.width,
									simplifiedAltoInfo?.description.height,
								].join(' x ')
							: null
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___teksttype'),
						mediaInfo.bibframeProductionMethod
					)}
					{mapObjectOrArrayToMetadata(
						mediaInfo.creator,
						tText('modules/ie-objects/ie-objects___maker')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{mapObjectOrArrayToMetadata(
						mediaInfo.publisher,
						tText('modules/ie-objects/ie-objects___uitgever')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___datum-toegevoegd-aan-platform'),
						renderDate(activeFile?.createdAt)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___permanente-url'),
						publicRuntimeConfig.CLIENT_URL +
							ROUTES_BY_LOCALE[locale].permalink.replace(':pid', mediaInfo.schemaIdentifier)
					)}
					{mapObjectsToMetadata(
						mediaInfo.premisIdentifier?.filter(
							(premisEntry) => !['abraham_id', 'abraham_uri'].includes(Object.keys(premisEntry)[0])
						),
						tText('modules/ie-objects/ie-objects___premis-identifier')
					).map((info) => renderSimpleMetadataField(info.title, info.data))}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___creatiedatum'),
						mediaInfo.dateCreated
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___datum-drager'),
						mediaInfo.carrierDate
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___bronvermelding'),
						mediaInfo?.creditText
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___paginanummer'),
						mediaInfo?.pageNumber
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/ie-objects___auteursrechthouder'),
						mediaInfo?.copyrightHolder
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___oorsprong'),
						mediaInfo.meemooOriginalCp
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___archief'),
						renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.archief)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___programma'),
						renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.programma)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___serie'),
						renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.serie)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___episode'),
						renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.episode)
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___bestanddeel'),
						renderIsPartOfValue(mediaInfo.isPartOf, IsPartOfKey.bestanddeel)
					)}
					{/* https://meemoo.atlassian.net/browse/ARC-2606 */}
					{/*{renderSimpleMetadataField(*/}
					{/*	tText('modules/ie-objects/const/index___serienummer'),*/}
					{/*	mediaInfo.collectionSeasonNumber,*/}
					{/*)}*/}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___seizoennummer'),
						mediaInfo.collectionSeasonNumber
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___objecttype'),
						mediaInfo.ebucoreObjectType
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___duurtijd'),
						mediaInfo.duration
					)}
					{renderSimpleMetadataField(
						tText('modules/ie-objects/const/index___cast'),
						mediaInfo.meemooDescriptionCast
					)}
				</MetadataList>

				<MetadataList allowTwoColumns={false}>
					{isNewspaper && !!currentPage?.mentions?.length && (
						<Metadata
							title={tText('modules/ie-objects/object-detail-page___namenlijst')}
							key="metadata-fallen-names-list"
							renderTitleRight={
								<div className="u-color-neutral u-font-size-14 u-font-weight-400">
									{tHtml(
										'modules/ie-objects/object-detail-page___a-href-namenlijst-gesneuvelden-wat-is-dit-a'
									)}
								</div>
							}
						>
							<NamesList mentions={currentPage?.mentions || []} onZoomToLocation={iiifZoomTo} />
						</Metadata>
					)}

					{!!mediaInfo.keywords?.length && (
						<Metadata
							title={tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___trefwoorden'
							)}
							key="metadata-keywords"
							className="u-pb-0"
						>
							{renderKeywordsAsTags(
								mediaInfo.keywords,
								visitRequest ? (router.query.slug as string) : '',
								locale,
								router
							)}
						</Metadata>
					)}
				</MetadataList>

				{/* Read more metadata field blade */}
				<Blade
					className={clsx(
						'u-pb-24 u-line-height-1-4 u-font-size-14',
						styles['p-object-detail__metadata-blade']
					)}
					isOpen={!!selectedMetadataField}
					onClose={() => setSelectedMetadataField(null)}
					renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
						<h2 {...props}>{selectedMetadataField?.title}</h2>
					)}
					id="object-detail-page__metadata-field-detail-blade"
				>
					<div className="u-px-32 u-pb-32">
						<HighlightedMetadata
							title={selectedMetadataField?.title}
							data={selectedMetadataField?.data}
						/>
					</div>
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

	return renderMetaData();
};

export default Metadata;
