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
import {
	capitalize,
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
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import React, { FC, Fragment, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { GroupName, Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import {
	ActionItem,
	DynamicActionMenu,
	DynamicActionMenuProps,
	MediaObject,
	MetadataItem,
	ObjectPlaceholder,
	RelatedObject,
	RelatedObjectsBlade,
} from '@ie-objects/components';
import { FragmentSlider } from '@ie-objects/components/FragmentSlider';
import Metadata from '@ie-objects/components/Metadata/Metadata';
import MetadataList from '@ie-objects/components/Metadata/MetadataList';
import {
	ANONYMOUS_ACTION_SORT_MAP,
	CP_ADMIN_ACTION_SORT_MAP,
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
import { useGetIeObjectInfo } from '@ie-objects/hooks/get-ie-objects-info';
import { useGetIeObjectsRelated } from '@ie-objects/hooks/get-ie-objects-related';
import { useGetIeObjectsSimilar } from '@ie-objects/hooks/get-ie-objects-similar';
import { useGetIeObjectsTicketInfo } from '@ie-objects/hooks/get-ie-objects-ticket-url';
import {
	IE_OBJECTS_SERVICE_BASE_URL,
	IE_OBJECTS_SERVICE_EXPORT,
} from '@ie-objects/services/ie-objects/ie-objects.service.const';
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
import { isInAFolder, mapKeywordsToTags, renderKeywordsAsTags } from '@ie-objects/utils';
import { MaterialRequestsService } from '@material-requests/services';
import { MaterialRequestObjectType } from '@material-requests/types';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import {
	Blade,
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
import HighlightedMetadata from '@shared/components/HighlightedMetadata/HighlightedMetadata';
import MetaDataFieldWithHighlightingAndMaxLength from '@shared/components/MetaDataFieldWithHighlightingAndMaxLength/MetaDataFieldWithHighlightingAndMaxLength';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { KNOWN_STATIC_ROUTES, ROUTES_BY_LOCALE } from '@shared/const';
import {
	HIGHLIGHTED_SEARCH_TERMS_SEPARATOR,
	QUERY_PARAM_KEY,
} from '@shared/const/query-param-keys';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
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
import { Breakpoints, IeObjectTypes, SearchPageMediaType } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import {
	asDate,
	formatMediumDate,
	formatMediumDateWithTime,
	formatSameDayTimeOrDate,
} from '@shared/utils';
import { useGetActiveVisitForUserAndSpace } from '@visit-requests/hooks/get-active-visit-for-user-and-space';
import { VisitorLayout } from '@visitor-layout/index';
import {
	AddToFolderBlade,
	MaterialRequestBlade,
	VisitorSpaceNavigation,
} from '@visitor-space/components';
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
	const canDownloadMetadata: boolean | null = useHasAllPermission(Permission.EXPORT_OBJECT);
	const canRequestMaterial: boolean | null = useHasAllPermission(
		Permission.CREATE_MATERIAL_REQUESTS
	);

	// Internal state
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
	const [selectedMetadataField, setSelectedMetadataField] = useState<MetadataItem | null>(null);

	// Layout
	useStickyLayout();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();
	const collections = useSelector(selectFolders);

	// Query params
	const [query, setQuery] = useQueryParams({
		...IE_OBJECT_QUERY_PARAM_CONFIG,
		[QUERY_PARAM_KEY.SHOW_AUTH_QUERY_KEY]: StringParam,
		[QUERY_PARAM_KEY.ACTIVE_BLADE]: StringParam,
		[QUERY_PARAM_KEY.ACTIVE_TAB]: StringParam,
	});

	const setActiveTab = (tabId: ObjectDetailTabs | null) => {
		setQuery({ ...query, [QUERY_PARAM_KEY.ACTIVE_TAB]: tabId || undefined }, 'replace');
	};

	const setActiveBlade = (blade: MediaActions | null) => {
		setQuery({ ...query, [QUERY_PARAM_KEY.ACTIVE_BLADE]: blade || undefined }, 'replace');
	};

	const activeTab = query[QUERY_PARAM_KEY.ACTIVE_TAB];
	const activeBlade = query[QUERY_PARAM_KEY.ACTIVE_BLADE];

	// Fetch object
	const objectId = router.query.ie as string;
	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetIeObjectInfo(objectId);

	const isNoAccessError = (mediaInfoError as HTTPError)?.response?.status === 403;

	// peak file
	const fileRepresentationSchemaIdentifier =
		mediaInfo?.representations?.find(
			(representation) => representation.dctermsFormat === 'peak'
		)?.files?.[0]?.representationSchemaIdentifier || null;
	const fileSchemaIdentifier =
		mediaInfo?.representations?.find(
			(representation) => representation.dctermsFormat === 'peak'
		)?.files?.[0]?.schemaIdentifier || null;

	// media info
	const { data: peakJson } = useGetPeakFile(fileSchemaIdentifier, {
		enabled: mediaInfo?.dctermsFormat === 'audio',
	});
	const representationsToDisplay = (mediaInfo?.representations || [])?.filter((object) => {
		if (object.dctermsFormat === 'peak') {
			// Ignore peak file containing the audio wave form in json format
			return false;
		}
		if (object?.files?.[0]?.representationSchemaIdentifier?.endsWith('/audio_mp4')) {
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
	const userHasAccessToMaintainer =
		mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.VISITOR_SPACE_FOLDERS) ||
		mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.VISITOR_SPACE_FULL);
	const { data: similarData } = useGetIeObjectsSimilar(
		objectId,
		isKiosk || userHasAccessToMaintainer ? mediaInfo?.maintainerId ?? '' : '',
		!!mediaInfo
	);

	// gerelateerd
	const { data: relatedData } = useGetIeObjectsRelated(
		objectId,
		mediaInfo?.maintainerId,
		mediaInfo?.meemooIdentifier,
		!!mediaInfo
	);

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
	const hasMedia = mediaInfo?.representations?.length || 0 > 0;
	const isMediaInfoErrorNotFound = (mediaInfoError as HTTPError)?.response?.status === 404;
	const isMediaInfoErrorNoAccess = (mediaInfoError as HTTPError)?.response?.status === 403;
	const isVisitRequestErrorNotFound =
		(visitRequestError as HTTPError)?.response?.status === 404 ||
		(visitRequestError as HTTPError)?.response?.status === 403;
	const isErrorSpaceNotFound = (visitorSpaceError as HTTPError)?.response?.status === 404;
	const isErrorSpaceNotActive = (visitorSpaceError as HTTPError)?.response?.status === 410;
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider = representationsToDisplay.length > 1;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const hasAccessToVisitorSpaceOfObject =
		intersection(mediaInfo?.accessThrough, [
			IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
			IeObjectAccessThrough.VISITOR_SPACE_FULL,
		]).length > 0;
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
				pid: mediaInfo.meemooIdentifier,
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
		setMediaType(mediaInfo?.dctermsFormat as IeObjectTypes);

		// Filter out peak files if type === video
		if (mediaInfo?.dctermsFormat === SearchPageMediaType.Video) {
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
			const date = ieObject.datePublished ?? ieObject.dateCreatedLowerBound ?? null;

			return {
				type: (ieObject?.dctermsFormat || null) as IeObjectTypes,
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
				type: item.dctermsFormat as IeObjectTypes,
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
				.replaceAll('{pid}', encodeOrNotUriComponent(mediaInfo?.meemooIdentifier || ''))
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
				pid: mediaInfo?.meemooIdentifier,
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
						pid: mediaInfo?.meemooIdentifier,
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
		(format: MetadataExportFormats) => {
			window.open(
				`${publicRuntimeConfig.PROXY_URL}/${IE_OBJECTS_SERVICE_BASE_URL}/${objectId}/${IE_OBJECTS_SERVICE_EXPORT}/${format}`
			);
			setMetadataExportDropdownOpen(false);
		},
		[objectId]
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

	const highlighted = (toHighlight: string) => (
		<Highlighter
			searchWords={
				query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]
					? decodeURIComponent(
							query[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS] as string
					  ).split(HIGHLIGHTED_SEARCH_TERMS_SEPARATOR)
					: []
			}
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
		const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
		const original = MEDIA_ACTIONS(
			isMobile,
			canManageFolders || isAnonymous,
			isInAFolder(collections, mediaInfo?.schemaIdentifier),
			!isKiosk,
			!!canRequestAccess,
			isAnonymous || canRequestMaterial,
			canDownloadMetadata,
			getExternalMaterialRequestUrlIfAvailable()
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
		windowSize.width,
		canManageFolders,
		isAnonymous,
		collections,
		mediaInfo?.schemaIdentifier,
		isKiosk,
		canRequestAccess,
		canRequestMaterial,
		canDownloadMetadata,
		getSortMapByUserType,
		hasAccessToVisitorSpaceOfObject,
		renderExportDropdown,
		getExternalMaterialRequestUrlIfAvailable,
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
						onOpenRequestAccess={openRequestAccessBlade}
						addSliderPadding={showFragmentSlider}
					/>
				);
			}
			return (
				<ObjectPlaceholder
					{...noLicensePlaceholder()}
					addSliderPadding={showFragmentSlider}
				/>
			);
		}

		if (isErrorPlayableUrl || !representation) {
			return (
				<ObjectPlaceholder
					{...ticketErrorPlaceholder()}
					addSliderPadding={showFragmentSlider}
				/>
			);
		}

		const shared: Partial<FlowPlayerProps> = {
			className: clsx(styles['p-object-detail__flowplayer'], {
				[styles['p-object-detail__flowplayer--with-slider']]: showFragmentSlider,
			}),
			poster: mediaInfo?.thumbnailUrl || undefined,
			title: representation.name,
			logo: mediaInfo?.maintainerOverlay ? mediaInfo?.maintainerLogo || undefined : undefined,
			pause: isMediaPaused,
			onPlay: handleOnPlay,
			onPause: handleOnPause,
			token: publicRuntimeConfig.FLOW_PLAYER_TOKEN,
			dataPlayerId: publicRuntimeConfig.FLOW_PLAYER_ID,
			plugins: ['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio', 'keyboard'],
		};

		// Flowplayer
		if (playableUrl && FLOWPLAYER_VIDEO_FORMATS.includes(representation.dctermsFormat)) {
			return <FlowPlayer key={flowPlayerKey} type="video" src={playableUrl} {...shared} />;
		}
		if (playableUrl && FLOWPLAYER_AUDIO_FORMATS.includes(representation.dctermsFormat)) {
			if (!fileRepresentationSchemaIdentifier || !!peakJson) {
				return (
					<FlowPlayer
						key={flowPlayerKey}
						type="audio"
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
				<div className={styles['p-object-detail__image']}>
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
							label: `${tText('pages/slug/ie/index___breadcrumbs-home')}`,
							to: ROUTES_BY_LOCALE[locale].home,
						},
				  ]),
			{
				label: `${tText('pages/slug/ie/index___breadcrumbs-search')}`,
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
		<dd className="u-m-0">
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
		</dd>
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
					<p className={styles['p-object-detail__metadata-pill']}>
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
					</p>
					{maintainerLogo && (
						<div className={styles['p-object-detail__metadata-logo']}>
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
						{highlighted(mediaInfo?.name)}
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
						return (
							<Metadata title={item.title} key={`metadata-${index}-${item.title}`}>
								<MetaDataFieldWithHighlightingAndMaxLength
									title={item.title}
									data={item.data as string}
									onReadMoreClicked={setSelectedMetadataField}
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
									locale
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
			<RelatedObjectsBlade
				className={clsx('p-object-detail__related', {
					'p-object-detail__metadata--expanded': expandMetadata,
					'p-object-detail__metadata--collapsed': !expandMetadata,
				})}
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
							className={styles['p-object-detail__slider']}
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
					variants={['white', 'xs']}
				/>
			)
		);
	};

	const renderObjectDetail = () => (
		<>
			<Head>
				<link rel="canonical" href={`https://hetarchief.be/zoeken/${router.query.ie}`} />
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
				<div className={styles['p-object-detail__video']}>{renderObjectMedia()}</div>
				<div
					className={clsx(styles['p-object-detail__metadata'], {
						[styles['p-object-detail__metadata--collapsed']]: !expandMetadata,
						[styles['p-object-detail__metadata--expanded']]: expandMetadata,
						[styles['p-object-detail__metadata--no-media']]: !mediaType,
					})}
				>
					{renderMetaData()}
				</div>
				{renderRelatedObjectsBlade()}
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
					objectDctermsFormat={mediaInfo.dctermsFormat as MaterialRequestObjectType}
					maintainerName={mediaInfo?.maintainerName}
					maintainerLogo={mediaInfo?.maintainerLogo}
					maintainerSlug={mediaInfo?.maintainerSlug}
					meemooId={mediaInfo?.meemooIdentifier}
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
				className={clsx('u-pb-24 u-line-height-1-4 u-font-size-14')}
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
			return <Loading fullscreen owner={'object detail page: render page content'} />;
		}

		if (mediaInfo) {
			return <div className={styles['p-object-detail']}>{renderObjectDetail()}</div>;
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
				{renderOgTags(title, seoDescription, url, image)}
				{renderPageContent()}
			</VisitorLayout>
		</>
	);
};
