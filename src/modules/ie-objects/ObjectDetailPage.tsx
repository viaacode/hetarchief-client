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
import { useGetAltoJsonFileContent } from '@ie-objects/hooks/get-alto-json-file-content';
import { useGetIeObjectTicketServiceTokens } from '@ie-objects/hooks/get-ie-object-ticket-service-tokens';
import { useGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { useGetIeObjectsRelated } from '@ie-objects/hooks/get-ie-objects-related';
import { useGetIeObjectsAlsoInteresting } from '@ie-objects/hooks/get-ie-objects-similar';
import { useGetIeObjectsTicketInfo } from '@ie-objects/hooks/get-ie-objects-ticket-url';
import { useIsPublicNewspaper } from '@ie-objects/hooks/get-is-public-newspaper';
import {
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	IMAGE_API_FORMATS,
	IMAGE_FORMATS,
	JSON_FORMATS,
	OBJECT_DETAIL_TABS,
	XML_FORMATS,
	noLicensePlaceholder,
	objectPlaceholder,
	ticketErrorPlaceholder,
} from '@ie-objects/ie-objects.consts';
import {
	type AltoTextLine,
	type IeObject,
	IeObjectAccessThrough,
	type IeObjectFile,
	IeObjectLicense,
	type IeObjectPageRepresentation,
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
import IiifViewer from '@iiif-viewer/IiifViewer';
import type {
	IiifViewerFunctions,
	ImageInfo,
	ImageInfoWithToken,
	Rect,
} from '@iiif-viewer/IiifViewer.types';
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
import { moduleClassSelector } from '@shared/helpers/module-class-locator';
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
	const [activeTab, setActiveTab] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_TAB,
		withDefault(StringParam, ObjectDetailTabs.Metadata)
	);

	// Used for going through the pages of a newspaper (iiif viewer reference strip)
	const [currentPageIndex, setCurrentPageIndex] = useQueryParam(
		QUERY_PARAM_KEY.ACTIVE_PAGE,
		withDefault(NumberParam, 0)
	);

	const [currentSearchResultIndex, setCurrentSearchResultIndex] = useState<number | null>(null);
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

	const [isLoadingPageImage, setIsLoadingPageImage] = useState(true);
	const [searchResults, setSearchResults] = useState<OcrSearchResult[] | null>(null);

	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetIeObjectInfo(ieObjectId);

	const isNoAccessError = (mediaInfoError as HTTPError)?.response?.status === 403;

	const currentPage: IeObjectPageRepresentation | undefined =
		mediaInfo?.pageRepresentations?.[currentPageIndex];

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

	const getFileByType = useCallback(
		(mimeTypes: string[]): IeObjectFile | null => {
			return (
				getRepresentationByType(mimeTypes)?.files?.find((file) =>
					mimeTypes.includes(file.mimeType)
				) || null
			);
		},
		[getRepresentationByType]
	);

	// peak file
	const peakFileStoredAt: string | null = getFileByType(JSON_FORMATS)?.storedAt || null;

	// media info
	const { data: peakJson } = useGetPeakFile(peakFileStoredAt, {
		enabled: mediaInfo?.dctermsFormat === 'audio',
	});

	const iiifViewerReference =
		useRef<IiifViewerFunctions>() as MutableRefObject<IiifViewerFunctions>;

	const representationsToDisplay =
		(mediaInfo?.pageRepresentations || []).flatMap((pageRepresentation) =>
			pageRepresentation.representations.flatMap((rep) =>
				rep.files.filter((file) => FLOWPLAYER_FORMATS.includes(file.mimeType))
			)
		) || [];
	const iiifViewerImageInfos = useMemo((): ImageInfo[] => {
		return compact(
			mediaInfo?.pageRepresentations?.flatMap((pageRepresentation) => {
				const files = pageRepresentation?.representations?.flatMap(
					(representation) => representation.files
				);
				const imageApiFile = files.find((file) => IMAGE_API_FORMATS.includes(file.mimeType));
				if (!imageApiFile?.storedAt) {
					return null;
				}
				const imageFile = files.find((file) => IMAGE_FORMATS.includes(file.mimeType));
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
	}, [mediaInfo?.pageRepresentations]);

	// Playable url for flowplayer
	const currentPlayableFile: IeObjectFile | null = getFileByType(FLOWPLAYER_FORMATS);
	const fileStoredAt: string | null = currentPlayableFile?.storedAt ?? null;
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetIeObjectsTicketInfo(
		fileStoredAt,
		!!fileStoredAt,
		() => setFlowPlayerKey(fileStoredAt) // Force flowplayer rerender after successful fetch
	);
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
	const { data: simplifiedAltoInfo } = useGetAltoJsonFileContent(currentPageAltoUrl);

	/**
	 * Computed
	 */
	const hasMedia = (mediaInfo?.pageRepresentations?.length || 0) > 0;
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

	const showVisitButton =
		isNil(mediaInfo?.thumbnailUrl) &&
		mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		visitorSpace?.status === VisitorSpaceStatus.Active &&
		!isKiosk;

	const pageOcrTexts: (string | null)[] = useMemo(() => {
		const pageOcrTextsTemp: (string | null)[] = [];
		for (const pageRepresentation of mediaInfo?.pageRepresentations || []) {
			const pageTranscripts = compact(
				pageRepresentation?.representations?.map((representation) => {
					return representation.schemaTranscript;
				})
			);
			pageOcrTextsTemp.push(pageTranscripts[0]?.toLowerCase() || null);
		}
		return pageOcrTextsTemp;
	}, [mediaInfo?.pageRepresentations]);

	const arePagesOcrTextsAvailable = compact(pageOcrTexts).length !== 0;

	const isPublicNewspaper: boolean = useIsPublicNewspaper(mediaInfo);
	// You need the permission or not to be logged in to download the newspaper
	// https://meemoo.atlassian.net/browse/ARC-2617
	const canDownloadNewspaper: boolean =
		(useHasAnyPermission(Permission.DOWNLOAD_OBJECT) || !user) && isPublicNewspaper;

	const getHighlightedAltoTexts = useCallback((): AltoTextLine[] => {
		return (
			simplifiedAltoInfo?.text?.filter((altoText) =>
				searchTerms
					.toLowerCase()
					.split(' ')
					.some((searchTermWord) => altoText.text.toLowerCase().includes(searchTermWord))
			) || []
		);
	}, [searchTerms, simplifiedAltoInfo?.text]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	const handleSearch = useCallback(
		async (newSearchTerms: string): Promise<void> => {
			if (newSearchTerms === '') {
				// Reset search
				// Zoom to whole page
				iiifViewerReference.current?.iiifGoToHome();
				setSearchResults([]);
				setSearchTerms('');
				setCurrentSearchResultIndex(0);
				return;
			}

			if (!pageOcrTexts.length) {
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

			const searchResultsTemp: OcrSearchResult[] = [];
			for (const searchTerm of newSearchTerms.toLowerCase().split(' ')) {
				pageOcrTexts.forEach((pageOcrText, pageIndex) => {
					if (!pageOcrText) {
						return; // Skip this page since it doesn't have an ocr transcript
					}
					let searchTermCharacterOffset: number = pageOcrText.indexOf(searchTerm);
					let searchTermIndexOnPage = 0;
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
			}

			setSearchResults(searchResultsTemp);
			setSearchTerms(newSearchTerms.toLowerCase());

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

			const firstSearchResultOnCurrentPage = searchResultsTemp.findIndex(
				(result) => result.pageIndex === currentPageIndex
			);
			if (firstSearchResultOnCurrentPage === -1) {
				setCurrentSearchResultIndex(0);
			} else {
				setCurrentSearchResultIndex(firstSearchResultOnCurrentPage);
			}
		},
		[currentPageIndex, mediaInfo?.thumbnailUrl, pageOcrTexts, router]
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

	useEffect(() => {
		if (
			mediaInfo?.maintainerSlug &&
			maintainerSlug &&
			mediaInfo?.maintainerSlug !== maintainerSlug
		) {
			// Maintainer was renamed and the user is loading an url with the old maintainer slug
			// Redirect to the new maintainer slug
			// https://meemoo.atlassian.net/browse/ARC-2678
			const newPath = router.asPath
				.replace(`/${maintainerSlug}/`, `/${mediaInfo?.maintainerSlug}/`)
				.replace(`/${ieObjectNameSlug}`, `/${kebabCase(mediaInfo?.name || '')}`);
			router.replace(newPath, undefined, { shallow: true });
		}
	}, [mediaInfo, maintainerSlug, ieObjectNameSlug, router.replace, router.asPath.replace]);

	/**
	 * Update the highlighted alto texts in the iiif viewer when
	 * - the search terms change
	 * - the overlay is enabled/disabled
	 * - another page alto texts are loaded
	 * - the current search result index changes
	 * - the current page index changes
	 */

	// biome-ignore lint/correctness/useExhaustiveDependencies: render loop
	useEffect(() => {
		if (isLoadingPageImage) {
			return; // Wait for the page to load before changing overlays or zoom
		}
		if (!searchResults || searchResults.length === 0) {
			iiifViewerReference.current?.updateHighlightedAltoTexts([], null);
			return;
		}

		const highlightedAltoTexts = getHighlightedAltoTexts();
		const currentHighlightedAltoText =
			highlightedAltoTexts[searchResults[currentSearchResultIndex || 0]?.searchTermIndexOnPage];

		if (currentHighlightedAltoText) {
			iiifViewerReference.current?.iiifZoomToRect(currentHighlightedAltoText);
		} else {
			console.error('Could not find currentHighlightedAltoText', {
				searchResults,
				highlightedAltoTexts,
			});
		}

		if (isTextOverlayVisible) {
			iiifViewerReference.current?.updateHighlightedAltoTexts(
				highlightedAltoTexts,
				currentHighlightedAltoText
			);
		} else {
			iiifViewerReference.current?.updateHighlightedAltoTexts([], null);
		}
	}, [
		isLoadingPageImage,
		searchTerms,
		currentPageIndex,
		getHighlightedAltoTexts,
		isTextOverlayVisible,
		searchResults,
		currentSearchResultIndex,
		simplifiedAltoInfo?.text,
	]);

	/**
	 * When the page loads, search the ocr texts for the searchTerms in the query params in the url
	 */
	useEffect(() => {
		if (highlightedSearchTerms && isNewspaper && !hasAppliedUrlSearchTerms) {
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
	]);

	/**
	 * Scroll to active search result in ocr tab when the current search result index changes
	 */
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Wait for active word to be rendered before starting scroll
		window.setTimeout(() => {
			const activeSearchResultElem = document.querySelector(
				moduleClassSelector('p-object-detail__ocr__word--marked--active')
			);
			const scrollable = document.querySelector(
				moduleClassSelector('p-object-detail__ocr__words-container')
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
		}, 100);
	}, [currentSearchResultIndex, searchTerms]);

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
			setActiveTab(ObjectDetailTabs.Metadata, 'replaceIn');
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
				setIsLoadingPageImage(true);
				setCurrentPageIndex(searchResult.pageIndex, 'replaceIn');
			}
		},
		[searchResults, currentPageIndex, setCurrentPageIndex]
	);

	const handleClearSearch = () => {
		setSearchTermsTemp('');
		setSearchTerms('');
		setHighlightedSearchTerms('');
		setSearchResults(null);
		setCurrentSearchResultIndex(null);
		iiifViewerReference.current?.iiifGoToHome();
	};

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
				return !!getFileByType(IMAGE_API_FORMATS)?.storedAt;
			}

			default:
				return false;
		}
	}, [
		mediaInfo?.dctermsFormat,
		isErrorPlayableUrl,
		playableUrl,
		currentPlayableFile,
		getFileByType,
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

	const handleIiifViewerSelection = (rect: Rect) => {
		window.open(
			stringifyUrl({
				url: `${publicRuntimeConfig.PROXY_URL}/${NEWSPAPERS_SERVICE_BASE_URL}/${ieObjectId}/${IE_OBJECTS_SERVICE_EXPORT}/jpg/selection`,
				query: {
					page: currentPageIndex,
					startX: Math.floor(rect.x),
					startY: Math.floor(rect.y),
					width: Math.ceil(rect.width),
					height: Math.ceil(rect.height),
				},
			})
		);
	};

	const handleActiveImageIndexChange = (index: number) => {
		setCurrentPageIndex(index, 'replaceIn');
		setIsLoadingPageImage(true);
		setCurrentSearchResultIndex(
			searchResults?.findIndex((result) => result.pageIndex === index) || 0
		);
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
		if (isNewspaper && !!mediaInfo && mediaInfo.pageRepresentations?.length) {
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
					ref={iiifViewerReference}
					id={mediaInfo?.schemaIdentifier as string}
					isTextOverlayVisible={isTextOverlayVisible || false}
					setIsTextOverlayVisible={handleIsTextOverlayVisibleChange}
					activeImageIndex={currentPageIndex}
					setActiveImageIndex={handleActiveImageIndexChange}
					initialFocusX={iiifViewerFocusX}
					initialFocusY={iiifViewerFocusY}
					initialZoomLevel={iiifViewerZoomLevel}
					isLoading={isLoadingPageImage}
					setIsLoading={setIsLoadingPageImage}
					isSearchEnabled={arePagesOcrTextsAvailable}
					searchTerms={searchTermsTemp}
					setSearchTerms={setSearchTermsTemp}
					onSearch={handleSearch}
					onClearSearch={handleClearSearch}
					currentSearchIndex={currentSearchResultIndex || 0}
					searchResults={searchResults}
					setSearchResultIndex={handleChangeSearchIndex}
					onSelection={handleIiifViewerSelection}
					enableSelection={canDownloadNewspaper}
				/>
			);
		}

		if (isErrorPlayableUrl) {
			return (
				<ObjectPlaceholder {...ticketErrorPlaceholder()} addSliderPadding={showFragmentSlider} />
			);
		}

		if (!playableUrl || !currentPlayableFile || !mediaInfo?.pageRepresentations?.length) {
			return (
				<ObjectPlaceholder
					{...noLicensePlaceholder()}
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
			return (
				<FlowPlayer
					key={flowPlayerKey}
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
			if (peakFileStoredAt && !peakJson) {
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: avoid rerendering ocr text since it's heavy
	const renderedOcrText = useMemo(() => {
		const searchTermWords = compact(searchTerms.split(' '));
		let searchTermIndex = 0;
		return (
			<div className={styles['p-object-detail__ocr__words-container']}>
				{simplifiedAltoInfo?.text?.map((textLocation) => {
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
							key={`ocr-text--${ieObjectId}--${textLocation.x}-${textLocation.y}`}
							onClick={() => iiifViewerReference.current?.iiifZoomToRect(textLocation)}
							onKeyUp={(evt) => {
								if (evt.key === 'Enter') {
									iiifViewerReference.current?.iiifZoomToRect(textLocation);
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
		simplifiedAltoInfo?.text,
		searchResults,
		currentSearchResultIndex,
		ieObjectId,
		currentPageIndex,
		handleIsTextOverlayVisibleChange,
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
						searchResults={searchResults}
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
					<div className={styles['p-object-detail__media']}>{renderMedia()}</div>
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
				{...objectPlaceholder()}
				reasonDescription={tText(
					'modules/ie-objects/object-detail-page___je-hebt-enkel-toegang-tot-de-metadata-van-dit-object-omdat-dit-object-niet-publiek-beschikbaar-is-volgens-de-licenties-van-de-auteur'
				)}
				className={styles['p-object-detail__media--not-available']}
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
					onClick={(tabId) => setActiveTab(tabId as ObjectDetailTabs | null, 'replaceIn')}
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
								currentPage={currentPage || null}
								activeFile={getFileByType([...FLOWPLAYER_FORMATS, ...IMAGE_API_FORMATS])}
								simplifiedAltoInfo={simplifiedAltoInfo || null}
								iiifZoomTo={iiifViewerReference.current?.iiifZoomTo}
							/>
						)}
						{!!similar.length && (
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
				onClose={() => setActiveBlade(null, 'replaceIn')}
				onSubmit={onRequestAccessSubmit}
				id="object-detail-page__request-access-blade"
			/>
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
						`p-object-detail--${mediaInfo.dctermsFormat}`,
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
