import {
	Alert,
	type Breadcrumb,
	Breadcrumbs,
	Button,
	Dropdown,
	DropdownButton,
	DropdownContent,
	FlowPlayer,
	type FlowPlayerProps,
	MenuContent,
	type TabProps,
	TagList,
} from '@meemoo/react-components';
import clsx from 'clsx';
import { type HTTPError } from 'ky';
import {
	capitalize,
	compact,
	indexOf,
	intersection,
	isEmpty,
	isNil,
	lowerCase,
	noop,
	sortBy,
} from 'lodash-es';
import getConfig from 'next/config';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import React, {
	type FC,
	Fragment,
	type MutableRefObject,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';

import { GroupName, Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import {
	RequestAccessBlade,
	type RequestAccessFormState,
} from '@home/components/RequestAccessBlade';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { CollapsableBlade } from '@ie-objects/components/CollapsableBlade';
import { CopyrightConfirmationModal } from '@ie-objects/components/CopyrightConfirmationModal';
import {
	type ActionItem,
	DynamicActionMenu,
	type DynamicActionMenuProps,
} from '@ie-objects/components/DynamicActionMenu';
import { FragmentSlider } from '@ie-objects/components/FragmentSlider';
import { Metadata, type MetadataItem } from '@ie-objects/components/Metadata';
import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import { ObjectPlaceholder } from '@ie-objects/components/ObjectPlaceholder';
import { type MediaObject, RelatedObject } from '@ie-objects/components/RelatedObject';
import { useGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { useGetIeObjectsRelated } from '@ie-objects/hooks/get-ie-objects-related';
import { useGetIeObjectsAlsoInteresting } from '@ie-objects/hooks/get-ie-objects-similar';
import { useGetIeObjectsTicketInfo } from '@ie-objects/hooks/get-ie-objects-ticket-url';
import {
	ANONYMOUS_ACTION_SORT_MAP,
	CP_ADMIN_ACTION_SORT_MAP,
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	IE_OBJECT_QUERY_PARAM_CONFIG,
	IMAGE_API_FORMATS,
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
	XML_FORMATS,
} from '@ie-objects/ie-objects.consts';
import {
	type AltoTextLine,
	type IeObject,
	IeObjectAccessThrough,
	type IeObjectFile,
	IeObjectLicense,
	MediaActions,
	MetadataExportFormats,
	type MetadataSortMap,
	ObjectDetailTabs,
} from '@ie-objects/ie-objects.types';
import {
	IE_OBJECTS_SERVICE_BASE_URL,
	IE_OBJECTS_SERVICE_EXPORT,
	NEWSPAPERS_SERVICE_BASE_URL,
} from '@ie-objects/services/ie-objects/ie-objects.service.const';
import { isInAFolder } from '@ie-objects/utils/folders';
import { mapKeywordsToTags, renderKeywordsAsTags } from '@ie-objects/utils/map-metadata';
import IiifViewer from '@iiif-viewer/IiifViewer';
import { type IiifViewerFunctions, type ImageInfo } from '@iiif-viewer/IiifViewer.types';
import altoTextLocations from '@iiif-viewer/alto2-simplified.json';
import { MaterialRequestsService } from '@material-requests/services';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import { Blade } from '@shared/components/Blade/Blade';
import Callout from '@shared/components/Callout/Callout';
import { ErrorNoAccessToObject } from '@shared/components/ErrorNoAccessToObject';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { ErrorSpaceNoLongerActive } from '@shared/components/ErrorSpaceNoLongerActive';
import HighlightSearchTerms from '@shared/components/HighlightedMetadata/HighlightSearchTerms';
import HighlightedMetadata from '@shared/components/HighlightedMetadata/HighlightedMetadata';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import MetaDataFieldWithHighlightingAndMaxLength from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { Pill } from '@shared/components/Pill';
import { SearchBar } from '@shared/components/SearchBar';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ScrollableTabs, TabLabel } from '@shared/components/Tabs';
import { KNOWN_STATIC_ROUTES, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission, useHasAnyPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/ie-objects';
import { selectBreadcrumbs, setShowAuthModal, setShowZendesk } from '@shared/store/ui';
import { Breakpoints } from '@shared/types';
import { IeObjectType } from '@shared/types/ie-objects';
import { type DefaultSeoInfo } from '@shared/types/seo';
import {
	asDate,
	formatMediumDate,
	formatMediumDateWithTime,
	formatSameDayTimeOrDate,
} from '@shared/utils/dates';
import { useGetActiveVisitForUserAndSpace } from '@visit-requests/hooks/get-active-visit-for-user-and-space';
import { VisitorLayout } from '@visitor-layout/index';
import { AddToFolderBlade } from '@visitor-space/components/AddToFolderBlade';
import { MaterialRequestBlade } from '@visitor-space/components/MaterialRequestBlade/MaterialRequestBlade';
import { NoServerSideRendering } from '@visitor-space/components/NoServerSideRendering/NoServerSideRendering';
import { VisitorSpaceNavigation } from '@visitor-space/components/VisitorSpaceNavigation/VisitorSpaceNavigation';
import { ReportBlade } from '@visitor-space/components/reportBlade';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import {
	FILTER_LABEL_VALUE_DELIMITER,
	SearchFilterId,
	VisitorSpaceStatus,
} from '@visitor-space/types';

import styles from './ObjectDetailPage.module.scss';

const { publicRuntimeConfig } = getConfig();

export const ObjectDetailPage: FC<DefaultSeoInfo> = ({ title, description, image, url }) => {
	/**
	 * Hooks
	 */
	const { tHtml, tText } = useTranslation();
	const router = useRouter();
	const locale = useLocale();
	const dispatch = useDispatch();
	const user = useSelector(selectUser);
	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();
	const breadcrumbs = useSelector(selectBreadcrumbs);
	const ieObjectId = router.query.ie as string;

	// User types
	const isKeyUser = useIsKeyUser();
	const isMeemooAdmin = useHasAnyGroup(GroupName.MEEMOO_ADMIN);
	const isAnonymous = useHasAnyGroup(GroupName.ANONYMOUS);
	const isCPAdmin = useHasAnyGroup(GroupName.CP_ADMIN);
	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	// Permissions
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const canRequestMaterial: boolean | null = useHasAllPermission(
		Permission.CREATE_MATERIAL_REQUESTS
	);

	// Internal state
	const [mediaType, setMediaType] = useState<IeObjectType | null>(null);
	const [isMediaPaused, setIsMediaPaused] = useState(true);
	const [hasMediaPlayed, setHasMediaPlayed] = useState(false);
	const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // Used for going through the pages of a newspaper
	const [currentRepresentationIndex, setCurrentRepresentationIndex] = useState<number>(0); // Used for going through the videos/audio/image representations/files inside a single detail page
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | null>(null);
	const [similar, setSimilar] = useState<MediaObject[]>([]);
	const [related, setRelated] = useState<MediaObject[]>([]);
	const [metadataExportDropdownOpen, setMetadataExportDropdownOpen] = useState(false);
	const [selectedMetadataField, setSelectedMetadataField] = useState<MetadataItem | null>(null);
	const [isRelatedObjectsBladeOpen, setIsRelatedObjectsBladeOpen] = useState(false);
	const [isOcrBladeOpen, setIsOcrBladeOpen] = useState(false);
	const [isOcrEnabled, setIsOcrEnabled] = useState<boolean>(false);
	const [searchOcrText, setSearchOcrText] = useState<string>('');
	const [isHighlightSearchTermsActive, setIsHighlightSearchTermsActive] = useState<boolean>(true);
	const [copyrightModalOpen, setCopyrightModalOpen] = useState(false);
	const [onConfirmCopyright, setOnConfirmCopyright] = useState<() => void>(noop);
	// Layout
	useStickyLayout();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();
	const folders = useSelector(selectFolders);

	// Query params
	const [query, setQuery] = useQueryParams({
		...IE_OBJECT_QUERY_PARAM_CONFIG,
		[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: StringParam,
		[QUERY_PARAM_KEY.ACTIVE_BLADE]: StringParam,
		[QUERY_PARAM_KEY.ACTIVE_TAB]: StringParam,
		[QUERY_PARAM_KEY.IIIF_VIEWER_FOCUS_X]: withDefault(NumberParam, undefined),
		[QUERY_PARAM_KEY.IIIF_VIEWER_FOCUS_Y]: withDefault(NumberParam, undefined),
		[QUERY_PARAM_KEY.IIIF_VIEWER_ZOOM_LEVEL]: withDefault(NumberParam, undefined),
	});
	const searchTerms = query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS] as string | undefined;

	const setActiveTab = (tabId: ObjectDetailTabs | null) => {
		setQuery({ ...query, [QUERY_PARAM_KEY.ACTIVE_TAB]: tabId || undefined }, 'replace');
	};

	const setActiveBlade = (blade: MediaActions | null) => {
		setQuery({ ...query, [QUERY_PARAM_KEY.ACTIVE_BLADE]: blade || undefined }, 'replace');
	};

	const activeTab = query[QUERY_PARAM_KEY.ACTIVE_TAB];
	const activeBlade = query[QUERY_PARAM_KEY.ACTIVE_BLADE];

	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetIeObjectInfo(ieObjectId);

	const isNoAccessError = (mediaInfoError as HTTPError)?.response?.status === 403;

	const currentPage = mediaInfo?.pageRepresentations?.[currentPageIndex];
	const currentRepresentation = currentPage?.[currentRepresentationIndex];

	// peak file
	const peakFileStoredAt: string | null =
		currentRepresentation?.files?.find((file) => file.mimeType === 'application/json')
			?.storedAt || null;

	// media info
	const { data: peakJson } = useGetPeakFile(peakFileStoredAt, {
		enabled: mediaInfo?.dctermsFormat === 'audio',
	});

	const iiifViewerReference =
		useRef<IiifViewerFunctions>() as MutableRefObject<IiifViewerFunctions>;

	const representationsToDisplay =
		(mediaInfo?.pageRepresentations || []).flatMap((reps) =>
			reps.flatMap((rep) =>
				rep.files.filter((file) => FLOWPLAYER_FORMATS.includes(file.mimeType))
			)
		) || [];

	// playable url
	const currentPlayableFile: IeObjectFile | undefined = currentRepresentation?.files?.find(
		(file) => FLOWPLAYER_FORMATS.includes(file?.mimeType)
	);
	const fileStoredAt: string | null = currentPlayableFile?.storedAt ?? null;
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketInfo(
		fileStoredAt,
		() => setFlowPlayerKey(fileStoredAt) // Force flowplayer rerender after successful fetch
	);

	// also interesting
	const userHasAccessToMaintainer =
		mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.VISITOR_SPACE_FOLDERS) ||
		mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.VISITOR_SPACE_FULL);
	const { data: similarData } = useGetIeObjectsAlsoInteresting(
		ieObjectId,
		isKiosk || userHasAccessToMaintainer ? mediaInfo?.maintainerId ?? '' : '',
		{ enabled: !!mediaInfo }
	);

	// related
	const { data: relatedData } = useGetIeObjectsRelated(ieObjectId, mediaInfo?.maintainerId, {
		enabled: !!mediaInfo,
	});

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
	const hasMedia = mediaInfo?.pageRepresentations?.length || 0 > 0;
	const isMediaInfoErrorNotFound = (mediaInfoError as HTTPError)?.response?.status === 404;
	const isMediaInfoErrorNoAccess = (mediaInfoError as HTTPError)?.response?.status === 403;
	const isVisitRequestErrorNotFound =
		(visitRequestError as HTTPError)?.response?.status === 404 ||
		(visitRequestError as HTTPError)?.response?.status === 403;
	const isErrorSpaceNotFound = (visitorSpaceError as HTTPError)?.response?.status === 404;
	const isErrorSpaceNotActive = (visitorSpaceError as HTTPError)?.response?.status === 410;
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider =
		representationsToDisplay.length > 1 && mediaInfo?.dctermsFormat !== IeObjectType.Newspaper;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const hasAccessToVisitorSpaceOfObject =
		intersection(mediaInfo?.accessThrough, [
			IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
			IeObjectAccessThrough.VISITOR_SPACE_FULL,
		]).length > 0;
	const isPublicNewspaper =
		mediaInfo?.licenses?.includes(IeObjectLicense.PUBLIEK_CONTENT) &&
		mediaInfo.dctermsFormat === IeObjectType.Newspaper;
	const canRequestAccess =
		isNil(
			accessibleVisitorSpaces?.find((space) => space.maintainerId === mediaInfo?.maintainerId)
		) &&
		mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		isNil(mediaInfo.thumbnailUrl);
	const showKeyUserPill = mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.SECTOR);
	const showVisitButton =
		isNil(mediaInfo?.thumbnailUrl) &&
		mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		visitorSpace?.status === VisitorSpaceStatus.Active &&
		!isKiosk;
	const canDownloadMetadata: boolean =
		(useHasAnyPermission(Permission.EXPORT_OBJECT, Permission.DOWNLOAD_OBJECT) &&
			(hasAccessToVisitorSpaceOfObject || isPublicNewspaper)) ||
		false;

	/**
	 * Effects
	 */

	useEffect(() => {
		// Close dropdown while resizing
		setMetadataExportDropdownOpen(false);
	}, [windowSize]);

	useEffect(() => {
		dispatch(setShowZendesk(!isKiosk && !hasAccessToVisitorSpaceOfObject));
	}, [dispatch, hasAccessToVisitorSpaceOfObject, isKiosk]);

	useEffect(() => {
		if (mediaInfo) {
			const path = window.location.href;
			const eventData = {
				type: mediaInfo.dctermsFormat,
				fragment_id: mediaInfo.schemaIdentifier,
				pid: mediaInfo.schemaIdentifier,
				user_group_name: user?.groupName ?? GroupName.ANONYMOUS,
				or_id: mediaInfo.maintainerId,
			};

			if (hasAccessToVisitorSpaceOfObject) {
				EventsService.triggerEvent(LogEventType.BEZOEK_ITEM_VIEW, path, eventData);
			} else {
				EventsService.triggerEvent(LogEventType.ITEM_VIEW, path, eventData);
			}
		}
	}, [hasAccessToVisitorSpaceOfObject, mediaInfo, user?.groupName]);

	useEffect(() => {
		// Pause media if metadata tab is shown on mobile
		if (isMobile && activeTab === ObjectDetailTabs.Metadata) {
			setIsMediaPaused(true);
		}
	}, [activeTab, isMobile]);

	useEffect(() => {
		setMediaType(mediaInfo?.dctermsFormat || null);

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
			const date = ieObject.datePublished ?? ieObject.dateCreatedLowerBound ?? null;

			return {
				type: ieObject?.dctermsFormat || null,
				title: ieObject?.name || '',
				subtitle: isNil(date)
					? `${ieObject?.maintainerName ?? ''}`
					: `${ieObject?.maintainerName ?? ''} (${formatMediumDate(asDate(date))})`,
				description: ieObject?.description || '',
				thumbnail: ieObject?.thumbnailUrl,
				id: ieObject?.schemaIdentifier || '',
				maintainer_id: ieObject?.maintainerId || '',
			};
		});
	};

	const mapRelatedData = (data: IeObject[]): MediaObject[] => {
		return data.map((item) => {
			const date = item.datePublished ?? item.dateCreatedLowerBound ?? null;

			return {
				type: item.dctermsFormat,
				title: item.name,
				subtitle: isNil(date)
					? `${item?.maintainerName ?? ''}`
					: `${item?.maintainerName ?? ''} (${formatMediumDate(asDate(date))})`,
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
	const onClickToggle = () => {
		setActiveTab(expandMetadata ? ObjectDetailTabs.Media : ObjectDetailTabs.Metadata);
	};

	const onCloseBlade = () => {
		setActiveBlade(null);
	};

	const onDuplicateRequest = () => {
		toastService.notify({
			maxLines: 3,
			title: tText(
				'modules/visitor-space/components/material-request-blade/material-request-blade___aanvraag-al-in-lijst'
			),
			description: tText(
				'modules/visitor-space/components/material-request-blade/material-request-blade___aanvraag-al-in-lijst-beschrijving'
			),
		});
	};

	const openRequestAccessBlade = () => {
		if (user) {
			// Open the request access blade
			setActiveBlade(MediaActions.RequestAccess);
		} else {
			// Open the login blade first
			setQuery(
				{
					...query,
					[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: '1',
					[QUERY_PARAM_KEY.ACTIVE_BLADE]: MediaActions.RequestAccess,
				},
				'replace'
			);
		}
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
				openRequestAccessBlade();
				break;
			case MediaActions.RequestMaterial:
				onRequestMaterialClick();
				break;
			case MediaActions.ToggleHighlightSearchTerm:
				setIsHighlightSearchTermsActive(!isHighlightSearchTermsActive);
				break;
		}
	};

	/**
	 * If the maintainer of this ie-object has an external form for material requests, we need to construct that url with certain parameters
	 * This currently is only the case for UGent and VRT
	 */
	const getExternalMaterialRequestUrlIfAvailable = useCallback((): string | null => {
		if (isAnonymous) {
			return null;
		}

		if (mediaInfo?.maintainerFormUrl && user) {
			// Sometimes we want to encode the url params and sometimes we dont. https://meemoo.atlassian.net/browse/ARC-1710
			// For UGent the whole url is inside one param, so we cannot encode it
			// For vrt the url is stored in the form_url and the params should be encoded
			const encodeOrNotUriComponent = mediaInfo.maintainerFormUrl.startsWith('http')
				? encodeURIComponent
				: (param: string) => param;
			return mediaInfo.maintainerFormUrl
				.replaceAll('{first_name}', encodeOrNotUriComponent(user.firstName))
				.replaceAll('{last_name}', encodeOrNotUriComponent(user.lastName))
				.replaceAll('{email}', encodeOrNotUriComponent(user.email))
				.replaceAll(
					'{local_cp_id}',
					encodeOrNotUriComponent(mediaInfo?.meemooLocalId || '')
				)
				.replaceAll('{pid}', encodeOrNotUriComponent(mediaInfo?.schemaIdentifier || ''))
				.replaceAll('{title}', encodeOrNotUriComponent(mediaInfo?.name || ''))
				.replaceAll(
					'{title_serie}',
					encodeOrNotUriComponent(mediaInfo?.isPartOf?.serie?.[0] || '')
				);
		}
		return null;
	}, [isAnonymous, mediaInfo, user]);

	const onRequestMaterialClick = async () => {
		if (isAnonymous) {
			dispatch(setShowAuthModal(true));
			return;
		}

		const materialRequests = await MaterialRequestsService.getAll({
			size: 500,
			isPending: true,
			isPersonal: true,
		});

		if (
			materialRequests?.items &&
			materialRequests.items.find(
				(request) => request.objectSchemaIdentifier === mediaInfo?.schemaIdentifier
			)
		) {
			onDuplicateRequest();
			return;
		}

		const externalFormUrl = getExternalMaterialRequestUrlIfAvailable();
		if (externalFormUrl) {
			EventsService.triggerEvent(LogEventType.ITEM_REQUEST, window.location.href, {
				fragment_id: mediaInfo?.schemaIdentifier,
				pid: mediaInfo?.schemaIdentifier,
				user_group_name: user?.groupName,
				or_id: mediaInfo?.maintainerId,
			});

			// The external url is opened with an actual link, so safari doesn't block the popup
		} else {
			setActiveBlade(MediaActions.RequestMaterial);
		}
	};

	const handleOnPlay = () => {
		setIsMediaPaused(false);
		if (!hasMediaPlayed) {
			// Check state inside setState function since this is an event handler outside React
			// so state doesn't update automatically
			// https://stackoverflow.com/questions/53845595/wrong-react-hooks-behaviour-with-event-listener
			// https://meemoo.atlassian.net/browse/ARC-2039
			setHasMediaPlayed((oldHasMediaPlayed) => {
				if (!oldHasMediaPlayed) {
					const path = window.location.href;
					const eventData = {
						type: mediaInfo?.dctermsFormat,
						fragment_id: mediaInfo?.schemaIdentifier,
						pid: mediaInfo?.schemaIdentifier,
						user_group_name: user?.groupName,
						or_id: mediaInfo?.maintainerId,
					};

					if (hasAccessToVisitorSpaceOfObject) {
						EventsService.triggerEvent(
							LogEventType.BEZOEK_ITEM_PLAY,
							path,
							eventData
						).then(noop);
					} else {
						EventsService.triggerEvent(LogEventType.ITEM_PLAY, path, eventData).then(
							noop
						);
					}
				}

				return true;
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
				ROUTES_BY_LOCALE[locale].visitRequested.replace(
					':slug',
					createdVisitRequest.spaceSlug
				)
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
			return KEY_USER_ACTION_SORT_MAP(canDownloadMetadata);
		}

		if (isKiosk) {
			return KIOSK_ACTION_SORT_MAP();
		}

		if (isMeemooAdmin) {
			return MEEMOO_ADMIN_ACTION_SORT_MAP(canDownloadMetadata);
		}

		if (isCPAdmin) {
			return CP_ADMIN_ACTION_SORT_MAP(canDownloadMetadata);
		}

		return VISITOR_ACTION_SORT_MAP(canDownloadMetadata);
	}, [canDownloadMetadata, isKeyUser, isMeemooAdmin, isKiosk, user, isCPAdmin]);

	const onExportClick = useCallback(
		(format: MetadataExportFormats) => {
			switch (format) {
				case MetadataExportFormats.fullNewspaperZip:
					setCopyrightModalOpen(true);
					setOnConfirmCopyright(
						() => () =>
							window.open(
								`${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${ieObjectId}/${IE_OBJECTS_SERVICE_EXPORT}/zip`
							)
					);
					break;

				case MetadataExportFormats.onePageNewspaperZip:
					setCopyrightModalOpen(true);
					setOnConfirmCopyright(
						() => () =>
							window.open(
								`${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${ieObjectId}/${IE_OBJECTS_SERVICE_EXPORT}/zip?page=${currentPageIndex}`
							)
					);
					break;

				case MetadataExportFormats.xml:
				case MetadataExportFormats.csv:
				default:
					window.open(
						`${publicRuntimeConfig.PROXY_URL}/${IE_OBJECTS_SERVICE_BASE_URL}/${ieObjectId}/${IE_OBJECTS_SERVICE_EXPORT}/${format}`
					);
			}
			setMetadataExportDropdownOpen(false);
		},
		[currentPageIndex, ieObjectId]
	);

	const renderExportDropdown = useCallback(
		(isPrimary: boolean) => {
			const icon = <Icon name={IconNamesLight.Export} aria-hidden />;
			const label = tText(
				'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata'
			);

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
								className={styles['p-object-detail__export-dropdown']}
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

	/**
	 * Content
	 */
	const tabs: TabProps[] = useMemo(() => {
		const available = !isErrorPlayableUrl && !!playableUrl && !!currentPlayableFile;
		return OBJECT_DETAIL_TABS(mediaType, available).map((tab) => ({
			...tab,
			label: <TabLabel label={tab.label} />,
			active: tab.id === activeTab,
		}));
	}, [activeTab, mediaType, isErrorPlayableUrl, playableUrl, currentPlayableFile]);

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

	const showVisitorSpaceNavigationBar = !isNil(accessEndDate) || isKiosk;

	const mediaActions: DynamicActionMenuProps = useMemo(() => {
		const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
		const originalActions = MEDIA_ACTIONS({
			isMobile,
			canManageFolders: canManageFolders || isAnonymous,
			isInAFolder: isInAFolder(folders, mediaInfo?.schemaIdentifier),
			isHighlightSearchTermActive: isHighlightSearchTermsActive,
			canToggleSearchTerms: !!searchTerms,
			canReport: !isKiosk,
			canRequestAccess: !!canRequestAccess,
			canRequestMaterial: isAnonymous || canRequestMaterial,
			canExport: canDownloadMetadata,
			externalFormUrl: getExternalMaterialRequestUrlIfAvailable(),
		});

		// Sort, filter and tweak actions according to the given sort map
		const sortMap = getSortMapByUserType();
		const actions: ActionItem[] = sortBy(originalActions.actions, ({ id }: ActionItem) =>
			indexOf(
				sortMap.map((d) => d.id),
				id
			)
		)
			.map((action: ActionItem) => {
				const existsInSortMap = !isNil(sortMap.find((d) => d.id === action.id));
				const isPrimary = sortMap.find((d) => action.id === d.id)?.isPrimary ?? false;
				const showExport = action.id === MediaActions.Export && canDownloadMetadata;

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
			...originalActions,
			actions,
		};
	}, [
		windowSize.width,
		canManageFolders,
		isAnonymous,
		folders,
		mediaInfo?.schemaIdentifier,
		isHighlightSearchTermsActive,
		searchTerms,
		isKiosk,
		canRequestAccess,
		canRequestMaterial,
		canDownloadMetadata,
		getExternalMaterialRequestUrlIfAvailable,
		getSortMapByUserType,
		renderExportDropdown,
	]);

	const handleHoverOcrWord = (textLocation: AltoTextLine, index: number) => {
		iiifViewerReference?.current?.iiifZoomToRect(textLocation);
		iiifViewerReference?.current?.setActiveWordIndex(index);
	};

	const iiifViewerImageInfos = useMemo((): ImageInfo[] => {
		const images: ImageInfo[] = compact(
			mediaInfo?.pageRepresentations?.flatMap((pageReps) => {
				const files = pageReps.flatMap((pageRep) => pageRep.files);
				const imageApiFile = files.find((file) =>
					IMAGE_API_FORMATS.includes(file.mimeType)
				);
				const imageFile = files.find((file) => IMAGE_FORMATS.includes(file.mimeType));
				const altoFile = files.find((file) => XML_FORMATS.includes(file.mimeType));
				if (!imageFile?.storedAt) {
					return null;
				}
				return {
					imageUrl: imageApiFile?.storedAt || imageFile?.storedAt,
					thumbnailUrl: imageFile?.thumbnailUrl || imageFile?.storedAt,
					width: 2000, // TODO remove these dimensions and get them from the iiif viewer api
					height: 3000,
					altoUrl: altoFile?.storedAt,
				};
			})
		);
		return images;
	}, [mediaInfo]);

	/**
	 * Render
	 */

	const renderMedia = (): ReactNode => {
		const isNewspaper = mediaInfo?.dctermsFormat === IeObjectType.Newspaper;

		if ((isLoadingPlayableUrl && !isNewspaper) || !mediaInfo) {
			return <Loading fullscreen owner="object detail page: render media" />;
		}

		// IIIF viewer
		if (isNewspaper && !!mediaInfo) {
			return (
				<IiifViewer
					imageInfos={iiifViewerImageInfos}
					ref={iiifViewerReference}
					id={mediaInfo?.schemaIdentifier as string}
					isOcrEnabled={isOcrEnabled}
					setIsOcrEnabled={setIsOcrEnabled}
					activeImageIndex={currentPageIndex}
					setActiveImageIndex={setCurrentPageIndex}
					initialFocusX={query[QUERY_PARAM_KEY.IIIF_VIEWER_FOCUS_X]}
					initialFocusY={query[QUERY_PARAM_KEY.IIIF_VIEWER_FOCUS_Y]}
					initialZoomLevel={query[QUERY_PARAM_KEY.IIIF_VIEWER_ZOOM_LEVEL]}
				/>
			);
		}

		if (isErrorPlayableUrl) {
			return (
				<ObjectPlaceholder
					{...ticketErrorPlaceholder()}
					addSliderPadding={showFragmentSlider}
				/>
			);
		}

		if (!playableUrl || !currentPlayableFile) {
			return (
				<ObjectPlaceholder
					{...noLicensePlaceholder()}
					onOpenRequestAccess={showVisitButton ? openRequestAccessBlade : undefined}
					addSliderPadding={showFragmentSlider}
				/>
			);
		}

		const shared: Partial<FlowPlayerProps> = {
			className: clsx('p-object-detail__flowplayer', {
				'p-object-detail__flowplayer--with-slider': showFragmentSlider,
			}),
			title: currentPlayableFile?.name,
			logo: mediaInfo?.maintainerOverlay ? mediaInfo?.maintainerLogo || undefined : undefined,
			pause: isMediaPaused,
			onPlay: handleOnPlay,
			onPause: handleOnPause,
			token: publicRuntimeConfig.FLOW_PLAYER_TOKEN,
			dataPlayerId: publicRuntimeConfig.FLOW_PLAYER_ID,
			plugins: ['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio', 'keyboard'],
		};

		// Flowplayer
		if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(currentPlayableFile.mimeType)) {
			return (
				<FlowPlayer
					key={flowPlayerKey}
					type="video"
					src={playableUrl as string}
					poster={mediaInfo?.thumbnailUrl?.[0] || undefined}
					{...shared}
				/>
			);
		}
		// Audio player
		if (playableUrl && FLOWPLAYER_AUDIO_FORMATS.includes(currentPlayableFile.mimeType)) {
			console.log('rendering audio flowplayer: ', { playableUrl, currentPlayableFile });
			if (peakFileStoredAt && !peakJson) {
				return (
					<Loading fullscreen owner="object detail page: render media audio peak file" />
				);
			} else {
				return (
					<FlowPlayer
						key={flowPlayerKey}
						type="audio"
						src={[
							{
								src: playableUrl as string,
								type: currentPlayableFile.mimeType,
							},
						]}
						poster={'/images/waveform.svg'}
						waveformData={peakJson?.data || undefined}
						{...shared}
					/>
				);
			}
		}
	};

	// Metadata
	const renderCard = (item: MediaObject, isHidden: boolean) => (
		<li>
			<Link
				passHref
				href={`${ROUTES_BY_LOCALE[locale].search}/${router.query.slug}/${item.id}`}
			>
				<a
					tabIndex={isHidden ? -1 : 0}
					className={clsx(
						styles['p-object-detail__metadata-card-link'],
						'u-text-no-decoration'
					)}
					aria-label={item.title}
				>
					{<RelatedObject object={item} />}
				</a>
			</Link>
		</li>
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

	const renderResearchWarning = (): ReactNode => (
		<Callout
			className={clsx(styles['p-object-detail__callout'], 'u-pt-32 u-pb-24')}
			icon={<Icon name={IconNamesLight.Info} aria-hidden />}
			text={tHtml(
				'pages/slug/ie/index___door-gebruik-te-maken-van-deze-applicatie-bevestigt-u-dat-u-het-beschikbare-materiaal-enkel-raadpleegt-voor-wetenschappelijk-of-prive-onderzoek'
			)}
			action={
				<Link passHref href={KNOWN_STATIC_ROUTES.kioskConditions}>
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
		<div className="u-m-0">
			{
				<ul
					className={clsx(
						'u-bg-platinum',
						'u-list-reset',
						styles['p-object-detail__metadata-list'],
						`p-object-detail__metadata-list--${type}`,
						{
							[styles['p-object-detail__metadata-list--collapsed']]:
								!expandMetadata || isMobile,
							[styles['p-object-detail__metadata-list--expanded']]:
								expandMetadata && !isMobile,
						}
					)}
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
		</div>
	);

	const renderMaintainerMetaTitle = ({
		maintainerName,
		maintainerLogo,
		maintainerId,
	}: IeObject): ReactNode => (
		<div className={styles['p-object-detail__metadata-maintainer-title']}>
			<p className={styles['p-object-detail__metadata-label']}>
				{tText('modules/ie-objects/const/index___aanbieder')}
			</p>
			{!isKiosk && !hasAccessToVisitorSpaceOfObject && (
				<>
					<NoServerSideRendering>
						<div className={styles['p-object-detail__metadata-pill']}>
							<TagList
								className="u-pt-12"
								tags={mapKeywordsToTags([maintainerName])}
								onTagClicked={async () => {
									await router.push(
										stringifyUrl({
											url: ROUTES_BY_LOCALE[locale].search,
											query: {
												[SearchFilterId.Maintainers]: [
													`${maintainerId}${FILTER_LABEL_VALUE_DELIMITER}${maintainerName}`,
												],
											},
										})
									);
								}}
								variants={['clickable', 'silver', 'medium']}
							/>
						</div>
					</NoServerSideRendering>
					{maintainerLogo && (
						<div className={styles['p-object-detail__metadata-logo']}>
							{/* eslint-disable-next-line @next/next/no-img-element */}
							{/* TODO remove this hack once we fully switched to the new graph.organisations table */}
							<img src={maintainerLogo} alt={`Logo ${maintainerName}`} />
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
			className={styles['p-object-detail__visit-button']}
			onClick={openRequestAccessBlade}
		/>
	);

	const renderMaintainerMetaData = ({
		maintainerDescription,
		maintainerSiteUrl,
		maintainerName,
	}: IeObject): ReactNode => {
		if (!isKiosk && !hasAccessToVisitorSpaceOfObject) {
			return (
				<div className={styles['p-object-detail__metadata-maintainer-data']}>
					{maintainerDescription && (
						<p className={styles['p-object-detail__metadata-description']}>
							{maintainerDescription}
						</p>
					)}
					{maintainerSiteUrl && (
						<p className={styles['p-object-detail__metadata-link']}>
							<a href={maintainerSiteUrl} target="_blank" rel="noopener noreferrer">
								{maintainerSiteUrl}
							</a>
							<Icon className="u-ml-8" name={IconNamesLight.Extern} />
						</p>
					)}
					{showVisitButton && isMobile && renderVisitButton()}
				</div>
			);
		} else {
			return (
				<div className={styles['p-object-detail__metadata-maintainer-data']}>
					{maintainerName}
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

	const renderMetaData = () => {
		if (isNil(mediaInfo)) {
			return;
		}

		const showAlert = !mediaInfo.description;
		const metaDataFields = METADATA_FIELDS(mediaInfo).filter(
			({ data }: MetadataItem): boolean => !!data
		);

		return (
			<>
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
						<HighlightSearchTerms
							toHighlight={mediaInfo?.name}
							enabled={isHighlightSearchTermsActive}
						/>
					</h3>

					{renderMetaDataActions()}

					<MetaDataFieldWithHighlightingAndMaxLength
						title={tText(
							'modules/visitor-space/utils/metadata/metadata___beschrijving'
						)}
						data={mediaInfo.description}
						className="u-pb-24 u-line-height-1-4 u-font-size-14"
						onReadMoreClicked={setSelectedMetadataField}
						enableHighlighting={isHighlightSearchTermsActive}
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

				<MetadataList disableContainerQuery={false}>
					<Metadata
						title={renderMaintainerMetaTitle(mediaInfo)}
						key={`metadata-maintainer`}
					>
						{renderMaintainerMetaData(mediaInfo)}
					</Metadata>
					{/* other metadata fields */}
					{metaDataFields.map((item: MetadataItem, index: number) => {
						return (
							<Metadata title={item.title} key={`metadata-${index}-${item.title}`}>
								<MetaDataFieldWithHighlightingAndMaxLength
									title={item.title}
									data={item.data as string}
									onReadMoreClicked={setSelectedMetadataField}
									enableHighlighting={isHighlightSearchTermsActive}
								/>
							</Metadata>
						);
					})}
				</MetadataList>

				{(!!similar.length || !!mediaInfo.keywords?.length) && (
					<MetadataList disableContainerQuery>
						{[
							{
								title: tHtml(
									'pages/bezoekersruimte/visitor-space-slug/object-id/index___trefwoorden'
								),
								data: renderKeywordsAsTags(
									mediaInfo.keywords,
									visitRequest ? (router.query.slug as string) : '',
									locale,
									router
								),
							},
							{
								title: tHtml('pages/slug/ie/index___ook-interessant'),
								data: similar.length
									? renderMetadataCards('similar', similar)
									: null,
							},
						]
							.filter((field) => !!field.data)
							.map(
								(
									item: { title: ReactNode; data: ReactNode | string },
									index: number
								) => {
									return (
										<Metadata
											title={item.title}
											key={`metadata-${index}-${item.title}`}
											className="u-pb-0"
										>
											{item.data}
										</Metadata>
									);
								}
							)}
					</MetadataList>
				)}
			</>
		);
	};

	const renderRelatedObjectsBlade = () => {
		if (!related.length || (!expandMetadata && isMobile)) {
			return null;
		}
		return (
			<CollapsableBlade
				className={clsx('p-object-detail__related', {
					'p-object-detail__metadata--expanded': expandMetadata,
					'p-object-detail__metadata--collapsed': !expandMetadata,
				})}
				isOpen={isRelatedObjectsBladeOpen}
				setIsOpen={setIsRelatedObjectsBladeOpen}
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
				renderContent={(hidden: boolean) => renderMetadataCards('related', related, hidden)}
			/>
		);
	};

	const renderOcrBlade = () => {
		if (
			mediaInfo?.dctermsFormat !== IeObjectType.Newspaper ||
			!iiifViewerImageInfos?.[currentPageIndex]?.altoUrl ||
			(activeTab === ObjectDetailTabs.Media && isMobile)
		) {
			return null;
		}
		return (
			<CollapsableBlade
				className={'p-object-detail__ocr'}
				isOpen={isOcrBladeOpen}
				setIsOpen={setIsOcrBladeOpen}
				icon={
					<Icon
						className="u-font-size-24 u-mr-8 u-text-left"
						name={IconNamesLight.Newspaper}
						aria-hidden
					/>
				}
				title={tHtml('modules/ie-objects/object-detail-page___ocr-tekst')}
				renderContent={renderOcrContent}
			/>
		);
	};

	const renderOcrContent = () => {
		return (
			<div className={clsx(styles['p-object-detail__ocr'])}>
				<div className="u-flex">
					<SearchBar
						id="ocr-search"
						className={styles['p-object-detail__ocr__search']}
						value={searchOcrText}
						variants={['rounded', 'grey', 'icon--double', 'icon-clickable']}
						placeholder={tText(
							'modules/ie-objects/object-detail-page___zoek-in-de-ocr-tekst'
						)}
						onChange={setSearchOcrText}
						onSearch={() => {}}
					/>
					<div className={styles['p-object-detail__ocr__close']}>
						<Button
							className={'p-object-detail__iiif__controls__toggle-ocr'}
							icon={
								<Icon
									name={
										isOcrEnabled
											? IconNamesLight.NoNewspaper
											: IconNamesLight.Newspaper
									}
									aria-hidden
								/>
							}
							aria-label={tText(
								'pages/openseadragon/index___tekst-boven-de-afbeelding-tonen'
							)}
							variants={['silver']}
							onClick={() => setIsOcrEnabled(!isOcrEnabled)}
						/>
					</div>
				</div>

				{(altoTextLocations as AltoTextLine[]).map((textLocation, index) => {
					return (
						<>
							<span
								key={'ocr-text--' + mediaInfo?.schemaIdentifier + '--' + index}
								className={styles['p-object-detail__ocr__word']}
								onMouseOver={() => handleHoverOcrWord(textLocation, index)}
								onClick={() => setIsOcrEnabled(!isOcrEnabled)}
							>
								<HighlightSearchTerms
									toHighlight={textLocation.text}
									searchTerms={
										searchOcrText ? searchOcrText.split(' ') : undefined
									}
									enabled={isHighlightSearchTermsActive}
								/>
							</span>{' '}
						</>
					);
				})}
			</div>
		);
	};

	const renderObjectMedia = () => {
		if (mediaType) {
			return (
				<>
					{renderMedia()}
					{showFragmentSlider && (
						<FragmentSlider
							thumbnail={mediaInfo?.thumbnailUrl[0]}
							className={styles['p-object-detail__slider']}
							files={representationsToDisplay}
							onChangeFragment={setCurrentRepresentationIndex}
						/>
					)}
				</>
			);
		}
		return <ObjectPlaceholder {...objectPlaceholder()} />;
	};

	const renderNavigationBar = (): ReactNode => {
		if (showVisitorSpaceNavigationBar) {
			return (
				<VisitorSpaceNavigation
					className={styles['p-object-detail__nav']}
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
					className={styles['p-object-detail__back']}
					icon={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
					onClick={() => window.history.back()}
					variants={['black']}
				/>
			)
		);
	};

	const renderObjectDetail = () => (
		<>
			<Head>
				<link rel="canonical" href={`https://hetarchief.be/zoeken/${ieObjectId}`} />
			</Head>
			{renderNavigationBar()}
			<ScrollableTabs
				className={styles['p-object-detail__tabs']}
				variants={['dark']}
				tabs={tabs}
				onClick={(tabId) => setActiveTab(tabId as ObjectDetailTabs | null)}
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
				className={clsx(styles['p-object-detail__wrapper'], {
					[styles['p-object-detail--hidden']]: mediaInfoIsLoading || mediaInfoIsError,
					[styles['p-object-detail__wrapper--collapsed']]: !expandMetadata,
					[styles['p-object-detail__wrapper--expanded']]: expandMetadata,
					[styles['p-object-detail__wrapper--metadata']]:
						activeTab === ObjectDetailTabs.Metadata,
					[styles['p-object-detail__wrapper--video']]:
						activeTab === ObjectDetailTabs.Media,
				})}
			>
				{mediaType && hasMedia && (
					<Button
						className={clsx(styles['p-object-detail__expand-button'], {
							[styles['p-object-detail__expand-button--collapsed']]: !expandMetadata,
							[styles['p-object-detail__expand-button--expanded']]: expandMetadata,
						})}
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
				<div className={styles['p-object-detail__media']}>{renderObjectMedia()}</div>
				<div
					className={clsx(styles['p-object-detail__sidebar'], {
						[styles['p-object-detail__sidebar--collapsed']]: !expandMetadata,
						[styles['p-object-detail__sidebar--expanded']]: expandMetadata,
					})}
				>
					<div
						className={clsx(styles['p-object-detail__metadata'], {
							[styles['p-object-detail__metadata--no-media']]: !mediaType,
						})}
					>
						{renderMetaData()}
					</div>
					{renderRelatedObjectsBlade()}
					{renderOcrBlade()}
				</div>
			</article>
			{canManageFolders && (
				<AddToFolderBlade
					isOpen={activeBlade === MediaActions.Bookmark}
					objectToAdd={
						mediaInfo
							? {
									schemaIdentifier: mediaInfo.schemaIdentifier,
									title: mediaInfo.name,
							  }
							: undefined
					}
					onClose={onCloseBlade}
					onSubmit={async () => onCloseBlade()}
					id="object-detail-page__add-to-folder-blade"
				/>
			)}
			{mediaInfo && !isKiosk && (
				<MaterialRequestBlade
					isOpen={activeBlade === MediaActions.RequestMaterial}
					onClose={onCloseBlade}
					objectName={mediaInfo?.name}
					objectId={mediaInfo?.schemaIdentifier}
					objectDctermsFormat={mediaInfo.dctermsFormat}
					maintainerName={mediaInfo?.maintainerName}
					maintainerLogo={mediaInfo?.maintainerLogo}
					maintainerSlug={mediaInfo?.maintainerSlug}
					layer={1}
					currentLayer={1}
				/>
			)}
			<ReportBlade
				user={user}
				isOpen={activeBlade === MediaActions.Report}
				onClose={onCloseBlade}
				id="object-detail-page__report-blade"
			/>
			<RequestAccessBlade
				isOpen={activeBlade === MediaActions.RequestAccess && !!user}
				onClose={() => setActiveBlade(null)}
				onSubmit={onRequestAccessSubmit}
				id="object-detail-page__request-access-blade"
			/>
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
		</>
	);

	// To determine the correct error page or the object detail page, we follow this flow:
	// fetch object
	//    - 200: show detail page
	//    - 404, 403: check the visitor space info
	//           - 404: not found error page
	//           - 410: visitor space no longer available error page
	//           - 200: check visit request info
	//                   - 200: not found error page
	//                   - 404, 403: no access error page

	const renderPageContent = () => {
		if (mediaInfoIsLoading || visitRequestIsLoading || visitorSpaceIsLoading) {
			return <Loading fullscreen owner="object detail page: render page content" />;
		}

		if (mediaInfo) {
			return (
				<div
					className={clsx(styles['p-object-detail'], {
						[styles['p-object-detail__visitor-space-navigation-bar--visible']]:
							showVisitorSpaceNavigationBar,
						[styles['p-object-detail__visitor-space-navigation-bar--hidden']]:
							!showVisitorSpaceNavigationBar,
					})}
				>
					{renderObjectDetail()}
				</div>
			);
		}

		if (isMediaInfoErrorNoAccess || isMediaInfoErrorNotFound) {
			if (isNoAccessError) {
				return (
					<ErrorNoAccessToObject
						visitorSpaceName={visitorSpace?.name as string}
						visitorSpaceSlug={visitorSpace?.slug as string}
						description={tHtml(
							'pages/bezoekersruimte/visitor-space-slug/object-id/index___tot-het-materiaal-geen-toegang-dien-aanvraag-in'
						)}
					/>
				);
			}

			if (isErrorSpaceNotFound) {
				return <ErrorNotFound />;
			}

			if (isErrorSpaceNotActive || visitorSpace?.status === VisitorSpaceStatus.Inactive) {
				return <ErrorSpaceNoLongerActive />;
			}

			if (visitorSpace && visitRequest) {
				return <ErrorNotFound />;
			}

			if (visitorSpace && isVisitRequestErrorNotFound) {
				return (
					<ErrorNoAccessToObject
						visitorSpaceName={visitorSpace?.name as string}
						visitorSpaceSlug={visitorSpace?.slug as string}
						description={tHtml(
							'pages/bezoekersruimte/visitor-space-slug/object-id/index___tot-het-materiaal-geen-toegang-dien-aanvraag-in'
						)}
					/>
				);
			}
		}

		return <ErrorNotFound />;
	};

	const seoDescription =
		description || capitalize(lowerCase((router.query.slug as string) || ''));
	return (
		<>
			<VisitorLayout>
				<SeoTags
					title={title}
					description={seoDescription}
					imgUrl={image}
					translatedPages={[]}
					relativeUrl={url}
				/>
				<CopyrightConfirmationModal
					isOpen={copyrightModalOpen}
					onClose={() => setCopyrightModalOpen((prevState) => !prevState)}
					onConfirm={() => {
						onConfirmCopyright();
						setCopyrightModalOpen((prevState) => !prevState);
					}}
				/>
				{renderPageContent()}
			</VisitorLayout>
		</>
	);
};
