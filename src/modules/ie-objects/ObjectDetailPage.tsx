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
	Tabs,
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
	isString,
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
import {
	BooleanParam,
	NumberParam,
	StringParam,
	useQueryParam,
	withDefault,
} from 'use-query-params';

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
import { NamesList } from '@ie-objects/components/NamesList/NamesList';
import { type NameInfo } from '@ie-objects/components/NamesList/NamesList.types';
import { ObjectPlaceholder } from '@ie-objects/components/ObjectPlaceholder';
import { type MediaObject, RelatedObject } from '@ie-objects/components/RelatedObject';
import { useGetAltoJsonFileContent } from '@ie-objects/hooks/get-alto-json-file-content';
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
	GET_METADATA_FIELDS,
	IMAGE_API_FORMATS,
	IMAGE_FORMATS,
	KEY_USER_ACTION_SORT_MAP,
	KIOSK_ACTION_SORT_MAP,
	MEDIA_ACTIONS,
	MEEMOO_ADMIN_ACTION_SORT_MAP,
	METADATA_EXPORT_OPTIONS,
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
	IsPartOfKey,
	MediaActions,
	MetadataExportFormats,
	type MetadataSortMap,
	ObjectDetailTabs,
	type OcrSearchResult,
} from '@ie-objects/ie-objects.types';
import {
	IE_OBJECTS_SERVICE_BASE_URL,
	IE_OBJECTS_SERVICE_EXPORT,
	NEWSPAPERS_SERVICE_BASE_URL,
} from '@ie-objects/services/ie-objects/ie-objects.service.const';
import { isInAFolder } from '@ie-objects/utils/folders';
import { getAltoTextId } from '@ie-objects/utils/get-alto-text-id';
import { getIeObjectRightsOwnerAsText } from '@ie-objects/utils/get-ie-object-rights-owner-as-text';
import { getIeObjectRightsStatusInfo } from '@ie-objects/utils/get-ie-object-rights-status';
import { mapKeywordsToTags, renderKeywordsAsTags } from '@ie-objects/utils/map-metadata';
import IiifViewer from '@iiif-viewer/IiifViewer';
import { type IiifViewerFunctions, type ImageInfo } from '@iiif-viewer/IiifViewer.types';
import { SearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/SearchInputWithResultsPagination';
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
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { KNOWN_STATIC_ROUTES, ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission, useHasAnyPermission } from '@shared/hooks/has-permission';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/ie-objects';
import { selectBreadcrumbs, setShowAuthModal, setShowZendesk } from '@shared/store/ui';
import { Breakpoints } from '@shared/types';
import { IeObjectType } from '@shared/types/ie-objects';
import { type DefaultSeoInfo } from '@shared/types/seo';
import { asDate, formatMediumDateWithTime, formatSameDayTimeOrDate } from '@shared/utils/dates';
import { useGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
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

import CopyButton from '../shared/components/CopyButton/CopyButton';

import styles from './ObjectDetailPage.module.scss';

const { publicRuntimeConfig } = getConfig();

export const ObjectDetailPage: FC<DefaultSeoInfo> = ({ title, description, image, url }) => {
	/**
	 * Hooks
	 */
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
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | null>(null);
	const [similar, setSimilar] = useState<MediaObject[]>([]);
	const [related, setRelated] = useState<MediaObject[]>([]);
	const [metadataExportDropdownOpen, setMetadataExportDropdownOpen] = useState(false);
	const [selectedMetadataField, setSelectedMetadataField] = useState<MetadataItem | null>(null);
	const [isRelatedObjectsBladeOpen, setIsRelatedObjectsBladeOpen] = useState(false);
	const [copyrightModalOpen, setCopyrightModalOpen] = useState(false);
	const [onConfirmCopyright, setOnConfirmCopyright] = useState<() => void>(noop);
	const [hasNewsPaperBeenRendered, setHasNewsPaperBeenRendered] = useState(false);
	const [hasAppliedUrlSearchTerms, setHasAppliedUrlSearchTerms] = useState<boolean>(false);

	// TODO get these names from the backend: https://meemoo.atlassian.net/browse/ARC-2219
	const [fallenNames] = useState<NameInfo[]>([
		{
			name: 'Jozef van de Kerke',
			bornYear: '1902',
			diedYear: '1917',
			bornLocation: 'Gent',
			diedLocation: 'Antwerpen',
			ocrLocationX: 500,
			ocrLocationY: 500,
			ocrConfidence: 96,
			link: 'https://namenlijst.org/publicsearch/#/person/_id=bc05cd33-673c-40c1-bb4a-d8d356d838ed',
		},
		{
			name: 'Jef Van Hove',
			bornYear: '1900',
			diedYear: '1918',
			bornLocation: 'Brussel',
			diedLocation: 'Duinkerke',
			ocrLocationX: 300,
			ocrLocationY: 700,
			ocrConfidence: 64,
			link: 'https://namenlijst.org/publicsearch/#/person/_id=bc05cd33-673c-40c1-bb4a-d8d356d838ed',
		},
		{
			name: 'Emiel De Hertogh',
			bornYear: '1889',
			diedYear: '1919',
			bornLocation: 'Kortrijk',
			diedLocation: 'Verdun',
			ocrLocationX: 100,
			ocrLocationY: 900,
			ocrConfidence: 12,
		},
		{
			name: 'Ludwig Vanckeerberghen',
			bornYear: '1910',
			diedYear: '1918',
			bornLocation: 'Brugge',
			diedLocation: 'Passendeale',
			ocrLocationX: 900,
			ocrLocationY: 100,
			ocrConfidence: 9,
			link: 'https://namenlijst.org/publicsearch/#/person/_id=bc05cd33-673c-40c1-bb4a-d8d356d838ed',
		},
		{
			name: 'Gerard Vanelsberghe',
			bornYear: '1898',
			diedYear: '1917',
			bornLocation: 'Oostende',
			diedLocation: 'Ieper',
			ocrLocationX: 200,
			ocrLocationY: 200,
			ocrConfidence: 3,
		},
	]);

	// Layout
	useStickyLayout();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();
	const folders = useSelector(selectFolders);

	// Query params

	// Search terms that are coming from the global search page
	const [highlightedSearchTerms, setHighlightedSearchTerms] = useQueryParam(
		QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS,
		withDefault(StringParam, '')
	);
	// Temp search terms are used to store the search terms while the user is typing
	const [searchTermsTemp, setSearchTermsTemp] = useState<string>('');
	// Search terms are used to store the search terms after the user has confirmed the search
	const [searchTerms, setSearchTerms] = useState<string>('');

	const [, setShowAuthQueryKey] = useQueryParam(QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY, StringParam);
	const [activeBlade, setActiveBlade] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_BLADE,
		withDefault(StringParam, undefined)
	);
	const [activeTab, setActiveTab] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_TAB,
		withDefault(StringParam, ObjectDetailTabs.Metadata)
	);

	// Used for going through the pages of a newspaper (iiif viewer reference strip)
	const [currentPageIndex, setCurrentPageIndex] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_PAGE,
		withDefault(NumberParam, 0)
	);

	const [currentSearchResultIndex, setCurrentSearchResultIndex] = useState<number>(0);
	const [expandSidebar, setExpandSidebar] = useQueryParam(
		QUERY_PARAM_KEY.EXPAND_SIDEBAR,
		withDefault(BooleanParam, false)
	);
	const [iiifViewerFocusX] = useQueryParam(
		QUERY_PARAM_KEY.IIIF_VIEWER_FOCUS_X,
		withDefault(NumberParam, undefined)
	);
	const [iiifViewerFocusY] = useQueryParam(
		QUERY_PARAM_KEY.IIIF_VIEWER_FOCUS_Y,
		withDefault(NumberParam, undefined)
	);
	const [iiifViewerZoomLevel] = useQueryParam(
		QUERY_PARAM_KEY.IIIF_VIEWER_ZOOM_LEVEL,
		withDefault(NumberParam, undefined)
	);
	const [isOcrEnabled, setIsOcrEnabled] = useQueryParam(
		QUERY_PARAM_KEY.IIIF_VIEWER_OCR_OVERLAY_ENABLED,
		withDefault(BooleanParam, false)
	);

	const [searchResults, setSearchResults] = useState<OcrSearchResult[] | null>(null);

	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetIeObjectInfo(ieObjectId);

	const isNoAccessError = (mediaInfoError as HTTPError)?.response?.status === 403;

	const currentPage = mediaInfo?.pageRepresentations?.[currentPageIndex];
	const currentRepresentation = currentPage?.[0];

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

	// File containing the consumable media. This can be video, audio, newspaper.
	const currentViewableFile: IeObjectFile | undefined = currentRepresentation?.files?.find(
		(file) => [...FLOWPLAYER_FORMATS, ...IMAGE_API_FORMATS].includes(file.mimeType)
	);

	// Playable url for flowplayer
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
	} = useGetActiveVisitRequestForUserAndSpace(router.query.slug as string, user);

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

	// ocr alto info
	const currentPageAltoUrl = useMemo((): string | null => {
		let altoFileUrl = null;
		currentPage?.find(
			(representation) =>
				representation?.files?.find((file) => {
					if (XML_FORMATS.includes(file.mimeType)) {
						altoFileUrl = file.storedAt;
						return true;
					}
					return false;
				})
		);
		return altoFileUrl;
	}, [currentPage]);
	const { data: simplifiedAltoInfo } = useGetAltoJsonFileContent(currentPageAltoUrl);

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
	const isNewspaper = mediaInfo?.dctermsFormat === IeObjectType.Newspaper;
	const showFragmentSlider = representationsToDisplay.length > 1 && !isNewspaper;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const hasAccessToVisitorSpaceOfObject =
		intersection(mediaInfo?.accessThrough, [
			IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
			IeObjectAccessThrough.VISITOR_SPACE_FULL,
		]).length > 0;
	const isPublicNewspaper =
		mediaInfo?.licenses?.includes(IeObjectLicense.PUBLIEK_CONTENT) && isNewspaper;
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

	const pageOcrTexts: (string | null)[] = useMemo(() => {
		const pageOcrTextsTemp: (string | null)[] = [];
		mediaInfo?.pageRepresentations?.forEach((representations) => {
			const pageTranscripts = compact(
				representations.map((representation) => {
					return representation.schemaTranscript;
				})
			);
			pageOcrTextsTemp.push(pageTranscripts[0]?.toLowerCase() || null);
		});
		return pageOcrTextsTemp;
	}, [mediaInfo?.pageRepresentations]);

	const arePagesOcrTextsAvailable = compact(pageOcrTexts).length !== 0;

	/**
	 * Effects
	 */
	useEffect(() => {
		const activeSearchResultElem = document.querySelector(
			'[class*="p-object-detail__ocr__word--marked--active"]'
		);
		const scrollable = document.querySelector(
			'[class*="p-object-detail__ocr__words-container"]'
		);

		const scrollTopWord = activeSearchResultElem?.scrollTop || 0;
		scrollable?.scrollTo({
			top: scrollTopWord,
		});
		activeSearchResultElem?.scrollIntoView({
			behavior: 'instant',
			block: 'nearest',
			inline: 'start',
		});
	}, [currentSearchResultIndex]);

	useEffect(() => {
		// Close dropdown while resizing
		setMetadataExportDropdownOpen(false);
	}, [windowSize]);

	useEffect(() => {
		dispatch(
			setShowZendesk(
				!isKiosk &&
					!hasAccessToVisitorSpaceOfObject &&
					activeTab === ObjectDetailTabs.Metadata
			)
		);
	}, [dispatch, hasAccessToVisitorSpaceOfObject, isKiosk, activeTab]);

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
			setActiveTab(ObjectDetailTabs.Metadata, 'replaceIn');
		} else {
			// Check media content and license for default tab on desktop
			setExpandSidebar(!mediaInfo?.dctermsFormat || !hasMedia, 'replaceIn');
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
			const date = ieObject.datePublished ?? ieObject.dateCreated ?? null;

			return {
				type: ieObject?.dctermsFormat || null,
				title: ieObject?.name || '',
				subtitle: isNil(date)
					? `${ieObject?.maintainerName ?? ''}`
					: `${ieObject?.maintainerName ?? ''} (${date})`,
				description: ieObject?.description || '',
				thumbnail: ieObject?.thumbnailUrl,
				id: ieObject?.schemaIdentifier || '',
				maintainer_id: ieObject?.maintainerId || '',
			};
		});
	};

	const mapRelatedData = (data: IeObject[]): MediaObject[] => {
		return data.map((item) => {
			const date = item.datePublished ?? item.dateCreated ?? null;

			return {
				type: item.dctermsFormat,
				title: item.name,
				subtitle: isNil(date)
					? `${item?.maintainerName ?? ''}`
					: `${item?.maintainerName ?? ''} (${date})`,
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
	const handleExpandButtonClicked = () => {
		setExpandSidebar(!expandSidebar, 'replaceIn');
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
			setShowAuthQueryKey('1', 'replaceIn');
			setActiveBlade(MediaActions.RequestAccess, 'replaceIn');
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
					encodeOrNotUriComponent(
						mediaInfo?.isPartOf?.find(
							(isPartOfEntry) => isPartOfEntry?.collectionType === IsPartOfKey.serie
						)?.name || ''
					)
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
				type: mediaInfo?.dctermsFormat,
			});

			// The external url is opened with an actual link, so safari doesn't block the popup
		} else {
			setActiveBlade(MediaActions.RequestMaterial);
		}
	};

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

	const handleClickOcrWord = useCallback(
		async (textLocation: AltoTextLine) => {
			iiifViewerReference?.current?.iiifZoomToRect(textLocation);
			const searchTermWords = searchTerms.split(' ');
			const activeAltoTextId = getAltoTextId(textLocation);
			const altoSearchTexts =
				simplifiedAltoInfo?.text?.filter((altoText) =>
					searchTermWords.some((searchTermWord) =>
						altoText.text.toLowerCase().includes(searchTermWord)
					)
				) || [];
			const highlightedAltoTextIds = altoSearchTexts
				.map(getAltoTextId)
				.filter((id) => id !== activeAltoTextId);
			iiifViewerReference?.current?.setActiveWordByIds(
				activeAltoTextId,
				highlightedAltoTextIds
			);
		},
		[searchTerms, simplifiedAltoInfo?.text]
	);

	const handleChangeSearchIndex = useCallback(
		async (searchResultIndex: number) => {
			if (!searchResults) {
				return;
			}
			setCurrentSearchResultIndex(searchResultIndex);
			const searchResult = searchResults[searchResultIndex];
			if (!searchResult) {
				return;
			}
			if (searchResult.pageIndex !== currentPageIndex) {
				setCurrentPageIndex(searchResult.pageIndex, 'replaceIn');
			}

			// Convert search term index to word index
			const searchTermWords = searchResult.searchTerm.split(' ');
			const altoSearchTexts = simplifiedAltoInfo?.text?.filter((altoText) =>
				searchTermWords.some((searchTermWord) =>
					altoText.text.toLowerCase().includes(searchTermWord)
				)
			);
			const altoSearchText = altoSearchTexts?.[searchResult.searchTermIndexOnPage];

			if (!altoSearchText) {
				return;
			}

			await handleClickOcrWord(altoSearchText);
		},
		[
			currentPageIndex,
			searchResults,
			setCurrentPageIndex,
			setCurrentSearchResultIndex,
			simplifiedAltoInfo?.text,
			handleClickOcrWord,
		]
	);

	const handleClearSearch = () => {
		setSearchTermsTemp('');
		setSearchTerms('');
		setHighlightedSearchTerms('');
		setSearchResults(null);
		iiifViewerReference.current?.iiifGoToHome();
	};

	const searchPagesOcrText = useCallback(
		async (newSearchTerms: string): Promise<void> => {
			if (newSearchTerms === '') {
				// Reset search
				// Zoom to whole page
				iiifViewerReference.current?.iiifGoToHome();
			}

			setSearchTerms(newSearchTerms);
			setActiveTab(ObjectDetailTabs.Ocr);

			if (!pageOcrTexts.length) {
				toastService.notify({
					maxLines: 3,
					title: tText('modules/ie-objects/object-detail-page___error'),
					description: tText(
						'modules/ie-objects/object-detail-page___deze-krant-heeft-geen-ocr-tekst'
					),
				});
				return;
			}

			const searchResultsTemp: OcrSearchResult[] = [];
			newSearchTerms.split(' ').forEach((searchTerm) => {
				pageOcrTexts.forEach((pageOcrText, pageIndex) => {
					if (!pageOcrText) {
						return; // Skip this page since it doesn't have an ocr transcript
					}
					let searchTermCharacterOffset: number = pageOcrText.indexOf(searchTerm);
					let searchTermIndexOnPage: number = 0;
					while (searchTermCharacterOffset !== -1) {
						const searchResult: OcrSearchResult = {
							pageIndex,
							searchTerm,
							searchTermCharacterOffset,
							searchTermIndexOnPage,
						};
						searchResultsTemp.push(searchResult);
						searchTermCharacterOffset = pageOcrText?.indexOf(
							searchTerm,
							searchTermCharacterOffset + 1
						);
						searchTermIndexOnPage += 1;
					}
				});
			});
			setSearchResults(searchResultsTemp);
			setCurrentPageIndex(searchResultsTemp?.[0]?.pageIndex || 0, 'replaceIn');
		},
		[pageOcrTexts, setActiveTab, setCurrentPageIndex]
	);

	useEffect(() => {
		if ((searchResults?.length || 0) > 0) {
			iiifViewerReference.current?.waitForReadyState().then(() => {
				handleChangeSearchIndex(0).then(noop);
			});
		}
	}, [searchResults, handleChangeSearchIndex]);

	useEffect(() => {
		// When the page loads, search the ocr texts for the searchTerms in the query params in the url
		if (highlightedSearchTerms && isNewspaper && !hasAppliedUrlSearchTerms) {
			setSearchTermsTemp(highlightedSearchTerms);
			setSearchTerms(highlightedSearchTerms);
			searchPagesOcrText(highlightedSearchTerms);
			setHasAppliedUrlSearchTerms(true);
		}
	}, [
		isNewspaper,
		hasAppliedUrlSearchTerms,
		mediaInfo?.dctermsFormat,
		searchPagesOcrText,
		highlightedSearchTerms,
	]);

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
					setOnConfirmCopyright(() => () => {
						window.open(
							`${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${ieObjectId}/${IE_OBJECTS_SERVICE_EXPORT}/zip`
						);
						handleOnDownloadEvent();
					});
					break;

				case MetadataExportFormats.onePageNewspaperZip:
					setCopyrightModalOpen(true);
					setOnConfirmCopyright(() => () => {
						window.open(
							`${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${ieObjectId}/${IE_OBJECTS_SERVICE_EXPORT}/zip?page=${currentPageIndex}`
						);
						handleOnDownloadEvent();
					});
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
		[currentPageIndex, handleOnDownloadEvent, ieObjectId]
	);

	const renderExportDropdown = useCallback(
		(isPrimary: boolean) => {
			const icon = <Icon name={IconNamesLight.Export} aria-hidden />;
			const label = tText('modules/ie-objects/object-detail-page___download-deze-krant');

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
									<span className="u-display-block:md">{label}</span>
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
		[metadataExportDropdownOpen, onExportClick]
	);

	/**
	 * Content
	 */

	const isMediaAvailable = useCallback((): boolean => {
		switch (mediaInfo?.dctermsFormat) {
			case IeObjectType.Audio:
			case IeObjectType.Video:
			case IeObjectType.Film:
				return !isErrorPlayableUrl && !!playableUrl && !!currentPlayableFile;

			case IeObjectType.Newspaper: {
				return !!currentRepresentation?.files?.find((file) =>
					IMAGE_API_FORMATS.includes(file.mimeType)
				);
			}

			default:
				return false;
		}
	}, [
		currentPlayableFile,
		currentRepresentation?.files,
		isErrorPlayableUrl,
		mediaInfo?.dctermsFormat,
		playableUrl,
	]);

	const tabs: TabProps[] = useMemo(() => {
		return OBJECT_DETAIL_TABS(mediaType, activeTab as ObjectDetailTabs, isMediaAvailable());
	}, [isMediaAvailable, mediaType, activeTab]);

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
	}, [isMobile, showLinkedSpaceAsHomepage, visitRequest?.endAt]);

	const showVisitorSpaceNavigationBar = !isNil(accessEndDate) || isKiosk;

	const mediaActions: DynamicActionMenuProps = useMemo(() => {
		const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
		const originalActions = MEDIA_ACTIONS({
			isMobile,
			canManageFolders: canManageFolders || isAnonymous,
			isInAFolder: isInAFolder(folders, mediaInfo?.schemaIdentifier),
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
		isKiosk,
		canRequestAccess,
		canRequestMaterial,
		canDownloadMetadata,
		getExternalMaterialRequestUrlIfAvailable,
		getSortMapByUserType,
		renderExportDropdown,
	]);

	const iiifViewerImageInfos = useMemo((): ImageInfo[] => {
		return compact(
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
	}, [mediaInfo]);

	/**
	 * Render
	 */

	const renderMedia = (): ReactNode => {
		if ((isLoadingPlayableUrl && !isNewspaper) || !mediaInfo) {
			return <Loading fullscreen owner="object detail page: render media" />;
		}

		// IIIF viewer
		if (isNewspaper && !!mediaInfo) {
			if (!hasNewsPaperBeenRendered) {
				handleOnPlay();
				setHasNewsPaperBeenRendered(true);
			}
			return (
				<IiifViewer
					imageInfos={iiifViewerImageInfos}
					altoJsonCurrentPage={simplifiedAltoInfo}
					ref={iiifViewerReference}
					id={mediaInfo?.schemaIdentifier as string}
					isOcrEnabled={isOcrEnabled || false}
					setIsOcrEnabled={(enabled) => setIsOcrEnabled(enabled, 'replaceIn')}
					activeImageIndex={currentPageIndex}
					setActiveImageIndex={setCurrentPageIndex}
					initialFocusX={iiifViewerFocusX}
					initialFocusY={iiifViewerFocusY}
					initialZoomLevel={iiifViewerZoomLevel}
					isSearchEnabled={arePagesOcrTextsAvailable}
					searchTerms={searchTermsTemp}
					setSearchTerms={setSearchTermsTemp}
					onSearch={searchPagesOcrText}
					onClearSearch={handleClearSearch}
					currentSearchIndex={currentSearchResultIndex}
					searchResults={searchResults}
					setSearchResultIndex={handleChangeSearchIndex}
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
			peakColorBackground: '#303030', // $shade-darker
			peakColorInactive: '#adadad', // zinc
			peakColorActive: '#00857d', // $teal
			peakHeightFactor: 0.6,
		};

		// Flowplayer
		if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(currentPlayableFile.mimeType)) {
			return (
				<FlowPlayer
					key={flowPlayerKey}
					type="video"
					src={playableUrl as string}
					poster={mediaInfo?.thumbnailUrl || undefined}
					{...shared}
				/>
			);
		}
		// Audio player
		if (playableUrl && FLOWPLAYER_AUDIO_FORMATS.includes(currentPlayableFile.mimeType)) {
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

	const renderIeObjectCards = (
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
						`p-object-detail__metadata-list--${type}`
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
						<div className={styles['p-object-detail__sidebar__content-pill']}>
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
						<div className={styles['p-object-detail__sidebar__content-logo']}>
							{/* TODO remove this hack once we fully switched to the new graph.organisations table */}
							{/* eslint-disable-next-line @next/next/no-img-element */}
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
				<div className={styles['p-object-detail__sidebar__content-maintainer-data']}>
					{maintainerDescription && (
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
		} else {
			return (
				<div className={styles['p-object-detail__sidebar__content-maintainer-data']}>
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
		const metaDataFields = GET_METADATA_FIELDS(
			mediaInfo,
			currentViewableFile,
			simplifiedAltoInfo || null,
			locale,
			publicRuntimeConfig.CLIENT_URL
		).filter(({ data }: MetadataItem): boolean => !!data);
		const rightsStatusInfo = isNewspaper
			? getIeObjectRightsStatusInfo(mediaInfo, locale)
			: null;
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
						<HighlightSearchTerms toHighlight={mediaInfo?.name} />
					</h3>

					{renderMetaDataActions()}

					<MetaDataFieldWithHighlightingAndMaxLength
						title={tText(
							'modules/visitor-space/utils/metadata/metadata___beschrijving'
						)}
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

				<MetadataList disableContainerQuery={false}>
					<Metadata
						title={renderMaintainerMetaTitle(mediaInfo)}
						key={`metadata-maintainer`}
					>
						{renderMaintainerMetaData(mediaInfo)}
					</Metadata>
					{/* other metadata fields */}
					{metaDataFields.map((item: MetadataItem, index: number) => {
						if (isString(item.data)) {
							return (
								<Metadata
									title={item.title}
									key={`metadata-${index}-${item.title}`}
								>
									<MetaDataFieldWithHighlightingAndMaxLength
										title={item.title}
										data={item.data}
										onReadMoreClicked={setSelectedMetadataField}
									/>
								</Metadata>
							);
						} else {
							return (
								<Metadata
									title={item.title}
									key={`metadata-${index}-${item.title}`}
								>
									{item.data}
								</Metadata>
							);
						}
					})}
				</MetadataList>

				<MetadataList disableContainerQuery={true}>
					{isNewspaper && !!fallenNames?.length && (
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
							<NamesList
								names={fallenNames}
								onZoomToLocation={iiifViewerReference.current?.iiifZoomTo}
							/>
						</Metadata>
					)}

					{!!rightsAttributionText && (
						<>
							<Alert
								content={tHtml(
									'modules/ie-objects/object-detail-page___deze-bronvermelding-is-automatisch-gegenereerd-en-kan-fouten-bevatten-a-href-bronvermelding-fouten-meer-info-a'
								)}
							/>
							<Metadata
								title={tHtml(
									'modules/ie-objects/object-detail-page___bronvermelding'
								)}
								key="metadata-source-attribution"
								renderRight={
									<CopyButton text={rightsAttributionText} variants={['white']} />
								}
							>
								<span>{rightsAttributionText}</span>
							</Metadata>
						</>
					)}

					{!!rightsStatusInfo && (
						<Metadata
							title={tHtml('modules/ie-objects/object-detail-page___rechten')}
							className={styles['p-object-detail__metadata-content__rights-status']}
							key="metadata-rights-status"
							renderRight={
								<a target="_blank" href={rightsStatusInfo.link} rel="noreferrer">
									<Button
										variants={['white']}
										icon={<Icon name={IconNamesLight.Extern} />}
									/>
								</a>
							}
						>
							<span className="u-flex u-flex-items-center u-gap-xs">
								{rightsStatusInfo.icon}
								{rightsStatusInfo?.label}
								{rightsStatusInfo?.moreInfo}
							</span>
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
					{!!similar.length && (
						<Metadata
							title={tHtml('pages/slug/ie/index___ook-interessant')}
							key="metadata-keywords"
							className="u-pb-0"
						>
							{renderIeObjectCards('similar', similar)}
						</Metadata>
					)}
				</MetadataList>
			</>
		);
	};

	const renderRelatedObjectsBlade = () => {
		if (!related.length || (!expandSidebar && isMobile)) {
			return null;
		}
		return (
			<CollapsableBlade
				className={clsx('p-object-detail__related')}
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
				renderContent={(hidden: boolean) => renderIeObjectCards('related', related, hidden)}
			/>
		);
	};

	const renderedOcrText = useMemo(() => {
		const searchTermWords = compact(searchTerms.split(' '));
		let searchTermIndex = 0;
		return (
			<div className={styles['p-object-detail__ocr__words-container']}>
				{simplifiedAltoInfo?.text?.map((textLocation, index) => {
					const isMarked: boolean =
						!!searchTerms &&
						searchTermWords.some((searchWord) =>
							textLocation.text.toLowerCase().includes(searchWord)
						);

					// Search results are counted per page, so we need to subtract the amount of results in previous page
					const searchResultsOnPreviousPages: number =
						searchResults?.filter((result) => result.pageIndex < currentPageIndex)
							.length || 0;
					const searchResultIndexWithinCurrentPage: number =
						currentSearchResultIndex - searchResultsOnPreviousPages;
					const isActive: boolean =
						!!searchTerms &&
						isMarked &&
						searchTermIndex === searchResultIndexWithinCurrentPage;

					const wordElement = (
						<span
							key={'ocr-text--' + ieObjectId + '--' + index}
							onClick={() => handleClickOcrWord(textLocation)}
							onDoubleClick={() =>
								setIsOcrEnabled((oldOcrEnabled) => !oldOcrEnabled, 'replaceIn')
							}
							className={clsx(styles['p-object-detail__ocr__word'], {
								[styles['p-object-detail__ocr__word--marked']]: isMarked,
								[styles['p-object-detail__ocr__word--marked--active']]: isActive,
							})}
						>
							{textLocation.text}{' '}
						</span>
					);

					if (isMarked) {
						searchTermIndex += 1;
					}

					return wordElement;
				})}
			</div>
		);
	}, [
		searchTerms,
		simplifiedAltoInfo?.text,
		searchResults,
		currentSearchResultIndex,
		ieObjectId,
		currentPageIndex,
		handleClickOcrWord,
		setIsOcrEnabled,
	]);

	const renderOcrContent = () => {
		return (
			<div className={clsx(styles['p-object-detail__ocr'])}>
				<Alert
					icon={<Icon name={IconNamesLight.Info} aria-hidden />}
					title={tText('modules/ie-objects/object-detail-page___ocr-betrouwbaarheid')}
					content={tHtml(
						'modules/ie-objects/object-detail-page___deze-ocr-kan-fouten-bevatten-a-href-ocr-betrouwbaarheid-info-meer-info-vind-je-hier-a'
					)}
				/>

				{arePagesOcrTextsAvailable && (
					<SearchInputWithResultsPagination
						className={styles['p-object-detail__ocr__search']}
						value={searchTermsTemp}
						onChange={setSearchTermsTemp}
						onSearch={(newSearchTerms) => searchPagesOcrText(newSearchTerms)}
						onClearSearch={handleClearSearch}
						searchResults={searchResults}
						currentSearchIndex={currentSearchResultIndex}
						onChangeSearchIndex={handleChangeSearchIndex}
					/>
				)}

				{renderedOcrText}

				<div className={styles['p-object-detail__ocr__pagination']}>
					<Button
						className={clsx(
							styles['c-iiif-viewer__iiif__controls__button'],
							'c-iiif-viewer__iiif__controls__grid-view__previous-image'
						)}
						iconStart={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
						aria-label={tText(
							'modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding'
						)}
						label={tText('modules/ie-objects/object-detail-page___vorige')}
						variants={['text']}
						onClick={() => {
							setCurrentPageIndex(currentPageIndex - 1);
						}}
						disabled={currentPageIndex === 0}
					/>
					<span className="pagination-info">
						{tText(
							'modules/ie-objects/object-detail-page___pagina-current-page-van-total-pages',
							{
								currentPage: currentPageIndex + 1,
								totalPages: iiifViewerImageInfos?.length || 0,
							}
						)}
					</span>
					<Button
						className={clsx(
							styles['c-iiif-viewer__iiif__controls__button'],
							'c-iiif-viewer__iiif__controls__grid-view__next-image'
						)}
						iconEnd={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
						aria-label={tText(
							'modules/iiif-viewer/iiif-viewer___ga-naar-de-volgende-afbeelding'
						)}
						label={tText('modules/ie-objects/object-detail-page___volgende')}
						variants={['text']}
						onClick={() => {
							setCurrentPageIndex(currentPageIndex + 1);
						}}
						disabled={currentPageIndex === iiifViewerImageInfos.length - 1}
					/>
				</div>
			</div>
		);
	};

	const renderObjectMedia = () => {
		if (mediaType) {
			return (
				<>
					<div className={styles['p-object-detail__media']}>{renderMedia()}</div>
					{showFragmentSlider && (
						<FragmentSlider
							className={styles['p-object-detail__grey-slider-bar']}
							fileRepresentations={representationsToDisplay}
							activeIndex={currentPageIndex}
							setActiveIndex={(index) => setCurrentPageIndex(index, 'replaceIn')}
						/>
					)}
				</>
			);
		}
		return <ObjectPlaceholder {...objectPlaceholder()} />;
	};

	const renderVisitorSpaceNavigationBar = (): ReactNode => {
		if (showVisitorSpaceNavigationBar) {
			return (
				<VisitorSpaceNavigation
					className={styles['p-object-detail__visitor-space-navigation-bar']}
					title={mediaInfo?.maintainerName ?? ''}
					accessEndDate={accessEndDate}
				/>
			);
		}

		return (
			<Button
				className={styles['p-object-detail__back']}
				icon={<Icon name={IconNamesLight.ArrowLeft} aria-hidden />}
				onClick={() => window.history.back()}
				variants={['black']}
			/>
		);
	};

	const renderObjectDetail = () => (
		<>
			<Head>
				<link rel="canonical" href={`https://hetarchief.be/zoeken/${ieObjectId}`} />
			</Head>

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
					[styles['p-object-detail__wrapper--collapsed']]: !expandSidebar,
					[styles['p-object-detail__wrapper--expanded']]: expandSidebar,
					[styles['p-object-detail__wrapper--metadata']]:
						activeTab === ObjectDetailTabs.Metadata,
					[styles['p-object-detail__wrapper--video']]:
						activeTab === ObjectDetailTabs.Media,
					[styles['p-object-detail__wrapper--ocr']]: activeTab === ObjectDetailTabs.Ocr,
				})}
			>
				{/* Visitor space navigation bar */}
				{renderVisitorSpaceNavigationBar()}

				{/* Video audio or newspaper */}
				{renderObjectMedia()}

				{/* Expand button */}
				{mediaType && hasMedia && (
					<Button
						className={clsx(styles['p-object-detail__expand-button'], {
							[styles['p-object-detail__expand-button--collapsed']]: !expandSidebar,
							[styles['p-object-detail__expand-button--expanded']]: expandSidebar,
						})}
						icon={
							<Icon
								name={
									expandSidebar
										? IconNamesLight.ExpandRight
										: IconNamesLight.ExpandLeft
								}
								aria-hidden
							/>
						}
						onClick={handleExpandButtonClicked}
						variants="white"
					/>
				)}

				{/* Tabs */}
				<Tabs
					className={clsx(styles['p-object-detail__tabs'])}
					variants={['dark']}
					tabs={tabs}
					onClick={(tabId) => setActiveTab(tabId as ObjectDetailTabs | null)}
				/>

				{/* Sidebar */}
				<div className={clsx(styles['p-object-detail__sidebar'])}>
					<div
						className={clsx(
							styles['p-object-detail__sidebar__content'],
							styles['p-object-detail__sidebar__content__tab-' + activeTab],
							{
								[styles['p-object-detail__sidebar__content--no-media']]: !mediaType,
							}
						)}
					>
						{activeTab === ObjectDetailTabs.Metadata && renderMetaData()}
						{activeTab === ObjectDetailTabs.Ocr && renderOcrContent()}
					</div>
					{renderRelatedObjectsBlade()}
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
					className={clsx(
						styles['p-object-detail'],
						'p-object-detail--' + mediaInfo.dctermsFormat,
						{
							[styles['p-object-detail__visitor-space-navigation-bar--visible']]:
								showVisitorSpaceNavigationBar,
							[styles['p-object-detail__visitor-space-navigation-bar--hidden']]:
								!showVisitorSpaceNavigationBar,
							[styles['p-object-detail__sidebar--expanded']]: expandSidebar,
							[styles['p-object-detail__sidebar--collapsed']]: !expandSidebar,
						}
					)}
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
