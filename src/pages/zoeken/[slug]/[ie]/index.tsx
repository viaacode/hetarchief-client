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
import { capitalize, intersection, isNil, kebabCase, lowerCase } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { stringifyUrl } from 'query-string';
import { Fragment, ReactNode, useEffect, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useDispatch, useSelector } from 'react-redux';
import save from 'save-file';
import { useQueryParams } from 'use-query-params';

import { GroupName, Permission } from '@account/const';
import { selectUser } from '@auth/store/user';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import {
	DynamicActionMenu,
	MediaObject,
	Metadata,
	MetadataItem,
	ObjectPlaceholder,
	RelatedObject,
	RelatedObjectsBlade,
} from '@ie-objects/components';
import { FragmentSlider } from '@ie-objects/components/FragmentSlider';
import {
	CustomMetaDataFields,
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	formatErrorPlaceholder,
	IE_OBJECT_QUERY_PARAM_CONFIG,
	IMAGE_FORMATS,
	MEDIA_ACTIONS,
	METADATA_EXPORT_OPTIONS,
	METADATA_FIELDS,
	noLicensePlaceholder,
	OBJECT_DETAIL_TABS,
	objectPlaceholder,
	ticketErrorPlaceholder,
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
	ObjectDetailTabs,
} from '@ie-objects/types';
import { isInAFolder, mapKeywordsToTagList, mapKeywordsToTags } from '@ie-objects/utils';
import { MaterialRequestObjectType } from '@material-requests/types';
import { useGetAccessibleVisitorSpaces } from '@navigation/components/Navigation/hooks/get-accessible-visitor-spaces';
import {
	ErrorNotFound,
	Icon,
	IconNamesLight,
	Loading,
	Pill,
	ScrollableTabs,
	TabLabel,
} from '@shared/components';
import Callout from '@shared/components/Callout/Callout';
import { MetaDataDescription } from '@shared/components/MetaDataDescription';
import NextLinkWrapper from '@shared/components/NextLinkWrapper/NextLinkWrapper';
import { ROUTE_PARTS, ROUTES } from '@shared/const';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAnyGroup } from '@shared/hooks/has-group';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { toastService } from '@shared/services/toast-service';
import { selectFolders } from '@shared/store/ie-objects';
import { selectShowNavigationBorder, setShowZendesk } from '@shared/store/ui';
import { Breakpoints, IeObjectTypes, VisitorSpaceMediaType, VisitStatus } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import {
	asDate,
	formatMediumDate,
	formatMediumDateWithTime,
	formatSameDayTimeOrDate,
} from '@shared/utils';
import { ReportBlade } from '@visitor-space/components/reportBlade';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceFilterId } from '@visitor-space/types';
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
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const canDownloadMetadata: boolean | null = useHasAllPermission(Permission.EXPORT_OBJECT);
	const canRequestMaterial: boolean | null = useHasAllPermission(
		Permission.CREATE_MATERIAL_REQUESTS
	);
	const user = useSelector(selectUser);
	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();
	const isNotKiosk = useHasAnyGroup(
		GroupName.CP_ADMIN,
		GroupName.MEEMOO_ADMIN,
		GroupName.VISITOR,
		GroupName.ANONYMOUS
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

	// Layout
	useStickyLayout();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();
	const showNavigationBorder = useSelector(selectShowNavigationBorder);
	const collections = useSelector(selectFolders);

	// Fetch object
	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetIeObjectsInfo(router.query.ie as string);

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
	const { data: similarData } = useGetIeObjectsSimilar(router.query.ie as string, !!mediaInfo);

	// gerelateerd
	const { data: relatedData } = useGetIeObjectsRelated(
		router.query.ie as string,
		mediaInfo?.maintainerId ?? '',
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
	const { data: visitorSpace, isLoading: visitorSpaceIsLoading } = useGetVisitorSpace(
		router.query.slug as string,
		false
	);

	// spaces
	const canViewAllSpaces = useHasAllPermission(Permission.READ_ALL_SPACES);
	const { data: accessibleVisitorSpaces } = useGetAccessibleVisitorSpaces({
		canViewAllSpaces,
	});

	/**
	 * Computed
	 */

	const hasMedia = mediaInfo?.representations?.length || 0 > 0;
	const isErrorNotFound =
		(visitRequestError as HTTPError)?.response?.status === 404 ||
		(mediaInfoError as HTTPError)?.response?.status === 404;
	const isErrorNoLicense =
		!hasMedia && !mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT);
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider = representationsToDisplay.length > 1;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const hasAccessToVisitorSpace = !!intersection(mediaInfo?.accessThrough, [
		IeObjectAccessThrough.VISITOR_SPACE_FOLDERS,
		IeObjectAccessThrough.VISITOR_SPACE_FULL,
	]).length;
	const showMetadataExportDropdown =
		canDownloadMetadata &&
		visitRequest?.status === VisitStatus.APPROVED &&
		hasAccessToVisitorSpace;
	const canRequestAccess =
		!!accessibleVisitorSpaces?.find(
			(space) => space.maintainerId === mediaInfo?.maintainerId
		) &&
		mediaInfo?.licenses?.includes(IeObjectLicense.BEZOEKERTOOL_CONTENT) &&
		!mediaInfo.thumbnailUrl;
	const showKeyUserPill = mediaInfo?.accessThrough?.includes(IeObjectAccessThrough.SECTOR);

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
				setActiveBlade(MediaActions.Bookmark);
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

	const onExportClick = async (format: MetadataExportFormats) => {
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
				description: tHtml('pages/slug/ie/index___het-ophalen-van-de-metadata-is-mislukt'),
			});
		}

		setMetadataExportDropdownOpen(false);
	};

	const onRequestMaterialClick = () => {
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
		const available =
			!isErrorNoLicense && !isErrorPlayableUrl && !!playableUrl && !!currentRepresentation;
		return OBJECT_DETAIL_TABS(mediaType, available).map((tab) => ({
			...tab,
			label: <TabLabel label={tab.label} />,
			active: tab.id === activeTab,
		}));
	}, [
		activeTab,
		mediaType,
		isErrorNoLicense,
		isErrorPlayableUrl,
		playableUrl,
		currentRepresentation,
	]);

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
		if (isErrorNoLicense) {
			return <ObjectPlaceholder {...noLicensePlaceholder()} />;
		}
		if (isErrorPlayableUrl || !playableUrl || !representation) {
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
		if (FLOWPLAYER_VIDEO_FORMATS.includes(representation.dctermsFormat)) {
			return <FlowPlayer key={flowPlayerKey} src={playableUrl} {...shared} />;
		}
		if (FLOWPLAYER_AUDIO_FORMATS.includes(representation.dctermsFormat)) {
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
				// TODO: replace with real image
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

		// No renderer
		return <ObjectPlaceholder {...formatErrorPlaceholder(representation.dctermsFormat)} />;
	};

	// Metadata
	const renderCard = (item: MediaObject, isHidden: boolean) => (
		<li>
			<Link passHref href={`/${router.query.slug}/${item.id}`}>
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
					{
						label: mediaInfo?.maintainerName,
						to: `${ROUTES.search}?maintainer=${mediaInfo?.maintainerSlug}`,
					},
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

	const renderExportDropdown = () => {
		return (
			<Dropdown
				isOpen={metadataExportDropdownOpen}
				onOpen={() => setMetadataExportDropdownOpen(true)}
				onClose={() => setMetadataExportDropdownOpen(false)}
			>
				<DropdownButton>
					<Button
						className="p-object-detail__export"
						iconStart={<Icon name={IconNamesLight.Export} aria-hidden />}
						iconEnd={<Icon name={IconNamesLight.AngleDown} aria-hidden />}
						aria-label={tText(
							'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata'
						)}
						title={tText(
							'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata'
						)}
					>
						<span className="u-text-ellipsis u-display-none u-display-block:md">
							{tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata'
							)}
						</span>
						<span className="u-text-ellipsis u-display-none:md">
							{tHtml(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___metadata'
							)}
						</span>
					</Button>
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
		);
	};

	const renderMaintainerMetaTitle = ({ maintainerName, maintainerLogo }: IeObject): ReactNode => (
		<div className="p-object-detail__metadata-maintainer-title">
			<p className="p-object-detail__metadata-label">
				{tText('modules/ie-objects/const/index___aanbieder')}
			</p>
			<p className="p-object-detail__metadata-pill">
				<TagList
					className="u-pt-12"
					tags={mapKeywordsToTags([maintainerName])}
					onTagClicked={(keyword: string | number) => {
						router.push(
							stringifyUrl({
								url: `/${ROUTE_PARTS.search}`,
								query: {
									[VisitorSpaceFilterId.Maintainers]: [`${keyword}`],
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
		</div>
	);

	const renderMetaDataActions = (): ReactNode => {
		const dynamicActions = MEDIA_ACTIONS(
			canManageFolders,
			isInAFolder(collections, mediaInfo?.schemaIdentifier),
			isNotKiosk,
			!!canRequestAccess,
			canRequestMaterial
		);

		return (
			<div className="u-pb-24 p-object-detail__actions">
				<div className="p-object-detail__primary-actions">
					{showMetadataExportDropdown && renderExportDropdown()}
					<DynamicActionMenu {...dynamicActions} onClickAction={onClickAction} />
				</div>
			</div>
		);
	};

	const renderMaintainerMetaData = ({
		maintainerDescription,
		maintainerSiteUrl,
	}: IeObject): ReactNode => (
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
		const showExtendedMaintainer = !hasAccessToVisitorSpace && isNotKiosk;
		const metaDataFields = METADATA_FIELDS(mediaInfo, showExtendedMaintainer)
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
		if (!isNil(accessEndDate)) {
			return (
				<VisitorSpaceNavigation
					className="p-object-detail__nav"
					showBorder={showNavigationBorder}
					title={mediaInfo?.maintainerName ?? ''}
					phone={visitorSpace?.contactInfo.telephone || ''}
					email={visitorSpace?.contactInfo.email || ''}
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
			{mediaInfoIsError && (
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
					objectType={mediaInfo.dctermsFormat as MaterialRequestObjectType}
					maintainerName={mediaInfo?.maintainerName}
					maintainerLogo={visitorSpace?.logo}
					maintainerSlug={visitorSpace?.slug}
				/>
			)}
			<ReportBlade
				user={user}
				isOpen={activeBlade === MediaActions.Report}
				onClose={onCloseBlade}
			/>
			{mediaInfo && visitorSpace && canRequestAccess && (
				<RequestAccessBlade
					isOpen={activeBlade === MediaActions.RequestAccess}
					onClose={onCloseBlade}
					onSubmit={onRequestAccessSubmit}
				/>
			)}
		</>
	);

	const renderPageContent = () => {
		if (mediaInfoIsLoading || visitRequestIsLoading || visitorSpaceIsLoading) {
			return <Loading fullscreen owner="object detail page: render page content" />;
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
