import {
	Alert,
	Breadcrumb,
	Breadcrumbs,
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	FlowPlayer,
	FlowPlayerProps,
	MenuContent,
	TabProps,
	TagList,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { HTTPError } from 'ky';
import { capitalize, indexOf, intersection, isNil, kebabCase, lowerCase, sortBy } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import save from 'save-file';
import { StringParam, useQueryParams } from 'use-query-params';

import { GroupName, Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import { VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import {
	ActionItem,
	DynamicActionMenu,
	DynamicActionMenuProps,
	MediaObject,
	Metadata,
	MetadataItem,
	ObjectPlaceholder,
	RelatedObject,
	RelatedObjectsBlade,
} from '@ie-objects/components';
import { FragmentSlider } from '@ie-objects/components/FragmentSlider';
import {
	ANONYMOUS_ACTION_SORT_MAP,
	CP_ADMIN_ACTION_SORT_MAP,
	CustomMetaDataFields,
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	IE_OBJECT_QUERY_PARAM_CONFIG,
	IMAGE_FORMATS,
	KEY_USER_ACTION_SORT_MAP,
	KIOSK_ACTION_SORT_MAP,
	MEDIA_ACTIONS,
	MEEMOO_ADMIN_ACTION_SORT_MAP,
	METADATA_EXPORT_OPTIONS,
	METADATA_FIELDS,
	noLicensePlaceholder,
	OBJECT_DETAIL_TABS,
	objectPlaceholder,
	ticketErrorPlaceholder,
	VISITOR_ACTION_SORT_MAP,
} from '@ie-objects/const';
import { useGetIeObjectsExport } from '@ie-objects/hooks/get-ie-objects-export';
import { useGetIeObjectsInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { useGetIeObjectsRelated } from '@ie-objects/hooks/get-ie-objects-related';
import { useGetIeObjectsSimilar } from '@ie-objects/hooks/get-ie-objects-similar';
import { useGetIeObjectsTicketInfo } from '@ie-objects/hooks/get-ie-objects-ticket-url';
import { IeObjectsService } from '@ie-objects/services';
import {
	IeObject,
	IeObjectAccessThrough,
	IeObjectLicense,
	IeObjectRepresentation,
	MediaActions,
	MetadataExportFormats,
	MetadataSortMap,
	ObjectDetailTabs,
} from '@ie-objects/types';
import { isInAFolder, mapKeywordsToTagList, mapKeywordsToTags } from '@ie-objects/utils';
import { MaterialRequestObjectType } from '@material-requests/types';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import {
	ErrorNoAccessToObject,
	ErrorNotFound,
	Icon,
	IconNamesLight,
	Loading,
	Pill,
	ScrollableTabs,
	TabLabel,
} from '@shared/components';
import Callout from '@shared/components/Callout/Callout';
import { ErrorSpaceNoLongerActive } from '@shared/components/ErrorSpaceNoLongerActive';
import { MetaDataDescription } from '@shared/components/MetaDataDescription';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/ie-objects';
import { selectShowNavigationBorder, setShowAuthModal, setShowZendesk } from '@shared/store/ui';
import { Breakpoints, IeObjectTypes, VisitorSpaceMediaType } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import {
	asDate,
	formatMediumDate,
	formatMediumDateWithTime,
	formatSameDayTimeOrDate,
} from '@shared/utils';
import { ReportBlade } from '@visitor-space/components/reportBlade';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	VisitorSpaceFilterId,
	VisitorSpaceStatus,
} from '@visitor-space/types';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';

import {
	AddToFolderBlade,
	MaterialRequestBlade,
	VisitorSpaceNavigation,
} from '../../../../modules/visitor-space/components';

import { VisitorLayout } from 'modules/visitors';

const { publicRuntimeConfig } = getConfig();

type ObjectDetailPageProps = {
	title: string | null;
} & DefaultSeoInfo;

const ObjectDetailPage: NextPage<ObjectDetailPageProps> = ({ title, url }) => {
	/**
	 * Hooks
	 */
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	// User types
	const isKeyUser = useIsKeyUser();
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);
	const isAnonymous = useHasAnyGroup(GroupName.ANONYMOUS);
	const isVisitor = useHasAnyGroup(GroupName.VISITOR);
	const isCPAdmin = useHasAnyGroup(GroupName.CP_ADMIN);
	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	// Permissions
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const canDownloadMetadata: boolean | null = useHasAllPermission(Permission.EXPORT_OBJECT);
	const canRequestMaterial: boolean | null = useHasAllPermission(
		Permission.CREATE_MATERIAL_REQUESTS
	);

	const [query] = useQueryParams(IE_OBJECT_QUERY_PARAM_CONFIG);

	// Internal state
	const [activeTab, setActiveTab] = useState<string | number | null>(null);
	const [activeBlade, setActiveBlade] = useState<MediaActions | null>(null);
	const [mediaType, setMediaType] = useState<IeObjectTypes>(null);
	const [isMediaPaused, setIsMediaPaused] = useState(true);
	const [hasMediaPlayed, setHasMediaPlayed] = useState(false);
	const [currentRepresentation, setCurrentRepresentation] = useState<
		IeObjectRepresentation | undefined
	>(undefined);
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | undefined>(undefined);
	const [similar, setSimilar] = useState<MediaObject[]>([]);
	const [related, setRelated] = useState<MediaObject[]>([]);
	const [metadataExportDropdownOpen, setMetadataExportDropdownOpen] = useState(false);
	const [isRequestAccessBladeOpen, setIsRequestAccessBladeOpen] = useState(false);

	// Layout
	useStickyLayout();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();
	const showNavigationBorder = useSelector(selectShowNavigationBorder);
	const collections = useSelector(selectFolders);

	// Query params
	const [, setQuery] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});

	// Fetch object
	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetIeObjectsInfo(router.query.ie as string);

	const isNoAccessError = (mediaInfoError as HTTPError)?.response?.status === 403;

	// peak file
	const peakFileId =
		mediaInfo?.representations?.find(
			(representation) => representation.dctermsFormat === 'peak'
		)?.files?.[0]?.schemaIdentifier || null;

	// media info
	const { data: peakJson } = useGetPeakFile(peakFileId);
	const representationsToDisplay = (mediaInfo?.representations || [])?.filter((object) => {
		if (object.dctermsFormat === 'peak') {
			// Ignore peak file containing the audio wave form in json format
			return false;
		}
		if (object?.files?.[0]?.schemaIdentifier?.endsWith('/audio_mp4')) {
			// Ignore video files containing the ugly speaker image and the audio encoded in mp4 format
			return false;
		}
		// Actual video files and mp3 files and images
		return true;
	});

	// playable url
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketInfo(
		currentRepresentation?.files[0]?.schemaIdentifier ?? null,
		() => setFlowPlayerKey(currentRepresentation?.files[0]?.schemaIdentifier ?? undefined) // Force flowplayer rerender after successful fetch
	);

	// ook interessant
	const { data: similarData } = useGetIeObjectsSimilar(
		router.query.ie as string,
		isKiosk ? mediaInfo?.maintainerId ?? '' : '',
		!!mediaInfo
	);

	// gerelateerd
	const { data: relatedData } = useGetIeObjectsRelated(
		router.query.ie as string,
		isKiosk ? mediaInfo?.maintainerId ?? '' : '',
		mediaInfo?.meemooIdentifier ?? '',
		!!mediaInfo
	);

	// export
	const { mutateAsync: getMediaExport } = useGetIeObjectsExport();

	// visit info
	const {
		data: visitRequest,
		error: visitRequestError,
		isLoading: visitRequestIsLoading,
	} = useGetActiveVisitForUserAndSpace(router.query.slug as string, user);

	// get visitor space info, used to display contact information
	const {
		data: visitorSpace,
		error: visitorSpaceError,
		isLoading: visitorSpaceIsLoading,
	} = useGetVisitorSpace(router.query.slug as string, false);

	// spaces
	const canViewAllSpaces = useHasAllPermission(Permission.READ_ALL_SPACES);
	const { data: accessibleVisitorSpaces } = useGetAccessibleVisitorSpaces({
		canViewAllSpaces,
	});

	/**
	 * Computed
	 */
	const isNotKiosk = (isMeemooAdmin || isVisitor || isAnonymous || isCPAdmin) && !isKiosk;
	const hasMedia = mediaInfo?.representations?.length || 0 > 0;
	const isErrorNotFound =
		(visitRequestError as HTTPError)?.response?.status === 404 ||
		(mediaInfoError as HTTPError)?.response?.status === 404;
	const isErrorSpaceNotActive = (visitorSpaceError as HTTPError)?.response?.status === 410;
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider = representationsToDisplay.length > 1;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const hasAccessToVisitorSpaceOfObject = !!intersection(mediaInfo?.accessThrough, [
		IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
		IeObjectAccessThrough.VISITOR_SPACE_FULL,
	]).length;
	const canRequestAccess =
		isNil(
			accessibleVisitorSpaces?.find((space) => space.maintainerId === mediaInfo?.maintainerId)
		) &&
		mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		isNil(mediaInfo.thumbnailUrl);
	const showKeyUserPill = mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.SECTOR);
	const showVisitButton =
		visitorSpace?.status === VisitorSpaceStatus.Active && canRequestAccess && !isKiosk;

	/**
	 * Effects
	 */

	useEffect(() => {
		// Close dropdown while resizing
		setMetadataExportDropdownOpen(false);
	}, [windowSize]);

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	useEffect(() => {
		if (mediaInfo) {
			EventsService.triggerEvent(LogEventType.ITEM_VIEW, window.location.href, {
				schema_identifier: mediaInfo.schemaIdentifier,
				meemoo_identifier: mediaInfo.meemooIdentifier,
			});
		}
	}, [mediaInfo]);

	useEffect(() => {
		// Pause media if metadata tab is shown on mobile
		if (isMobile && activeTab === ObjectDetailTabs.Metadata) {
			setIsMediaPaused(true);
		}
	}, [activeTab, isMobile]);

	useEffect(() => {
		setMediaType(mediaInfo?.dctermsFormat as IeObjectTypes);

		// Filter out peak files if type === video
		if (mediaInfo?.dctermsFormat === VisitorSpaceMediaType.Video) {
			mediaInfo.representations = mediaInfo?.representations?.filter(
				(object) => object.dctermsFormat !== 'peak'
			);
		}

		setCurrentRepresentation(representationsToDisplay[0]);
		// Set default view
		if (isMobile) {
			// Default to metadata tab on mobile
			setActiveTab(ObjectDetailTabs.Metadata);
		} else {
			// Check media content and license for default tab on desktop
			setActiveTab(
				mediaInfo?.dctermsFormat && hasMedia
					? ObjectDetailTabs.Media
					: ObjectDetailTabs.Metadata
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mediaInfo]);

	useEffect(() => {
		similarData && setSimilar(mapSimilarData(similarData?.items));
	}, [similarData]);

	useEffect(() => {
		relatedData && setRelated(mapRelatedData(relatedData.items));
	}, [relatedData]);

	/**
	 * Mapping
	 */
	const mapSimilarData = (data: Partial<IeObject>[]): MediaObject[] => {
		return data.map((ieObject) => {
			return {
				type: (ieObject?.dctermsFormat || null) as IeObjectTypes,
				title: ieObject?.name || '',
				subtitle: `${ieObject?.maintainerName ?? ''} ${
					ieObject?.datePublished
						? `(${formatMediumDate(asDate(ieObject?.datePublished))})`
						: ''
				}`,
				description: ieObject?.description || '',
				thumbnail: ieObject?.thumbnailUrl,
				id: ieObject?.schemaIdentifier || '',
				maintainer_id: ieObject?.maintainerId || '',
			};
		});
	};

	const mapRelatedData = (data: IeObject[]): MediaObject[] => {
		return data.map((item) => {
			return {
				type: item.dctermsFormat as IeObjectTypes,
				title: item.name,
				subtitle: `${item.maintainerName ?? ''} ${
					item.datePublished ? `(${formatMediumDate(asDate(item.datePublished))})` : ''
				}`,
				description: item.description,
				id: item.schemaIdentifier,
				maintainer_id: item.maintainerId,
				thumbnail: item.thumbnailUrl,
			};
		});
	};

	/**
	 * Callbacks
	 */
	const onTabClick = (id: string | number) => {
		setActiveTab(id);
	};

	const onClickToggle = () => {
		setActiveTab(expandMetadata ? ObjectDetailTabs.Media : ObjectDetailTabs.Metadata);
	};

	const onCloseBlade = () => {
		setActiveBlade(null);
	};

	const onClickAction = (id: MediaActions) => {
		switch (id) {
			case MediaActions.Bookmark:
				if (canManageFolders) {
					setActiveBlade(MediaActions.Bookmark);
				}

				if (isAnonymous) {
					dispatch(setShowAuthModal(true));
				}
				break;
			case MediaActions.Report:
				setActiveBlade(MediaActions.Report);
				break;
			case MediaActions.RequestAccess:
				setActiveBlade(MediaActions.RequestAccess);
				break;
			case MediaActions.RequestMaterial:
				onRequestMaterialClick();
				break;
		}
	};

	const onRequestMaterialClick = () => {
		if (isAnonymous) {
			dispatch(setShowAuthModal(true));
			return;
		}

		if (mediaInfo?.maintainerFormUrl && user) {
			// open external form
			const resolvedFormUrl = mediaInfo.maintainerFormUrl
				.replaceAll('{first_name}', encodeURIComponent(user.firstName))
				.replaceAll('{last_name}', encodeURIComponent(user.lastName))
				.replaceAll('{email}', encodeURIComponent(user.email))
				.replaceAll('{local_cp_id}', encodeURIComponent(mediaInfo?.meemooLocalId || ''))
				.replaceAll('{pid}', encodeURIComponent(mediaInfo?.meemooIdentifier || ''))
				.replaceAll('{title}', encodeURIComponent(mediaInfo?.name || ''))
				.replaceAll('{title_serie}', encodeURIComponent(mediaInfo?.series?.[0] || ''));
			window.open(resolvedFormUrl, '_blank');
		} else {
			setActiveBlade(MediaActions.RequestMaterial);
		}
	};

	const handleOnPlay = () => {
		setIsMediaPaused(false);
		if (!hasMediaPlayed) {
			setHasMediaPlayed(true);
			EventsService.triggerEvent(LogEventType.ITEM_PLAY, window.location.href, {
				schema_identifier: mediaInfo?.schemaIdentifier,
				meemoo_identifier: mediaInfo?.meemooIdentifier,
			});
		}
	};

	const handleOnPause = () => {
		setIsMediaPaused(true);
	};

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
			if (!user) {
				toastService.notify({
					title: tHtml('pages/slug/ie/index___je-bent-niet-ingelogd'),
					description: tHtml(
						'pages/slug/ie/index___je-bent-niet-ingelogd-log-opnieuw-in-en-probeer-opnieuw'
					),
				});
				return;
			}

			if (!mediaInfo?.maintainerSlug) {
				toastService.notify({
					title: tHtml('pages/slug/ie/index___bezoekersruimte-bestaat-niet'),
					description: tHtml(
						'pages/slug/ie/index___de-bezoekersruimte-waarvoor-je-een-aanvraag-wil-indienen-bestaat-niet'
					),
				});
				return;
			}

			const createdVisitRequest = await createVisitRequest({
				acceptedTos: values.acceptTerms,
				reason: values.requestReason,
				visitorSpaceSlug: mediaInfo?.maintainerSlug as string,
				timeframe: values.visitTime,
			});
			onCloseBlade();
			await router.push(
				ROUTES.visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
			);
		} catch (err) {
			console.error({
				message: 'Failed to create visit request',
				error: err,
				info: values,
			});
			toastService.notify({
				title: tHtml('pages/slug/ie/index___error'),
				description: tHtml(
					'pages/slug/ie/index___er-ging-iets-mis-bij-het-versturen-van-je-aanvraag-probeer-het-later-opnieuw-of-contacteer-de-support'
				),
			});
		}
	};

	const getSortMapByUserType = useCallback((): MetadataSortMap[] => {
		if (isNil(user)) {
			return ANONYMOUS_ACTION_SORT_MAP();
		}

		if (isKeyUser) {
			return KEY_USER_ACTION_SORT_MAP(hasAccessToVisitorSpaceOfObject);
		}

		if (isKiosk) {
			return KIOSK_ACTION_SORT_MAP();
		}

		if (isMeemooAdmin) {
			return MEEMOO_ADMIN_ACTION_SORT_MAP(hasAccessToVisitorSpaceOfObject);
		}

		if (isCPAdmin) {
			return CP_ADMIN_ACTION_SORT_MAP(hasAccessToVisitorSpaceOfObject);
		}

		return VISITOR_ACTION_SORT_MAP(hasAccessToVisitorSpaceOfObject);
	}, [hasAccessToVisitorSpaceOfObject, isKeyUser, isMeemooAdmin, isKiosk, user, isCPAdmin]);

	const onExportClick = useCallback(
		async (format: MetadataExportFormats) => {
			const metadataBlob = await getMediaExport({
				id: router.query.ie as string,
				format,
			});

			if (metadataBlob) {
				save(
					metadataBlob,
					`${kebabCase(mediaInfo?.name) || 'metadata'}.${MetadataExportFormats[format]}`
				);
			} else {
				toastService.notify({
					title: tHtml('pages/slug/ie/index___error') || 'error',
					description: tHtml(
						'pages/slug/ie/index___het-ophalen-van-de-metadata-is-mislukt'
					),
				});
			}

			setMetadataExportDropdownOpen(false);
		},
		[getMediaExport, mediaInfo?.name, router.query.ie, tHtml]
	);

	const renderExportDropdown = useCallback(
		(isPrimary: boolean) => {
			const icon = <Icon name={IconNamesLight.Export} aria-hidden />;
			const label = tText(
				'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata'
			);

			return (
				<div className="p-object-detail__export">
					<Dropdown
						isOpen={metadataExportDropdownOpen}
						onOpen={() => setMetadataExportDropdownOpen(true)}
						onClose={() => setMetadataExportDropdownOpen(false)}
					>
						<DropdownButton>
							{isPrimary ? (
								<Button
									variants={[isPrimary ? 'teal' : 'silver']}
									className="p-object-detail__export"
									iconStart={icon}
									iconEnd={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
									aria-label={label}
									title={label}
								>
									<span className="u-text-ellipsis u-display-none u-display-block:md">
										{label}
									</span>
									<span className="u-text-ellipsis u-display-none:md">
										{tHtml(
											'pages/bezoekersruimte/visitor-space-slug/object-id/index___metadata'
										)}
									</span>
								</Button>
							) : (
								<Button
									icon={icon}
									variants={['silver']}
									aria-label={label}
									title={label}
								/>
							)}
						</DropdownButton>
						<DropdownContent>
							<MenuContent
								rootClassName="c-dropdown-menu"
								className="p-object-detail__export-dropdown"
								menuItems={METADATA_EXPORT_OPTIONS()}
								onClick={(id) => onExportClick(id as MetadataExportFormats)}
							/>
						</DropdownContent>
					</Dropdown>
				</div>
			);
		},
		[metadataExportDropdownOpen, onExportClick, tHtml, tText]
	);

	const onOpenRequestAccess = () => {
		setQuery({ [VISITOR_SPACE_SLUG_QUERY_KEY]: mediaInfo?.maintainerSlug });
		setIsRequestAccessBladeOpen(true);
	};

	const highlighted = (toHighlight: string) => (
		<Highlighter
			searchWords={(query.searchTerms as string[]) ?? []}
			autoEscape={true}
			textToHighlight={toHighlight}
		/>
	);

	/**
	 * Content
	 */
	const tabs: TabProps[] = useMemo(() => {
		const available = !isErrorPlayableUrl && !!playableUrl && !!currentRepresentation;
		return OBJECT_DETAIL_TABS(mediaType, available).map((tab) => ({
			...tab,
			label: <TabLabel label={tab.label} />,
			active: tab.id === activeTab,
		}));
	}, [activeTab, mediaType, isErrorPlayableUrl, playableUrl, currentRepresentation]);

	const accessEndDate = useMemo(() => {
		const dateDesktop = formatMediumDateWithTime(asDate(visitRequest?.endAt));
		const dateMobile = formatSameDayTimeOrDate(asDate(visitRequest?.endAt));

		if ((!dateDesktop && !dateMobile) || showLinkedSpaceAsHomepage) {
			return;
		}

		if (isMobile) {
			return tHtml('pages/slug/index___tot-access-end-date-mobile', {
				accessEndDateMobile: dateMobile,
			});
		}

		return tHtml(
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___toegang-tot-access-end-date',
			{
				accessEndDate: dateDesktop,
			}
		);
	}, [isMobile, showLinkedSpaceAsHomepage, tHtml, visitRequest?.endAt]);

	const mediaActions: DynamicActionMenuProps = useMemo(() => {
		const original = MEDIA_ACTIONS(
			canManageFolders || isAnonymous,
			isInAFolder(collections, mediaInfo?.schemaIdentifier),
			isNotKiosk,
			!!canRequestAccess,
			isAnonymous || canRequestMaterial,
			canDownloadMetadata
		);

		// Sort, filter and tweak actions according to the given sort map
		const sortMap = getSortMapByUserType();
		const actions: ActionItem[] = sortBy(original.actions, ({ id }: ActionItem) =>
			indexOf(
				sortMap.map((d) => d.id),
				id
			)
		)
			.map((action: ActionItem) => {
				const existsInSortMap = !isNil(sortMap.find((d) => d.id === action.id));
				const isPrimary = sortMap.find((d) => action.id === d.id)?.isPrimary ?? false;
				const showExport =
					action.id === MediaActions.Export &&
					canDownloadMetadata &&
					hasAccessToVisitorSpaceOfObject;

				return existsInSortMap
					? {
							...action,
							isPrimary,
							...(showExport && {
								customElement: renderExportDropdown(isPrimary),
							}),
					  }
					: null;
			})
			.filter(Boolean) as ActionItem[];

		return {
			...original,
			actions,
		};
	}, [
		canManageFolders,
		isAnonymous,
		collections,
		mediaInfo?.schemaIdentifier,
		isNotKiosk,
		canRequestAccess,
		canRequestMaterial,
		canDownloadMetadata,
		getSortMapByUserType,
		hasAccessToVisitorSpaceOfObject,
		renderExportDropdown,
	]);

	/**
	 * Render
	 */

	const renderMedia = (
		playableUrl: string | undefined,
		representation: IeObjectRepresentation | undefined
	): ReactNode => {
		if (isLoadingPlayableUrl) {
			return <Loading fullscreen owner="object detail page: render media" />;
		}

		if (!playableUrl) {
			if (showVisitButton) {
				return (
					<ObjectPlaceholder
						{...noLicensePlaceholder()}
						onOpenRequestAccess={onOpenRequestAccess}
					/>
				);
			}
			return <ObjectPlaceholder {...noLicensePlaceholder()} />;
		}

		if (isErrorPlayableUrl || !representation) {
			return <ObjectPlaceholder {...ticketErrorPlaceholder()} />;
		}

		const shared: Partial<FlowPlayerProps> = {
			className: clsx(
				'p-object-detail__flowplayer',
				showFragmentSlider && 'p-object-detail__flowplayer--with-slider'
			),
			poster: mediaInfo?.thumbnailUrl || undefined,
			title: representation.name,
			logo: mediaInfo?.maintainerLogo || undefined,
			pause: isMediaPaused,
			onPlay: handleOnPlay,
			onPause: handleOnPause,
			token: publicRuntimeConfig.FLOW_PLAYER_TOKEN,
			dataPlayerId: publicRuntimeConfig.FLOW_PLAYER_ID,
			plugins: ['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio', 'keyboard'],
		};

		// Flowplayer
		if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(representation.dctermsFormat)) {
			return <FlowPlayer key={flowPlayerKey} src={playableUrl} {...shared} />;
		}
		if (playableUrl && FLOWPLAYER_AUDIO_FORMATS.includes(representation.dctermsFormat)) {
			if (!peakFileId || !!peakJson) {
				return (
					<FlowPlayer
						key={flowPlayerKey}
						src={[
							{
								src: playableUrl,
								type: 'audio/mp3',
							},
						]}
						waveformData={peakJson?.data || undefined}
						{...shared}
					/>
				);
			} else {
				return <Loading fullscreen owner="object detail page: waiting for peak json" />;
			}
		}

		// Image
		if (IMAGE_FORMATS.includes(representation.dctermsFormat)) {
			return (
				<div className="p-object-detail__image">
					<Image
						src={representation.files[0]?.schemaIdentifier ?? null}
						alt={representation.name}
						layout="fill"
						objectFit="contain"
					/>
				</div>
			);
		}
	};

	// Metadata
	const renderCard = (item: MediaObject, isHidden: boolean) => (
		<li>
			<Link passHref href={`${ROUTES.search}/${router.query.slug}/${item.id}`}>
				<a
					tabIndex={isHidden ? -1 : 0}
					className={`p-object-detail__metadata-card-link u-text-no-decoration`}
					aria-label={item.title}
				>
					{<RelatedObject object={item} />}
				</a>
			</Link>
		</li>
	);

	const renderBreadcrumbs = (): ReactNode => {
		const staticBreadcrumbs: Breadcrumb[] = [
			{
				label: `${tHtml('pages/slug/ie/index___breadcrumbs___home')}`,
				to: ROUTES.home,
			},
			{
				label: `${tHtml('pages/slug/ie/index___breadcrumbs___search')}`,
				to: ROUTES.search,
			},
		];

		const dynamicBreadcrumbs: Breadcrumb[] = !isNil(mediaInfo)
			? [
					...(hasAccessToVisitorSpaceOfObject
						? [
								{
									label: mediaInfo?.maintainerName,
									to: `${ROUTES.search}?maintainer=${mediaInfo?.maintainerSlug}`,
								},
						  ]
						: []),
					{
						label: mediaInfo?.name,
						to: `${ROUTES.search}/${mediaInfo?.maintainerSlug}/${mediaInfo?.schemaIdentifier}`,
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

	const renderResearchWarning = (): ReactNode => (
		<Callout
			className="p-object-detail__callout u-pt-32 u-pb-24"
			icon={<Icon name={IconNamesLight.Info} aria-hidden />}
			text={tHtml(
				'pages/slug/ie/index___door-gebruik-te-maken-van-deze-applicatie-bevestigt-u-dat-u-het-beschikbare-materiaal-enkel-raadpleegt-voor-wetenschappelijk-of-prive-onderzoek'
			)}
			action={
				<Link passHref href="/kiosk-voorwaarden">
					<a aria-label={tText('pages/slug/index___meer-info')}>
						<Button
							className="u-py-0 u-px-8 u-color-neutral u-font-size-14 u-height-auto"
							label={tHtml('pages/slug/index___meer-info')}
							variants={['text', 'underline']}
						/>
					</a>
				</Link>
			}
		/>
	);

	const renderMetadataCards = (
		type: 'similar' | 'related',
		items: MediaObject[],
		isHidden = false
	): ReactNode => (
		<dd>
			{
				<ul
					className={`
					u-list-reset p-object-detail__metadata-list
					p-object-detail__metadata-list--${type}
					p-object-detail__metadata-list--${expandMetadata && !isMobile ? 'expanded' : 'collapsed'}
				`}
				>
					{items.map((item, index) => {
						return (
							<Fragment key={`${type}-object-${item.id}-${index}`}>
								{renderCard(item, isHidden)}
							</Fragment>
						);
					})}
				</ul>
			}
		</dd>
	);

	const renderMaintainerMetaTitle = ({
		maintainerName,
		maintainerLogo,
		maintainerId,
	}: IeObject): ReactNode => (
		<div className="p-object-detail__metadata-maintainer-title">
			<p className="p-object-detail__metadata-label">
				{tText('modules/ie-objects/const/index___aanbieder')}
			</p>
			{isNotKiosk && !hasAccessToVisitorSpaceOfObject && (
				<>
					<p className="p-object-detail__metadata-pill">
						<TagList
							className="u-pt-12"
							tags={mapKeywordsToTags([maintainerName])}
							onTagClicked={() => {
								router.push(
									stringifyUrl({
										url: `/${ROUTE_PARTS.search}`,
										query: {
											[VisitorSpaceFilterId.Maintainers]: [
												`${maintainerId}${FILTER_LABEL_VALUE_DELIMITER}${maintainerName}`,
											],
										},
									})
								);
							}}
							variants={['clickable', 'silver', 'medium']}
						/>
					</p>
					{maintainerLogo && (
						<div className="p-object-detail__metadata-logo">
							<Image
								src={maintainerLogo}
								alt={`Logo ${maintainerName}`}
								layout="fill"
								objectFit="contain"
							/>
						</div>
					)}
				</>
			)}
		</div>
	);

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
			className="p-object-detail__visit-button"
			onClick={onOpenRequestAccess}
		/>
	);

	const renderMaintainerMetaData = ({
		maintainerDescription,
		maintainerSiteUrl,
		maintainerName,
	}: IeObject): ReactNode =>
		isNotKiosk && !hasAccessToVisitorSpaceOfObject ? (
			<div className="p-object-detail__metadata-maintainer-data">
				{maintainerDescription && (
					<p className="p-object-detail__metadata-description">{maintainerDescription}</p>
				)}
				{maintainerSiteUrl && (
					<p className="p-object-detail__metadata-link">
						<a href={maintainerSiteUrl} target="_blank" rel="noopener noreferrer">
							{maintainerSiteUrl}
						</a>
						<Icon className="u-ml-8" name={IconNamesLight.Extern} />
					</p>
				)}
				{showVisitButton && isMobile && renderVisitButton()}
			</div>
		) : (
			<div className="p-object-detail__metadata-maintainer-data">
				{maintainerName}
				{showVisitButton && isMobile && renderVisitButton()}
			</div>
		);

	const getCustomTitleRenderFn = (
		field: CustomMetaDataFields,
		mediaInfo: IeObject
	): ReactNode => {
		switch (field) {
			case CustomMetaDataFields.Maintainer:
				return renderMaintainerMetaTitle(mediaInfo);

			default:
				return null;
		}
	};

	const getCustomDataRenderFn = (field: CustomMetaDataFields, mediaInfo: IeObject): ReactNode => {
		switch (field) {
			case CustomMetaDataFields.Maintainer:
				return renderMaintainerMetaData(mediaInfo);

			default:
				return null;
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

	const renderMetaData = () => {
		if (isNil(mediaInfo)) {
			return;
		}

		const showAlert = !mediaInfo.description;
		const metaDataFields = METADATA_FIELDS(mediaInfo)
			.filter(({ isDisabled }: MetadataItem): boolean => !isDisabled?.())
			.map(
				(field: MetadataItem): MetadataItem => ({
					...field,
					title: field.customTitle
						? getCustomTitleRenderFn(field.title as CustomMetaDataFields, mediaInfo)
						: field.title,
					data: field.customData
						? getCustomDataRenderFn(field.data as CustomMetaDataFields, mediaInfo)
						: field.data,
				})
			)
			.filter(({ data }: MetadataItem): boolean => !!data);

		return (
			<div>
				<div className="p-object-detail__metadata-content">
					{showResearchWarning ? renderResearchWarning() : renderBreadcrumbs()}
					{showKeyUserPill && renderKeyUserPill()}
					<h3
						className={clsx(
							'u-pb-32',
							'p-object-detail__title',
							showKeyUserPill ? 'u-pt-8' : 'u-pt-24'
						)}
					>
						{highlighted(mediaInfo?.name)}
					</h3>

					{renderMetaDataActions()}

					<MetaDataDescription description={mediaInfo.description || ''} />

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

				<Metadata
					className="p-object-detail__metadata-component"
					metadata={metaDataFields}
				/>

				{(!!similar.length || !!mediaInfo.keywords?.length) && (
					<Metadata
						className="p-object-detail__metadata-component"
						metadata={[
							{
								title: tHtml(
									'pages/bezoekersruimte/visitor-space-slug/object-id/index___trefwoorden'
								),
								data: mapKeywordsToTagList(mediaInfo.keywords),
							},
							{
								title: tHtml('pages/slug/ie/index___ook-interessant'),
								data: similar.length
									? renderMetadataCards('similar', similar)
									: null,
								className: 'u-pb-0',
							},
						].filter((field) => !!field.data)}
						disableContainerQuery
					/>
				)}
			</div>
		);
	};

	const renderRelatedObjectsBlade = () => {
		if (!related.length || (!expandMetadata && isMobile)) {
			return null;
		}
		return (
			<RelatedObjectsBlade
				className={clsx(
					'p-object-detail__related',
					'p-object-detail__metadata--collapsed',
					expandMetadata && 'p-object-detail__metadata--expanded'
				)}
				icon={
					<Icon
						className="u-font-size-24 u-mr-8 u-text-left"
						name={IconNamesLight.RelatedObjects}
						aria-hidden
					/>
				}
				title={
					related.length === 1
						? tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___1-gerelateerd-object'
						  )
						: tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___amount-gerelateerde-objecten',
								{
									amount: related.length,
								}
						  )
				}
				renderContent={(hidden) => renderMetadataCards('related', related, hidden)}
			/>
		);
	};

	const renderObjectMedia = () => {
		if (mediaType) {
			return (
				<>
					{renderMedia(playableUrl, currentRepresentation)}
					{showFragmentSlider && (
						<FragmentSlider
							thumbnail={mediaInfo?.thumbnailUrl}
							className="p-object-detail__slider"
							fragments={representationsToDisplay}
							onChangeFragment={(index) =>
								setCurrentRepresentation(representationsToDisplay[index])
							}
						/>
					)}
				</>
			);
		}
		return <ObjectPlaceholder {...objectPlaceholder()} />;
	};

	const renderNavigationBar = (): ReactNode => {
		if (!isNil(accessEndDate) || isKiosk) {
			return (
				<VisitorSpaceNavigation
					className="p-object-detail__nav"
					showBorder={showNavigationBorder}
					title={mediaInfo?.maintainerName ?? ''}
					accessEndDate={accessEndDate}
				/>
			);
		}

		// Only show the back button on the media tab (mobile)
		const showBackButton = (isMobile && activeTab === ObjectDetailTabs.Media) || !isMobile;

		return (
			showBackButton && (
				<Button
					className={clsx('p-object-detail__back')}
					icon={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
					onClick={() => window.history.back()}
					variants={['white', 'xs']}
				/>
			)
		);
	};

	const renderObjectDetail = () => (
		<>
			{renderNavigationBar()}
			<ScrollableTabs
				className="p-object-detail__tabs"
				variants={['dark']}
				tabs={tabs}
				onClick={onTabClick}
			/>
			{isNoAccessError && (
				<ErrorNoAccessToObject
					visitorSpaceName={visitorSpace?.name as string}
					visitorSpaceSlug={visitorSpace?.slug as string}
					description={tHtml(
						'pages/bezoekersruimte/visitor-space-slug/object-id/index___tot-het-materiaal-geen-toegang-dien-aanvraag-in'
					)}
				/>
			)}
			{mediaInfoIsError && !isNoAccessError && (
				<p className={'p-object-detail__error'}>
					{tHtml(
						'pages/bezoekersruimte/visitor-space-slug/object-id/index___er-ging-iets-mis-bij-het-ophalen-van-de-data'
					)}
				</p>
			)}
			<article
				className={clsx(
					'p-object-detail__wrapper',
					mediaInfoIsLoading && 'p-object-detail--hidden ',
					mediaInfoIsError && 'p-object-detail--hidden ',
					expandMetadata && 'p-object-detail__wrapper--expanded',
					activeTab === ObjectDetailTabs.Metadata && 'p-object-detail__wrapper--metadata',
					activeTab === ObjectDetailTabs.Media && 'p-object-detail__wrapper--video'
				)}
			>
				{mediaType && hasMedia && (
					<Button
						className={clsx(
							'p-object-detail__expand-button',
							expandMetadata && 'p-object-detail__expand-button--expanded'
						)}
						icon={
							<Icon
								name={
									expandMetadata
										? IconNamesLight.ExpandRight
										: IconNamesLight.ExpandLeft
								}
								aria-hidden
							/>
						}
						onClick={onClickToggle}
						variants="white"
					/>
				)}
				<div className="p-object-detail__video">{renderObjectMedia()}</div>
				<div
					className={clsx(
						'p-object-detail__metadata',
						'p-object-detail__metadata--collapsed',
						expandMetadata && 'p-object-detail__metadata--expanded',
						!mediaType && 'p-object-detail__metadata--no-media'
					)}
				>
					{renderMetaData()}
				</div>
				{renderRelatedObjectsBlade()}
			</article>
			{canManageFolders && (
				<AddToFolderBlade
					isOpen={activeBlade === MediaActions.Bookmark}
					selected={
						mediaInfo
							? {
									schemaIdentifier: mediaInfo.schemaIdentifier,
									title: mediaInfo.name,
							  }
							: undefined
					}
					onClose={onCloseBlade}
					onSubmit={async () => onCloseBlade()}
				/>
			)}
			{mediaInfo && visitorSpace && isNotKiosk && (
				<MaterialRequestBlade
					isOpen={activeBlade === MediaActions.RequestMaterial}
					onClose={onCloseBlade}
					objectName={mediaInfo?.name}
					objectId={mediaInfo?.schemaIdentifier}
					objectDctermsFormat={mediaInfo.dctermsFormat as MaterialRequestObjectType}
					maintainerName={mediaInfo?.maintainerName}
					maintainerLogo={visitorSpace?.logo}
					maintainerSlug={visitorSpace?.slug}
					meemooId={mediaInfo?.meemooIdentifier}
				/>
			)}
			<ReportBlade
				user={user}
				isOpen={activeBlade === MediaActions.Report}
				onClose={onCloseBlade}
			/>
			{showVisitButton && (
				<RequestAccessBlade
					isOpen={isRequestAccessBladeOpen}
					onClose={() => setIsRequestAccessBladeOpen(false)}
					onSubmit={onRequestAccessSubmit}
				/>
			)}
		</>
	);

	const renderPageContent = () => {
		if (mediaInfoIsLoading || visitRequestIsLoading || visitorSpaceIsLoading) {
			return <Loading fullscreen owner="object detail page: render page content" />;
		}
		if (isErrorSpaceNotActive) {
			return <ErrorSpaceNoLongerActive />;
		}
		if (isErrorNotFound) {
			return <ErrorNotFound />;
		}
		return <div className="p-object-detail">{renderObjectDetail()}</div>;
	};

	const description = capitalize(lowerCase((router.query.slug as string) || ''));
	return (
		<>
			<VisitorLayout>
				{renderOgTags(title, description, url)}
				{renderPageContent()}
			</VisitorLayout>
		</>
	);
};

export async function getServerSideProps(
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<ObjectDetailPageProps>> {
	let seoInfo: { name: string | null } | null = null;
	try {
		seoInfo = await IeObjectsService.getSeoById(context.query.ie as string);
	} catch (err) {
		console.error('Failed to fetch media info by id: ' + context.query.ie, err);
	}

	const defaultProps: GetServerSidePropsResult<DefaultSeoInfo> = await getDefaultServerSideProps(
		context
	);

	return {
		props: {
			...(defaultProps as { props: DefaultSeoInfo }).props,
			title: seoInfo?.name || null,
		},
	};
}

export default ObjectDetailPage;
