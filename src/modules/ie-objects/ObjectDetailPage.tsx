import {
	Alert,
	Button,
	FlowPlayer,
	type FlowPlayerProps,
	type TabProps,
	Tabs,
} from '@meemoo/react-components';
import clsx from 'clsx';
import type { HTTPError } from 'ky';
import { capitalize, compact, intersection, isNil, kebabCase, lowerCase, noop } from 'lodash-es';
import getConfig from 'next/config';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { parseUrl, stringifyUrl } from 'query-string';
import React, {
	type FC,
	Fragment,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
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
import type { User } from '@auth/types';
import {
	RequestAccessBlade,
	type RequestAccessFormState,
} from '@home/components/RequestAccessBlade';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { CollapsableBlade } from '@ie-objects/components/CollapsableBlade';
import { FragmentSlider } from '@ie-objects/components/FragmentSlider';
import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import Metadata, {
	ObjectDetailPageMetadata,
} from '@ie-objects/components/ObjectDetailPageMetadata/ObjectDetailPageMetadata';
import { ObjectPlaceholder } from '@ie-objects/components/ObjectPlaceholder';
import { type MediaObject, RelatedObject } from '@ie-objects/components/RelatedObject';
import { useGetAltoJsonFileContent } from '@ie-objects/hooks/use-get-alto-json-file-content';
import { useGetIeObjectTicketServiceTokens } from '@ie-objects/hooks/use-get-ie-object-ticket-service-tokens';
import { useGetIeObjectInfo } from '@ie-objects/hooks/use-get-ie-objects-info';
import { useGetIeObjectsRelated } from '@ie-objects/hooks/use-get-ie-objects-related';
import { useGetIeObjectsAlsoInteresting } from '@ie-objects/hooks/use-get-ie-objects-similar';
import { useGetIeObjectsTicketUrl } from '@ie-objects/hooks/use-get-ie-objects-ticket-url';
import { useIsPublicNewspaper } from '@ie-objects/hooks/use-get-is-public-newspaper';
import {
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	IMAGE_API_FORMATS,
	IMAGE_BROWSE_COPY_FORMATS,
	JSON_FORMATS,
	OBJECT_DETAIL_TABS,
	XML_FORMATS,
	getNoLicensePlaceholderLabels,
	getObjectPlaceholderLabels,
	getTicketErrorPlaceholderLabels,
} from '@ie-objects/ie-objects.consts';
import {
	HighlightMode,
	type IeObject,
	IeObjectAccessThrough,
	type IeObjectFile,
	IeObjectLicense,
	type IeObjectPage,
	type IeObjectRepresentation,
	MediaActions,
	ObjectDetailTabs,
	type OcrSearchResult,
	type RelatedIeObject,
} from '@ie-objects/ie-objects.types';
import {
	IE_OBJECTS_SERVICE_EXPORT,
	NEWSPAPERS_SERVICE_BASE_URL,
} from '@ie-objects/services/ie-objects/ie-objects.service.const';
import { getExternalMaterialRequestUrlIfAvailable } from '@ie-objects/utils/get-external-form-url';
import { IiifViewer } from '@iiif-viewer/IiifViewer';
import type { ImageInfo, ImageInfoWithToken, Rect, TextLine } from '@iiif-viewer/IiifViewer.types';
import { SearchInputWithResultsPagination } from '@iiif-viewer/components/SearchInputWithResults/SearchInputWithResultsPagination';
import { MaterialRequestsService } from '@material-requests/services';
import { ErrorNoAccessToObject } from '@shared/components/ErrorNoAccessToObject';
import { ErrorNotFound } from '@shared/components/ErrorNotFound';
import { ErrorSpaceNoLongerActive } from '@shared/components/ErrorSpaceNoLongerActive';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Loading } from '@shared/components/Loading';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SeoTags } from '@shared/components/SeoTags/SeoTags';
import { ROUTES_BY_LOCALE } from '@shared/const';
import {
	HIGHLIGHTED_SEARCH_TERMS_SEPARATOR,
	QUERY_PARAM_KEY,
} from '@shared/const/query-param-keys';
import { convertDurationStringToSeconds } from '@shared/helpers/convert-duration-string-to-seconds';
import { tHtml, tText } from '@shared/helpers/translate';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission, useHasAnyPermission } from '@shared/hooks/has-permission';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { toastService } from '@shared/services/toast-service';
import { setShowAuthModal, setShowZendesk } from '@shared/store/ui';
import { Breakpoints } from '@shared/types';
import { IeObjectType } from '@shared/types/ie-objects';
import type { DefaultSeoInfo } from '@shared/types/seo';
import { asDate, formatMediumDateWithTime, formatSameDayTimeOrDate } from '@shared/utils/dates';
import { useGetActiveVisitRequestForUserAndSpace } from '@visit-requests/hooks/get-active-visit-request-for-user-and-space';
import { VisitorLayout } from '@visitor-layout/index';
import { AddToFolderBlade } from '@visitor-space/components/AddToFolderBlade';
import { MaterialRequestBlade } from '@visitor-space/components/MaterialRequestBlade/MaterialRequestBlade';
import { VisitorSpaceNavigation } from '@visitor-space/components/VisitorSpaceNavigation/VisitorSpaceNavigation';
import { ReportBlade } from '@visitor-space/components/reportBlade';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceStatus } from '@visitor-space/types';

import { useGetIeObjectThumbnail } from '@ie-objects/hooks/use-get-ie-objects-thumbnail';
import {
	iiifGoToHome,
	iiifGoToPage,
	iiifUpdateHighlightedAltoTexts,
	iiifZoomTo,
	iiifZoomToRect,
} from '@iiif-viewer/helpers/trigger-iiif-viewer-events';
import { Blade } from '@shared/components/Blade/Blade';
import { moduleClassSelector } from '@shared/helpers/module-class-locator';
import styles from './ObjectDetailPage.module.scss';

const { publicRuntimeConfig } = getConfig();

export const ObjectDetailPage: FC<DefaultSeoInfo> = ({ title, description, image, url }) => {
	/**
	 * Hooks
	 */
	const router = useRouter();
	const locale = useLocale();
	const dispatch = useDispatch();
	const user: User | null = useSelector(selectUser);
	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();
	const ieObjectId = router.query.ie as string;
	const maintainerSlug = router.query.slug as string;
	const ieObjectNameSlug = router.query.name as string;

	// User types
	const isAnonymous = useHasAnyGroup(GroupName.ANONYMOUS);
	const isKiosk = useHasAnyGroup(GroupName.KIOSK_VISITOR);

	// Permissions
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);

	// Internal state
	const [iiifViewerInitializedPromise, setIiifViewerInitializedPromise] =
		useState<Promise<void> | null>(null);
	const [iiifViewerInitializedPromiseResolve, setIiifViewerInitializedPromiseResolved] = useState<
		(() => void) | null
	>(null);
	const [selectionDownloadUrl, setSelectionDownloadUrl] = useState<string | null>(null);

	/**
	 * Init a promise that resolves when the iiif viewer is ready hooking up event listeners
	 */
	useEffect(() => {
		const promise = new Promise<void>((resolve) => {
			setIiifViewerInitializedPromiseResolved(() => resolve);
		});
		setIiifViewerInitializedPromise(promise);
	}, []);
	const [isMediaPaused, setIsMediaPaused] = useState(true);
	const [hasMediaPlayed, setHasMediaPlayed] = useState(false);
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | null>(null);
	const [similar, setSimilar] = useState<MediaObject[]>([]);
	const [isRelatedObjectsBladeOpen, setIsRelatedObjectsBladeOpen] = useState(false);
	const [hasNewsPaperBeenRendered, setHasNewsPaperBeenRendered] = useState(false);
	const [hasAppliedUrlSearchTerms, setHasAppliedUrlSearchTerms] = useState<boolean>(false);

	// Layout
	useStickyLayout();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();

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

	// Used for going through the pages of a newspaper (iiif viewer reference strip)
	const [currentPageIndex, setCurrentPageIndex] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_PAGE,
		withDefault(NumberParam, 0)
	);

	const [currentSearchResultIndex, setCurrentSearchResultIndex] = useState<number>(-1);
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
	const [isTextOverlayVisible, setIsTextOverlayVisible] = useState(false);
	const [activeTab, setActiveTab] = useState<ObjectDetailTabs>(ObjectDetailTabs.Metadata);

	const [activeMentionHighlights, setActiveMentionHighlights] = useState<{
		pageIndex: number;
		highlights: TextLine[];
	} | null>(null);
	const [activeOcrWord, setActiveOcrWord] = useState<{
		pageIndex: number;
		textLine: TextLine;
	} | null>(null);

	const [highlightMode, setHighlightMode] = useState<HighlightMode>(HighlightMode.OCR_SEARCH);

	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetIeObjectInfo(ieObjectId);

	const { data: thumbnailUrl, isLoading: thumbnailUrlIsLoading } =
		useGetIeObjectThumbnail(ieObjectId);

	const isNoAccessError = (mediaInfoError as HTTPError)?.response?.status === 403;

	const currentPage: IeObjectPage | null = mediaInfo?.pages?.[currentPageIndex] || null;

	const getRepresentationByType = useCallback(
		(mimeTypes: string[]): IeObjectRepresentation | null => {
			return (
				currentPage?.representations?.find((representation) =>
					representation?.files?.find((file) => mimeTypes.includes(file.mimeType))
				) || null
			);
		},
		[currentPage]
	);

	const getFilesByType = useCallback(
		(mimeTypes: string[]): IeObjectFile[] => {
			return (
				getRepresentationByType(mimeTypes)?.files?.filter((file) =>
					mimeTypes.includes(file.mimeType)
				) || []
			);
		},
		[getRepresentationByType]
	);

	// peak file
	const peakFileStoredAt: string | null = getFilesByType(JSON_FORMATS)?.[0]?.storedAt || null;

	// media info
	const { data: peakJson, isLoading: isLoadingPeakFile } = useGetPeakFile(peakFileStoredAt, {
		enabled: mediaInfo?.dctermsFormat === 'audio',
	});

	const representationsToDisplay =
		(mediaInfo?.pages || []).flatMap((page) =>
			page?.representations?.flatMap((representation) =>
				representation.files.filter((file) => FLOWPLAYER_FORMATS.includes(file.mimeType))
			)
		) || [];
	const iiifViewerImageInfos = useMemo((): ImageInfo[] => {
		return compact(
			mediaInfo?.pages?.flatMap((page) => {
				const files = page?.representations?.flatMap((representation) => representation.files);
				const imageApiFile =
					files.find((file) => IMAGE_API_FORMATS.includes(file.mimeType)) ||
					// Delete when https://meemoo.atlassian.net/browse/ARC-3156 is fixed
					files.find((file) => file.storedAt.endsWith('jp2'));
				if (!imageApiFile?.storedAt) {
					return null;
				}
				const imageFile = files.find((file) => IMAGE_BROWSE_COPY_FORMATS.includes(file.mimeType));
				const altoFile = files.find((file) => XML_FORMATS.includes(file.mimeType));
				if (!imageFile?.storedAt) {
					return null;
				}
				return {
					imageUrl: `${imageApiFile.storedAt.replace('https://iiif-qas.meemoo.be/image/3/public', 'https://iiif-qas.meemoo.be/image/3/hetarchief')}`,
					thumbnailUrl: imageFile?.thumbnailUrl,
					altoUrl: altoFile?.storedAt,
				};
			})
		);
	}, [mediaInfo?.pages]);

	// Playable url for flowplayer
	const currentPlayableFile: IeObjectFile | null = getFilesByType(FLOWPLAYER_FORMATS)[0] || null; // First playable file for the currently selected page
	const fileStoredAt: string | null = currentPlayableFile?.storedAt ?? null;
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isFetching: isFetchingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketUrl(fileStoredAt, !!fileStoredAt, () => {
		// Force flowplayer rerender after successful fetch
		setFlowPlayerKey(fileStoredAt);
	});
	const { data: ticketServiceTokensByPath, isLoading: isLoadingTickets } =
		useGetIeObjectTicketServiceTokens(
			iiifViewerImageInfos.map((imageInfo) => imageInfo.imageUrl),
			{
				enabled: iiifViewerImageInfos.length > 0,
			}
		);
	const imageInfosWithTokens = useMemo(
		() =>
			iiifViewerImageInfos.map(
				(imageInfo): ImageInfoWithToken => ({
					...imageInfo,
					// Adding info.json avoids an extra redirect 303
					// But we cannot add it before the ticket was requested
					// The url in the ticket must be a substring of the final image url, otherwise the ticket isn't valid
					imageUrl: `${imageInfo.imageUrl}/info.json`,
					token: ticketServiceTokensByPath?.[imageInfo.imageUrl] || null,
				})
			),
		[iiifViewerImageInfos, ticketServiceTokensByPath]
	);

	// also interesting
	const userHasAccessToMaintainer =
		mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.VISITOR_SPACE_FOLDERS) ||
		mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.VISITOR_SPACE_FULL);
	const { data: similarData } = useGetIeObjectsAlsoInteresting(
		mediaInfo?.schemaIdentifier,
		isKiosk || userHasAccessToMaintainer ? (mediaInfo?.maintainerId ?? '') : '',
		{
			enabled: !!mediaInfo,
		}
	);

	// related
	const { data: relatedIeObjects } = useGetIeObjectsRelated(
		mediaInfo?.iri,
		mediaInfo?.premisIsPartOf || null,
		{
			enabled: !!mediaInfo,
		}
	);

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

	// ocr alto info
	const currentPageAltoUrl = useMemo((): string | null => {
		let altoFileUrl: string | null = null;
		currentPage?.representations?.some((representation: IeObjectRepresentation) => {
			if (representation.schemaTranscriptUrl) {
				altoFileUrl = representation.schemaTranscriptUrl;
				return true; // Found the alto.json file
			}
			return representation?.files?.some((file) => {
				if (XML_FORMATS.includes(file.mimeType)) {
					altoFileUrl = file.storedAt;
					return true; // Found the fallback alto.xml file
				}
				return false; // Did not find any alto files
			});
		});
		return altoFileUrl;
	}, [currentPage]);
	const { data: simplifiedAltoInfo } = useGetAltoJsonFileContent(
		currentPageAltoUrl,
		currentPageIndex
	);

	/**
	 * Computed
	 */
	const hasMedia = (mediaInfo?.pages?.length || 0) > 0;
	const isMediaInfoErrorNotFound = (mediaInfoError as HTTPError)?.response?.status === 404;
	const isMediaInfoErrorNoAccess = (mediaInfoError as HTTPError)?.response?.status === 403;
	const isVisitRequestErrorNotFound =
		(visitRequestError as HTTPError)?.response?.status === 404 ||
		(visitRequestError as HTTPError)?.response?.status === 403;
	const isErrorSpaceNotFound = (visitorSpaceError as HTTPError)?.response?.status === 404;
	const isErrorSpaceNotActive = (visitorSpaceError as HTTPError)?.response?.status === 410;
	const isNewspaper = mediaInfo?.dctermsFormat === IeObjectType.Newspaper;
	const showFragmentSlider = representationsToDisplay.length > 1 && !isNewspaper;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.lg); // mobile and tablet portrait
	const hasAccessToVisitorSpaceOfObject =
		intersection(mediaInfo?.accessThrough, [
			IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
			IeObjectAccessThrough.VISITOR_SPACE_FULL,
		]).length > 0;

	const showVisitButton =
		isNil(mediaInfo?.thumbnailUrl) &&
		mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		visitorSpace?.status === VisitorSpaceStatus.Active &&
		!isKiosk;

	const pageOcrTranscripts: (string | null)[] = useMemo(() => {
		const pageOcrTextsTemp: (string | null)[] = [];
		for (const page of mediaInfo?.pages || []) {
			const pageTranscripts = compact(
				page?.representations?.map((representation) => {
					return representation.schemaTranscript;
				})
			);
			pageOcrTextsTemp.push(pageTranscripts[0]?.toLowerCase() || null);
		}
		return pageOcrTextsTemp;
	}, [mediaInfo?.pages]);

	const searchResults = useMemo((): OcrSearchResult[] => {
		if (!searchTerms) {
			return [];
		}
		const searchResultsTemp: OcrSearchResult[] = [];
		for (const searchTerm of searchTerms.toLowerCase().split(' ')) {
			pageOcrTranscripts.forEach((pageOcrTranscript, pageIndex) => {
				if (!pageOcrTranscript) {
					return; // Skip this page since it doesn't have an ocr transcript
				}
				let searchTermCharacterOffset: number = pageOcrTranscript.indexOf(searchTerm);
				let searchTermIndexOnPage = 0;
				while (searchTermCharacterOffset !== -1) {
					const searchResult: OcrSearchResult = {
						pageIndex,
						searchTerm,
						searchTermCharacterOffset,
						searchTermIndexOnPage,
					};
					searchResultsTemp.push(searchResult);
					searchTermCharacterOffset = pageOcrTranscript?.indexOf(
						searchTerm,
						searchTermCharacterOffset + 1
					);
					searchTermIndexOnPage += 1;
				}
			});
		}
		return searchResultsTemp;
	}, [searchTerms, pageOcrTranscripts]);

	const arePagesOcrTextsAvailable = compact(pageOcrTranscripts).length !== 0;

	const isPublicNewspaper: boolean = useIsPublicNewspaper(mediaInfo);
	// You need the permission or not to be logged in to download the newspaper
	// https://meemoo.atlassian.net/browse/ARC-2617
	const canDownloadNewspaper: boolean =
		(useHasAnyPermission(Permission.DOWNLOAD_OBJECT) || !user) && isPublicNewspaper;

	const getAltoTextsOnCurrentPageForSearchTerms = useCallback((): TextLine[] => {
		const searchTermParts = searchTerms.toLowerCase().split(' ');
		return (
			simplifiedAltoInfo?.altoJsonContent?.text?.filter((altoText) => {
				const lowercaseAltoText = altoText.text.toLowerCase();
				return searchTermParts.some((searchTermWord) => lowercaseAltoText.includes(searchTermWord));
			}) || []
		);
	}, [searchTerms, simplifiedAltoInfo?.altoJsonContent?.text]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	const handleSearch = useCallback(
		async (newSearchTerms: string): Promise<void> => {
			updateActiveTab(ObjectDetailTabs.Ocr);
			setHighlightMode(HighlightMode.OCR_SEARCH);
			if (newSearchTerms === '') {
				// Reset search
				// Zoom to whole page
				iiifGoToHome(iiifViewerInitializedPromise as Promise<void>);
				setSearchTerms('');
				setCurrentSearchResultIndex(-1);
				setActiveMentionHighlights(null);
				updateHighlightsForSearch();
				handleIsTextOverlayVisibleChange(false);
				return;
			}

			if (!pageOcrTranscripts.length) {
				// Only show the error if the user has access to the essence of the newspaper
				// https://meemoo.atlassian.net/browse/ARC-2556
				if (mediaInfo?.thumbnailUrl) {
					toastService.notify({
						maxLines: 3,
						title: tText('modules/ie-objects/object-detail-page___error'),
						description: tText(
							'modules/ie-objects/object-detail-page___deze-krant-heeft-geen-ocr-tekst'
						),
					});
				}
				return;
			}

			setSearchTerms(newSearchTerms.toLowerCase());
			handleIsTextOverlayVisibleChange(true);

			const parsedUrl = parseUrl(window.location.href);
			const newUrl = stringifyUrl({
				url: parsedUrl.url,
				query: {
					...parsedUrl.query,
					[QUERY_PARAM_KEY.ACTIVE_TAB]: ObjectDetailTabs.Ocr,
					[QUERY_PARAM_KEY.IIIF_VIEWER_TEXT_OVERLAY_ENABLED]: true,
				},
			});
			await router.replace(newUrl, undefined, { shallow: true });
		},
		[currentPageIndex, mediaInfo?.thumbnailUrl, pageOcrTranscripts, router]
	);

	const handleIsTextOverlayVisibleChange = useCallback(
		(isVisible: boolean): void => {
			setIsTextOverlayVisible(isVisible);

			// Also update the query param
			// We cannot use the useQueryParam hook here because
			// There seems to be a disconnect between React/NextJS router and the useQueryParam hook
			// Probably because of the hacky way we had to get the use query param hook to work with NextJS
			// See: src/modules/shared/providers/NextQueryParamProvider/NextQueryParamProvider.tsx
			// This could probably be solved by using the latest version of use-query-params and the next-query-params package
			// But that causes build issues with commonJS vs ES modules, so we should update to ESM first
			const parsedUrl = parseUrl(window.location.href);
			const newUrl = stringifyUrl({
				url: parsedUrl.url,
				query: {
					...parsedUrl.query,
					[QUERY_PARAM_KEY.IIIF_VIEWER_TEXT_OVERLAY_ENABLED]: isVisible,
				},
			});
			router.replace(newUrl, undefined, { shallow: true });
		},
		[router]
	);

	// Link activeTab and isOverLayVisible from the query params to the internal state
	// We cannot use the useQueryParam hook here because
	// There seems to be a disconnect between React/NextJS router and the useQueryParam hook
	// Probably because of the hacky way we had to get the use query param hook to work with NextJS
	// See: src/modules/shared/providers/NextQueryParamProvider/NextQueryParamProvider.tsx
	// This could probably be solved by using the latest version of use-query-params and the next-query-params package
	// But that causes build issues with commonJS vs ES modules, so we should update to ESM first
	useEffect(() => {
		const parsedUrl = parseUrl(window.location.href);
		const activeTabFromUrl = parsedUrl.query[QUERY_PARAM_KEY.ACTIVE_TAB];
		const isTextOverlayVisibleFromUrl =
			parsedUrl.query[QUERY_PARAM_KEY.IIIF_VIEWER_TEXT_OVERLAY_ENABLED];
		if (activeTabFromUrl) {
			setActiveTab(activeTabFromUrl as ObjectDetailTabs);
		}
		if (isTextOverlayVisibleFromUrl) {
			setIsTextOverlayVisible(isTextOverlayVisibleFromUrl === 'true');
		}
	}, []);

	const updateActiveTab = useCallback(
		async (newActiveTab: ObjectDetailTabs | null) => {
			setActiveTab(newActiveTab || ObjectDetailTabs.Metadata);

			// Also update the query param
			// We cannot use the useQueryParam hook here because
			// There seems to be a disconnect between React/NextJS router and the useQueryParam hook
			// Probably because of the hacky way we had to get the use query param hook to work with NextJS
			// See: src/modules/shared/providers/NextQueryParamProvider/NextQueryParamProvider.tsx
			// This could probably be solved by using the latest version of use-query-params and the next-query-params package
			// But that causes build issues with commonJS vs ES modules, so we should update to ESM first
			const parsedUrl = parseUrl(window.location.href);
			const newUrl = stringifyUrl({
				url: parsedUrl.url,
				query: {
					...parsedUrl.query,
					[QUERY_PARAM_KEY.ACTIVE_TAB]: newActiveTab,
				},
			});
			await router.replace(newUrl, undefined, { shallow: true });
		},
		[router.replace]
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		console.log(`[PERFORMANCE] ${new Date().toISOString()} detail page loading`);
	}, []);

	useEffect(() => {
		if (mediaInfo) {
			console.log(`[PERFORMANCE] ${new Date().toISOString()} ie object loaded`);
		}
	}, [mediaInfo]);

	/**
	 * When the url doesn't fully match with the loaded ie-object, then we need to do a redirect
	 * Eg:
	 * maintainer was renamed, but the old slug should still work
	 * user goes to: /search/old-slug-maintainer/ie-object-id/ie-object-slug
	 * should be redirected to: /search/new-slug-maintainer/ie-object-id/ie-object-slug
	 *
	 * Eg:
	 * url uses an old v2 schema identifier (eg: 16c7b994da244d4aafedcfa6389f56fcb87f085ddffc4f50a23ae423e5c60b6f6eea738d00fc43b88701d3a4cd22f901)
	 * should be redirected to the new v3 schema identifier (eg: pn8xb19k8t)
	 */
	useEffect(() => {
		if (
			(ieObjectId && mediaInfo?.schemaIdentifier && ieObjectId !== mediaInfo?.schemaIdentifier) ||
			(mediaInfo?.maintainerSlug && maintainerSlug && mediaInfo?.maintainerSlug !== maintainerSlug)
		) {
			// The user is loading a url with the old ie-object schema identifier v2 (eg: 16c7b994da244d4aafedcfa6389f56fcb87f085ddffc4f50a23ae423e5c60b6f6eea738d00fc43b88701d3a4cd22f901)
			// OR
			// Maintainer was renamed and the user is loading an url with the old maintainer slug
			// =>
			// Redirect to the new maintainer slug
			// https://meemoo.atlassian.net/browse/ARC-2678
			const newPath = router.asPath
				.replace(`/${ieObjectId}/`, `/${mediaInfo?.schemaIdentifier}/`)
				.replace(`/${maintainerSlug}/`, `/${mediaInfo?.maintainerSlug}/`)
				.replace(`/${ieObjectNameSlug}`, `/${kebabCase(mediaInfo?.name || '')}`);
			router.replace(newPath, undefined, { shallow: true });
		}
	}, [
		mediaInfo,
		maintainerSlug,
		ieObjectId,
		ieObjectNameSlug,
		router.replace,
		router.asPath.replace,
	]);

	/**
	 * Recalculate the green highlights in the IIIF viewer to reflect the latest changes to the last highlighted fallen soldier name (mention)
	 */
	const updateHighlightsForMentionName = useCallback(async () => {
		if (highlightMode !== HighlightMode.MENTION_NAME) {
			return;
		}
		if (!iiifViewerInitializedPromise) {
			return;
		}
		await iiifViewerInitializedPromise;
		if (activeMentionHighlights?.pageIndex === currentPageIndex) {
			// Only update the highlights if the active mention is on the current page
			iiifUpdateHighlightedAltoTexts(
				iiifViewerInitializedPromise as Promise<void>,
				activeMentionHighlights?.highlights,
				null,
				false
			);
		} else {
			// If the active mention is not on the current page, remove the highlights
			iiifUpdateHighlightedAltoTexts(
				iiifViewerInitializedPromise as Promise<void>,
				[],
				null,
				false
			);
		}
	}, [
		highlightMode,
		currentPageIndex,
		activeMentionHighlights?.highlights,
		activeMentionHighlights?.pageIndex,
		iiifViewerInitializedPromise,
	]);
	useEffect(() => {
		updateHighlightsForMentionName();
	}, [updateHighlightsForMentionName]);

	/**
	 * Recalculate the green highlights in the IIIF viewer to reflect the latest click on an ocr word
	 */
	const updateHighlightsForOcrWord = useCallback(async () => {
		if (highlightMode !== HighlightMode.OCR_WORD) {
			return;
		}
		if (!iiifViewerInitializedPromise) {
			return;
		}
		await iiifViewerInitializedPromise;
		if (activeOcrWord?.pageIndex === currentPageIndex) {
			// Only update the highlights if the active ocr word is on the current page
			iiifUpdateHighlightedAltoTexts(
				iiifViewerInitializedPromise as Promise<void>,
				[activeOcrWord?.textLine],
				null,
				false
			);
		} else {
			// If the active ocr word is not on the current page or null, remove the highlights
			iiifUpdateHighlightedAltoTexts(
				iiifViewerInitializedPromise as Promise<void>,
				[],
				null,
				false
			);
		}
	}, [
		highlightMode,
		currentPageIndex,
		activeOcrWord?.textLine,
		activeOcrWord?.pageIndex,
		iiifViewerInitializedPromise,
	]);
	useEffect(() => {
		updateHighlightsForOcrWord();
	}, [updateHighlightsForOcrWord]);

	/**
	 * Recalculate the green highlights in the IIIF viewer to reflect the latest changes to the OCR search terms
	 */
	const updateHighlightsForSearch = useCallback(async () => {
		if (highlightMode !== HighlightMode.OCR_SEARCH) {
			return;
		}
		if (!iiifViewerInitializedPromise) {
			return;
		}
		await iiifViewerInitializedPromise;
		if (!searchResults || searchResults.length === 0) {
			iiifUpdateHighlightedAltoTexts(
				iiifViewerInitializedPromise as Promise<void>,
				[],
				null,
				false
			);
			return;
		}
		const currentSearchResult = searchResults[currentSearchResultIndex];
		if (!currentSearchResult) {
			return;
		}
		if (currentSearchResult.pageIndex !== currentPageIndex) {
			// Do not update the highlights if we first need to switch pages before highlighting and zooming to a search result on an other page
			return;
		}
		if (simplifiedAltoInfo?.pageIndex !== currentPageIndex) {
			// If the simplifiedAltoJson is still loaded from the previous page, we need to wait for it to be loaded before updating the highlights
			return;
		}
		const highlights: TextLine[] = getAltoTextsOnCurrentPageForSearchTerms();
		let currentHighlightedAltoText: TextLine | null = null;
		if (!isNil(currentSearchResultIndex) && !isNil(currentSearchResult?.searchTermIndexOnPage)) {
			// Only update the current search result if it is available during search
			// It is not available when highlighting a name of a person
			const searchTermIndexOnPage = currentSearchResult.searchTermIndexOnPage as number;
			currentHighlightedAltoText = highlights[searchTermIndexOnPage] || null;

			if (!currentHighlightedAltoText) {
				console.error('Could not find currentHighlightedAltoText', {
					searchResults,
				});
			}
		}

		if (isTextOverlayVisible) {
			iiifUpdateHighlightedAltoTexts(
				iiifViewerInitializedPromise as Promise<void>,
				highlights,
				currentHighlightedAltoText,
				true
			);
		} else {
			iiifUpdateHighlightedAltoTexts(
				iiifViewerInitializedPromise as Promise<void>,
				[],
				null,
				false
			);
		}
	}, [
		highlightMode,
		currentSearchResultIndex,
		searchResults,
		getAltoTextsOnCurrentPageForSearchTerms,
		isTextOverlayVisible,
		iiifViewerInitializedPromise,
		currentPageIndex,
		simplifiedAltoInfo?.pageIndex,
	]);
	useEffect(() => {
		updateHighlightsForSearch();
	}, [updateHighlightsForSearch]);

	/**
	 * When the search results change, we want to set the current search result index to the first result on the current page
	 */
	useEffect(() => {
		// Only change the current search result index if there are search results and the current search result index is not set
		if (searchResults.length > 0 && currentSearchResultIndex === -1) {
			const firstSearchResultOnCurrentPage = searchResults.find(
				(result) => result.pageIndex === currentPageIndex
			);
			if (firstSearchResultOnCurrentPage) {
				// Set the current search result index to the first result on the current page
				setCurrentSearchResultIndex(searchResults.indexOf(firstSearchResultOnCurrentPage));
			} else {
				// Go to the first page that has a search result and show the first search result on that page
				const firstSearchResult = searchResults[0];
				if (currentPageIndex !== firstSearchResult.pageIndex) {
					setCurrentPageIndex(firstSearchResult.pageIndex, 'replaceIn');
				}
				setCurrentSearchResultIndex(0);
			}
		}
	}, [searchResults, currentPageIndex, setCurrentPageIndex, currentSearchResultIndex]);

	/**
	 * When the page loads, search the ocr texts for the searchTerms in the query params in the url
	 */
	useEffect(() => {
		if (
			highlightedSearchTerms &&
			isNewspaper &&
			!hasAppliedUrlSearchTerms &&
			simplifiedAltoInfo?.altoJsonContent
		) {
			const newSearchTerms: string = highlightedSearchTerms
				.split(HIGHLIGHTED_SEARCH_TERMS_SEPARATOR)
				.join(' ');
			setSearchTermsTemp(newSearchTerms);
			setSearchTerms(newSearchTerms);
			handleSearch(newSearchTerms);
			handleIsTextOverlayVisibleChange(true);
			setHasAppliedUrlSearchTerms(true);
		}
	}, [
		isNewspaper,
		hasAppliedUrlSearchTerms,
		handleSearch,
		highlightedSearchTerms,
		handleIsTextOverlayVisibleChange,
		simplifiedAltoInfo?.altoJsonContent,
	]);

	/**
	 * Scroll to active search result in ocr tab when the current search result index changes
	 */
	const scrollActiveSearchWordIntoView = useCallback(() => {
		const activeSearchResultElem = document.querySelector(
			moduleClassSelector('p-object-detail__ocr__word--marked--active')
		) as HTMLSpanElement | null;
		const scrollable = document.querySelector(
			moduleClassSelector('p-object-detail__ocr__words-container')
		);

		// If word was not found, try again in 100ms
		if (!activeSearchResultElem && currentSearchResultIndex !== -1) {
			setTimeout(() => {
				scrollActiveSearchWordIntoView();
			}, 100);
			return;
		}

		// Location of the word inside the scrollable container minus a margin to make sure it's about in the center of the screen
		const scrollTopWord = Math.max(
			0,
			(activeSearchResultElem?.offsetTop || 0) - (scrollable?.clientHeight || 300)
		);
		// We don't use scrollIntoView because it causes scrolling on the whole page
		// https://meemoo.atlassian.net/browse/ARC-3020
		scrollable?.scrollTo({
			top: scrollTopWord,
		});
	}, [currentSearchResultIndex]);

	/**
	 * In the ocr tab, when a user searches for a word
	 * We want to scroll into view the first word that is found in the ocr text
	 */
	useEffect(() => {
		iiifViewerInitializedPromise?.then(() => {
			scrollActiveSearchWordIntoView();
		});
	}, [iiifViewerInitializedPromise, scrollActiveSearchWordIntoView]);

	/**
	 * Hide the zendesk button for
	 * - kiosk users
	 * - users with access to the visitor space of the object
	 * - when the metadata tab is not active (otherwise it overlaps with the ocr next page button)
	 */
	useEffect(() => {
		dispatch(
			setShowZendesk(
				!isKiosk && !hasAccessToVisitorSpaceOfObject && activeTab === ObjectDetailTabs.Metadata
			)
		);
	}, [dispatch, hasAccessToVisitorSpaceOfObject, isKiosk, activeTab]);

	/**
	 * Trigger events for viewing the ie object
	 */
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

	/**
	 * Pause media if metadata tab is shown on mobile
	 */
	useEffect(() => {
		if (isMobile && activeTab === ObjectDetailTabs.Metadata) {
			setIsMediaPaused(true);
		}
	}, [activeTab, isMobile]);

	/**
	 * Set the media type and default tab when the media info is loaded
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		// Set default view
		if (isMobile) {
			// Default to metadata tab on mobile
			updateActiveTab(ObjectDetailTabs.Metadata);
		} else {
			// Check media content and license for default tab on desktop
			setExpandSidebar(!mediaInfo?.dctermsFormat || !hasMedia, 'replaceIn');
		}
	}, [mediaInfo]);

	/**
	 * Set the similar ie objects mapped data when the similar items change from the api request
	 */
	useEffect(() => {
		similarData && setSimilar(mapSimilarData(similarData?.items));
	}, [similarData]);

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

	const mapRelatedIeObject = (
		ieObject: Partial<RelatedIeObject> | undefined | null
	): MediaObject | null => {
		if (!ieObject) {
			return null;
		}
		const date = ieObject.datePublished ?? ieObject.dateCreated ?? null;

		return {
			type: ieObject.dctermsFormat as IeObjectType,
			title: ieObject.name as string,
			subtitle: isNil(date)
				? `${ieObject?.maintainerName ?? ''}`
				: `${ieObject?.maintainerName ?? ''} (${date})`,
			description: ieObject.description as string,
			id: ieObject.schemaIdentifier as string,
			maintainer_id: ieObject.maintainerId,
			thumbnail: ieObject.thumbnailUrl,
		};
	};

	const getMappedRelatedIeObjects = (): MediaObject[] => {
		if (relatedIeObjects?.parent) {
			return [mapRelatedIeObject(relatedIeObjects.parent) as MediaObject];
		}
		return compact(relatedIeObjects?.children?.map(mapRelatedIeObject) || []);
	};

	/**
	 * Callbacks
	 */
	const handleExpandButtonClicked = () => {
		setExpandSidebar(!expandSidebar, 'replaceIn');
	};

	const onCloseBlade = () => {
		setActiveBlade(null, 'replaceIn');
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
			setActiveBlade(MediaActions.RequestAccess, 'replaceIn');
		} else {
			// Open the login blade first
			setShowAuthQueryKey('1', 'replaceIn');
			setActiveBlade(MediaActions.RequestAccess, 'replaceIn');
		}
	};

	const onClickAction = async (id: MediaActions) => {
		switch (id) {
			case MediaActions.Bookmark:
				if (canManageFolders) {
					setActiveBlade(MediaActions.Bookmark, 'replaceIn');
				}

				if (isAnonymous) {
					dispatch(setShowAuthModal(true));
				}
				break;
			case MediaActions.Report:
				setActiveBlade(MediaActions.Report, 'replaceIn');
				break;
			case MediaActions.RequestAccess:
				openRequestAccessBlade();
				break;
			case MediaActions.RequestMaterial:
				await onRequestMaterialClick();
				break;
		}
	};

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
			materialRequests?.items?.find(
				(request) => request.objectSchemaIdentifier === mediaInfo?.schemaIdentifier
			)
		) {
			onDuplicateRequest();
			return;
		}

		const externalFormUrl = getExternalMaterialRequestUrlIfAvailable(mediaInfo, isAnonymous, user);
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
			setActiveBlade(MediaActions.RequestMaterial, 'replaceIn');
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
						EventsService.triggerEvent(LogEventType.BEZOEK_ITEM_PLAY, path, eventData).then(noop);
					} else {
						EventsService.triggerEvent(LogEventType.ITEM_PLAY, path, eventData).then(noop);
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
				ROUTES_BY_LOCALE[locale].visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
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
				console.log('updating page index to ', searchResult.pageIndex);
				setCurrentPageIndex(searchResult.pageIndex, 'replaceIn');
			}
		},
		[searchResults, currentPageIndex, setCurrentPageIndex]
	);

	const handleClearSearch = () => {
		setSearchTermsTemp('');
		setSearchTerms('');
		setHighlightedSearchTerms('', 'replaceIn');
		setCurrentSearchResultIndex(-1);
		handleIsTextOverlayVisibleChange(false);
	};

	const handleClickOnOcrWord = useCallback(
		(textLocation: TextLine) => {
			if (textLocation) {
				iiifZoomToRect(iiifViewerInitializedPromise as Promise<void>, textLocation);
				setHighlightMode(HighlightMode.OCR_WORD);
				setActiveOcrWord({
					pageIndex: currentPageIndex,
					textLine: textLocation,
				});
				setIsTextOverlayVisible(true);
			}
		},
		[iiifViewerInitializedPromise, currentPageIndex]
	);

	/**
	 * Content
	 */

	const isMediaAvailable = useCallback((): boolean => {
		switch (mediaInfo?.dctermsFormat) {
			case IeObjectType.Audio:
			case IeObjectType.AudioFragment:
			case IeObjectType.Video:
			case IeObjectType.VideoFragment:
			case IeObjectType.Film:
				return !isErrorPlayableUrl && !!playableUrl && !!currentPlayableFile;

			case IeObjectType.Newspaper: {
				return !!getFilesByType(IMAGE_API_FORMATS)?.[0]?.storedAt;
			}

			default:
				return false;
		}
	}, [
		mediaInfo?.dctermsFormat,
		isErrorPlayableUrl,
		playableUrl,
		currentPlayableFile,
		getFilesByType,
	]);

	const tabs: TabProps[] = useMemo(() => {
		return OBJECT_DETAIL_TABS(
			mediaInfo?.dctermsFormat || null,
			activeTab as ObjectDetailTabs,
			isMediaAvailable(),
			arePagesOcrTextsAvailable
		);
	}, [mediaInfo?.dctermsFormat, activeTab, isMediaAvailable, arePagesOcrTextsAvailable]);

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

	const handleIiifViewerSelection = useCallback(
		(rect: Rect, pageIndex: number) => {
			const downloadUrl = stringifyUrl({
				url: `${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${ieObjectId}/${IE_OBJECTS_SERVICE_EXPORT}/jpg/selection`,
				query: {
					page: pageIndex,
					startX: Math.floor(rect.x),
					startY: Math.floor(rect.y),
					width: Math.ceil(rect.width),
					height: Math.ceil(rect.height),
					currentPageUrl: window.origin + router.asPath,
				},
			});
			// Download the file and save it
			// const win = window.open(downloadUrl, '_blank');
			// if (!win) {
			// iPad doesn't want to open a page from javascript without a click event?
			// Show popup with download link
			setSelectionDownloadUrl(downloadUrl);
			// }
		},
		[ieObjectId, router.asPath]
	);

	/**
	 * Update react state in response to changes to the IIIF viewer page index
	 * @param newPageIndex the new page index
	 */
	const handleActiveImageIndexChange = (newPageIndex: number): void => {
		setCurrentPageIndex(newPageIndex, 'replaceIn');
	};

	/**
	 * When the user wants to switch to a specific page
	 * This is for instance used when they click a "zoom to mention" of a fallen soldier, but the mention is on a different page
	 * @param newPageIndex
	 */
	const handleSetCurrentPage = (newPageIndex: number): void => {
		iiifGoToPage(iiifViewerInitializedPromise as Promise<void>, newPageIndex);
	};

	/**
	 * Update react state in response to changes to the IIIF viewer page index
	 * @param newPageIndex the new page index
	 */
	const handleOnPageChanged = (newPageIndex: number): void => {
		if (currentPageIndex !== newPageIndex) {
			setCurrentPageIndex(newPageIndex, 'replaceIn');
		}
	};

	const handleSetActiveMentionHighlights = (mentionHighlights: {
		pageIndex: number;
		highlights: TextLine[];
	}) => {
		setActiveMentionHighlights(mentionHighlights);
		setHighlightMode(HighlightMode.MENTION_NAME);
		setSearchTerms('');
		setCurrentSearchResultIndex(-1);
	};

	/**
	 * Render
	 */

	const renderMedia = (): ReactNode => {
		if (
			(!isNewspaper && isLoadingPlayableUrl) ||
			(isNewspaper && Object.keys(imageInfosWithTokens).length === 0) ||
			!mediaInfo
		) {
			return <Loading fullscreen owner="object detail page: render media" mode="light" />;
		}

		// IIIF viewer
		if (isNewspaper && !!mediaInfo && mediaInfo.pages?.length) {
			if (!hasNewsPaperBeenRendered) {
				handleOnPlay();
				setHasNewsPaperBeenRendered(true);
			}
			if (isLoadingTickets) {
				return <Loading owner="iiifviewer-tickets" fullscreen={true} mode="light" />;
			}
			return (
				<IiifViewer
					imageInfosWithTokens={imageInfosWithTokens}
					id={mediaInfo?.schemaIdentifier as string}
					isTextOverlayVisible={isTextOverlayVisible || false}
					setIsTextOverlayVisible={handleIsTextOverlayVisibleChange}
					activeImageIndex={currentPageIndex}
					setActiveImageIndex={handleActiveImageIndexChange}
					initialFocusX={iiifViewerFocusX}
					initialFocusY={iiifViewerFocusY}
					initialZoomLevel={iiifViewerZoomLevel}
					isSearchEnabled={arePagesOcrTextsAvailable}
					searchTerms={searchTermsTemp}
					setSearchTerms={setSearchTermsTemp}
					onSearch={handleSearch}
					onClearSearch={handleClearSearch}
					currentSearchIndex={currentSearchResultIndex || 0}
					searchResults={searchTerms ? searchResults : null}
					setSearchResultIndex={handleChangeSearchIndex}
					onSelection={handleIiifViewerSelection}
					enableSelection={canDownloadNewspaper}
					onInitialized={() => {
						iiifViewerInitializedPromiseResolve?.();
					}}
					onPageChanged={handleOnPageChanged}
				/>
			);
		}

		if (isErrorPlayableUrl) {
			return (
				<ObjectPlaceholder
					{...getTicketErrorPlaceholderLabels()}
					addSliderPadding={showFragmentSlider}
				/>
			);
		}

		// https://meemoo.atlassian.net/browse/ARC-2508
		if ((!playableUrl || !currentPlayableFile || !mediaInfo?.pages?.length) && !isMobile) {
			return (
				<ObjectPlaceholder
					{...getNoLicensePlaceholderLabels()}
					onOpenRequestAccess={showVisitButton ? openRequestAccessBlade : undefined}
					addSliderPadding={showFragmentSlider}
				/>
			);
		}

		const playableRepresentation = getRepresentationByType(FLOWPLAYER_FORMATS);
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
			start: playableRepresentation?.schemaStartTime
				? convertDurationStringToSeconds(playableRepresentation?.schemaStartTime)
				: undefined,
			end: playableRepresentation?.schemaEndTime
				? convertDurationStringToSeconds(playableRepresentation?.schemaEndTime)
				: undefined,
		};

		// Flowplayer
		if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(currentPlayableFile.mimeType)) {
			if (isFetchingPlayableUrl) {
				return <Loading fullscreen owner="object detail page: render video" mode="light" />;
			}
			return (
				<FlowPlayer
					key={`${flowPlayerKey}__${currentPageIndex}`}
					type="video"
					src={playableUrl as string}
					poster={mediaInfo?.thumbnailUrl || undefined}
					renderLoader={() => <Loading owner="flowplayer suspense" fullscreen mode="light" />}
					{...shared}
				/>
			);
		}
		// Audio player
		if (playableUrl && FLOWPLAYER_AUDIO_FORMATS.includes(currentPlayableFile.mimeType)) {
			if (peakFileStoredAt && isLoadingPeakFile) {
				return (
					<Loading
						fullscreen
						owner="object detail page: render media audio peak file"
						mode="light"
					/>
				);
			}
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
					waveformData={peakJson?.data || undefined}
					{...shared}
				/>
			);
		}
	};

	// Metadata
	const renderCard = (item: MediaObject, isHidden: boolean) => (
		<li>
			<Link
				passHref
				href={`${ROUTES_BY_LOCALE[locale].search}/${router.query.slug}/${item.id}`}
				tabIndex={isHidden ? -1 : 0}
				className={clsx(styles['p-object-detail__metadata-card-link'], 'u-text-no-decoration')}
				aria-label={item.title}
			>
				<RelatedObject object={item} />
			</Link>
		</li>
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

	const renderCollapsableBladeTitle = (mappedRelatedIeObjects: MediaObject[]) => {
		if (relatedIeObjects?.parent) {
			return tHtml(
				'modules/ie-objects/object-detail-page___dit-object-is-onderdeel-van-dit-hoofdobject'
			);
		}
		if (mappedRelatedIeObjects.length === 1) {
			return tHtml('modules/ie-objects/object-detail-page___dit-object-heeft-1-fragment');
		}
		return tHtml('modules/ie-objects/object-detail-page___dit-object-heeft-amount-fragmenten', {
			amount: mappedRelatedIeObjects.length,
		});
	};

	const renderRelatedObjectsBlade = () => {
		const mappedRelatedIeObjects = getMappedRelatedIeObjects();
		if (!mappedRelatedIeObjects.length || (!expandSidebar && isMobile)) {
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
				title={renderCollapsableBladeTitle(mappedRelatedIeObjects)}
				renderContent={(hidden: boolean) =>
					renderIeObjectCards('related', mappedRelatedIeObjects, hidden)
				}
			/>
		);
	};

	const renderedOcrText = useMemo(() => {
		const searchTermWords = compact(searchTerms.split(' '));
		let searchTermIndex = 0;
		return (
			<div className={styles['p-object-detail__ocr__words-container']}>
				{simplifiedAltoInfo?.altoJsonContent?.text?.map((textLocation, textIndex) => {
					const isMarked: boolean =
						!!searchTerms &&
						searchTermWords.some((searchWord) =>
							textLocation.text.toLowerCase().includes(searchWord)
						);

					// Search results are counted per page, so we need to subtract the amount of results in previous page
					const searchResultsOnPreviousPages: number =
						searchResults?.filter((result) => result.pageIndex < currentPageIndex).length || 0;
					const searchResultIndexWithinCurrentPage: number =
						(currentSearchResultIndex || 0) - searchResultsOnPreviousPages;
					const isActive: boolean =
						!!searchTerms && isMarked && searchTermIndex === searchResultIndexWithinCurrentPage;

					const wordElement = (
						<span
							key={`ocr-text--${ieObjectId}--${currentPageIndex}--${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								textIndex
							}`}
							onClick={() => handleClickOnOcrWord(textLocation)}
							onKeyUp={(evt) => {
								if (evt.key === 'Enter') {
									handleClickOnOcrWord(textLocation);
								}
							}}
							onDoubleClick={() => handleIsTextOverlayVisibleChange(!isTextOverlayVisible)}
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
		simplifiedAltoInfo?.altoJsonContent?.text,
		searchResults,
		currentSearchResultIndex,
		ieObjectId,
		currentPageIndex,
		handleIsTextOverlayVisibleChange,
		handleClickOnOcrWord,
		isTextOverlayVisible,
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
						onSearch={(newSearchTerms) => handleSearch(newSearchTerms)}
						onClearSearch={handleClearSearch}
						searchResults={searchTerms ? searchResults : null}
						currentSearchIndex={currentSearchResultIndex || 0}
						onChangeSearchIndex={handleChangeSearchIndex}
					/>
				)}

				{renderedOcrText}

				<div className={styles['p-object-detail__ocr__pagination']}>
					<Button
						className={clsx(styles['p-object-detail__ocr__pagination__button'], {
							[styles['p-object-detail__ocr__pagination__button--active']]: currentPageIndex > 0,
						})}
						iconStart={<Icon name={IconNamesLight.AngleLeft} aria-hidden />}
						aria-label={tText('modules/iiif-viewer/iiif-viewer___ga-naar-de-vorige-afbeelding')}
						label={tText('modules/ie-objects/object-detail-page___vorige')}
						variants={['text']}
						onClick={() => {
							setCurrentPageIndex(currentPageIndex - 1, 'replaceIn');
						}}
						disabled={currentPageIndex === 0}
					/>
					<span className="pagination-info">
						{tText('modules/ie-objects/object-detail-page___pagina-current-page-van-total-pages', {
							currentPage: currentPageIndex + 1,
							totalPages: iiifViewerImageInfos?.length || 1,
						})}
					</span>
					<Button
						className={clsx(styles['p-object-detail__ocr__pagination__button'], {
							[styles['p-object-detail__ocr__pagination__button--active']]:
								currentPageIndex < iiifViewerImageInfos.length - 1,
						})}
						iconEnd={<Icon name={IconNamesLight.AngleRight} aria-hidden />}
						aria-label={tText('modules/iiif-viewer/iiif-viewer___ga-naar-de-volgende-afbeelding')}
						label={tText('modules/ie-objects/object-detail-page___volgende')}
						variants={['text']}
						onClick={() => {
							setCurrentPageIndex(currentPageIndex + 1, 'replaceIn');
						}}
						disabled={currentPageIndex === iiifViewerImageInfos.length - 1}
					/>
				</div>
			</div>
		);
	};

	const renderObjectMedia = () => {
		if (mediaInfo?.thumbnailUrl) {
			return (
				<>
					<div
						className={styles['p-object-detail__media']}
						style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : {}}
					>
						{renderMedia()}
					</div>
					{showFragmentSlider && (
						<FragmentSlider
							className={styles['p-object-detail__grey-slider-bar']}
							fileRepresentations={representationsToDisplay}
							activeIndex={currentPageIndex}
							setActiveIndex={(index) => {
								setCurrentPageIndex(index, 'replaceIn');
							}}
						/>
					)}
				</>
			);
		}
		return (
			<ObjectPlaceholder
				{...getObjectPlaceholderLabels()}
				reasonDescription={tText(
					'modules/ie-objects/object-detail-page___je-hebt-enkel-toegang-tot-de-metadata-van-dit-object-omdat-dit-object-niet-publiek-beschikbaar-is-volgens-de-licenties-van-de-auteur'
				)}
				className={styles['p-object-detail__media--not-available']}
				onOpenRequestAccess={showVisitButton ? openRequestAccessBlade : undefined}
			/>
		);
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
				onClick={() => {
					router.back();
				}}
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
				<RedFormWarning
					error={tHtml(
						'pages/bezoekersruimte/visitor-space-slug/object-id/index___er-ging-iets-mis-bij-het-ophalen-van-de-data'
					)}
				/>
			)}
			<article
				className={clsx(styles['p-object-detail__wrapper'], {
					[styles['p-object-detail--hidden']]: mediaInfoIsLoading || mediaInfoIsError,
					[styles['p-object-detail__wrapper--collapsed']]: !expandSidebar,
					[styles['p-object-detail__wrapper--expanded']]: expandSidebar,
					[styles['p-object-detail__wrapper--no-media-available']]: !isMediaAvailable(),
					[styles['p-object-detail__wrapper--media-available']]: isMediaAvailable(),
					[styles['p-object-detail__wrapper--no-ocr-available']]: !arePagesOcrTextsAvailable,
					[styles['p-object-detail__wrapper--ocr-available']]: arePagesOcrTextsAvailable,
					[styles['p-object-detail__wrapper--metadata']]: activeTab === ObjectDetailTabs.Metadata,
					[styles['p-object-detail__wrapper--video']]: activeTab === ObjectDetailTabs.Media,
					[styles['p-object-detail__wrapper--ocr']]: activeTab === ObjectDetailTabs.Ocr,
				})}
			>
				{/* Visitor space navigation bar */}
				{renderVisitorSpaceNavigationBar()}

				{/* Video audio or newspaper */}
				{!isMobile && renderObjectMedia()}

				{/* Expand button */}
				{mediaInfo?.dctermsFormat && hasMedia && (
					<Button
						className={clsx(styles['p-object-detail__expand-button'], {
							[styles['p-object-detail__expand-button--collapsed']]: !expandSidebar,
							[styles['p-object-detail__expand-button--expanded']]: expandSidebar,
						})}
						icon={
							<Icon
								name={expandSidebar ? IconNamesLight.ExpandRight : IconNamesLight.ExpandLeft}
								aria-hidden
							/>
						}
						onClick={handleExpandButtonClicked}
						variants="white"
						title={tText('modules/ie-objects/object-detail-page___hover-expand-knop')}
						aria-label={tText('modules/ie-objects/object-detail-page___expand-knop')}
					/>
				)}

				{/* Tabs */}
				<Tabs
					className={clsx(styles['p-object-detail__tabs'])}
					variants={['dark']}
					tabs={tabs}
					onClick={(tabId) => updateActiveTab(tabId as ObjectDetailTabs | null)}
				/>

				{/* Sidebar */}
				<div className={clsx(styles['p-object-detail__sidebar'])}>
					<div
						className={clsx(
							styles['p-object-detail__sidebar__content'],
							styles[`p-object-detail__sidebar__content__tab-${activeTab}`],
							{
								[styles['p-object-detail__sidebar__content--no-media']]: !mediaInfo?.dctermsFormat,
							}
						)}
					>
						{/*
						 * IeObject metadata
						 */}
						{activeTab === ObjectDetailTabs.Metadata && (
							<ObjectDetailPageMetadata
								onClickAction={onClickAction}
								mediaInfo={mediaInfo}
								openRequestAccessBlade={openRequestAccessBlade}
								visitRequest={visitRequest || null}
								showVisitButton={showVisitButton || false}
								hasAccessToVisitorSpaceOfObject={hasAccessToVisitorSpaceOfObject}
								currentPageIndex={currentPageIndex}
								goToPage={handleSetCurrentPage}
								currentPage={currentPage}
								activeFile={
									getFilesByType([...FLOWPLAYER_FORMATS, ...IMAGE_API_FORMATS])?.[
										currentPageIndex
									] || null
								}
								simplifiedAltoInfo={simplifiedAltoInfo?.altoJsonContent || null}
								iiifZoomTo={(x: number, y: number) =>
									iiifZoomTo(iiifViewerInitializedPromise as Promise<void>, x, y)
								}
								setActiveMentionHighlights={handleSetActiveMentionHighlights}
								setIsTextOverlayVisible={setIsTextOverlayVisible}
							/>
						)}
						{activeTab === ObjectDetailTabs.Metadata && !!similar.length && (
							<MetadataList allowTwoColumns={false}>
								<Metadata
									title={tHtml('pages/slug/ie/index___ook-interessant')}
									key="metadata-keywords"
									className="u-pb-0"
								>
									{renderIeObjectCards('similar', similar)}
								</Metadata>
							</MetadataList>
						)}

						{activeTab === ObjectDetailTabs.Media && isMobile && renderObjectMedia()}
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
					objectSchemaIdentifier={mediaInfo?.schemaIdentifier}
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
				onClose={() => setActiveBlade(null, 'replaceIn')}
				onSubmit={onRequestAccessSubmit}
				id="object-detail-page__request-access-blade"
			/>
			<Blade
				id="iiif-selection-download-url"
				isOpen={!!selectionDownloadUrl}
				renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
					<h2 {...props}>{tHtml('modules/ie-objects/object-detail-page___selectie-is-klaar')}</h2>
				)}
				footer={
					<div className="u-px-32 u-px-16-md u-py-24 u-py-16-md u-flex u-flex-col u-gap-xs">
						<a
							href={selectionDownloadUrl || undefined}
							onClick={() => {
								setTimeout(() => {
									setSelectionDownloadUrl(null);
								}, 100);
							}}
							rel="noreferrer"
						>
							<Button
								label={tText('modules/ie-objects/object-detail-page___download-selection')}
								variants={['block', 'black']}
							/>
						</a>
					</div>
				}
			>
				<div className="u-px-32 u-px-16-md">
					{tHtml(
						'modules/ie-objects/object-detail-page___je-selectie-kan-worden-gedownload-als-afbeelding'
					)}
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
		if (thumbnailUrlIsLoading && !mediaInfo) {
			return <Loading fullscreen owner="object detail page: render page content" />;
		}

		if (mediaInfo || thumbnailUrl) {
			return (
				<div
					className={clsx(
						styles['p-object-detail'],
						`p-object-detail--${mediaInfo?.dctermsFormat}`,
						{
							[styles['p-object-detail__visitor-space-navigation-bar--visible']]:
								showVisitorSpaceNavigationBar,
							[styles['p-object-detail__visitor-space-navigation-bar--hidden']]:
								!showVisitorSpaceNavigationBar,
							[styles['p-object-detail__sidebar--expanded']]: expandSidebar,
							[styles['p-object-detail__sidebar--collapsed']]: !expandSidebar,
						}
					)}
					/**
					 * Sometimes the ie_object data in the database is updated
					 * And the Server side rendering isn't refreshed yet
					 * Which causes a 500 error. We don't want to see these 500 errors
					 * And just ignore them until the SSR cache times out and
					 * the page is rerendered on the server with fresh data
					 * https://meemoo.atlassian.net/browse/ARC-2891
					 **/
					suppressHydrationWarning
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

	const seoDescription = description || capitalize(lowerCase((router.query.slug as string) || ''));
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
				{renderPageContent()}
			</VisitorLayout>
		</>
	);
};
