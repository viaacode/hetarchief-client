import { Alert, Button, FlowPlayer, FlowPlayerProps, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { HTTPError } from 'ky';
import { capitalize, kebabCase, lowerCase } from 'lodash-es';
import { GetServerSidePropsResult, NextPage } from 'next';
import getConfig from 'next/config';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { parseUrl } from 'query-string';
import { ComponentType, Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import save from 'save-file';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { FragmentSlider } from '@media/components/FragmentSlider';
import {
	FLOWPLAYER_AUDIO_FORMATS,
	FLOWPLAYER_VIDEO_FORMATS,
	formatErrorPlaceholder,
	IMAGE_FORMATS,
	MEDIA_ACTIONS,
	METADATA_FIELDS,
	noLicensePlaceholder,
	OBJECT_DETAIL_TABS,
	objectPlaceholder,
	ticketErrorPlaceholder,
} from '@media/const';
import { useGetIeObjectsExport } from '@media/hooks/get-ie-objects-export';
import { useGetIeObjectsInfo } from '@media/hooks/get-ie-objects-info';
import { useGetIeObjectsTicketInfo } from '@media/hooks/get-ie-objects-ticket-url';
import { useGetMediaRelated } from '@media/hooks/get-media-related';
import { useGetMediaSimilar } from '@media/hooks/get-media-similar';
import { MediaService } from '@media/services';
import {
	Media,
	MediaActions,
	MediaRepresentation,
	MediaSimilarHit,
	ObjectDetailTabs,
} from '@media/types';
import { isInAFolder, mapKeywordsToTagList } from '@media/utils';
import {
	ErrorNoAccess,
	ErrorNotFound,
	Icon,
	IconNamesLight,
	Loading,
	ScrollableTabs,
	TabLabel,
} from '@shared/components';
import Callout from '@shared/components/Callout/Callout';
import { MetaDataDescription } from '@shared/components/MetaDataDescription';
import { getDefaultServerSideProps } from '@shared/helpers/get-default-server-side-props';
import { isVisitorSpaceSearchPage } from '@shared/helpers/is-visitor-space-search-page';
import { renderOgTags } from '@shared/helpers/render-og-tags';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useElementSize } from '@shared/hooks/use-element-size';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { toastService } from '@shared/services/toast-service';
import { selectPreviousUrl } from '@shared/store/history';
import { selectFolders } from '@shared/store/media';
import { selectShowNavigationBorder, setShowZendesk } from '@shared/store/ui';
import { Breakpoints, License, MediaTypes, VisitorSpaceMediaType } from '@shared/types';
import { DefaultSeoInfo } from '@shared/types/seo';
import {
	asDate,
	formatMediumDate,
	formatMediumDateWithTime,
	formatSameDayTimeOrDate,
} from '@shared/utils';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';

import {
	AddToFolderBlade,
	VisitorSpaceNavigation,
} from '../../../../modules/visitor-space/components';

import {
	DynamicActionMenu,
	MediaObject,
	Metadata,
	ObjectPlaceholder,
	RelatedObject,
	RelatedObjectsBlade,
} from 'modules/media/components';
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
	const previousUrl = useSelector(selectPreviousUrl);
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);
	const showLinkedSpaceAsHomepage = useHasAllPermission(Permission.SHOW_LINKED_SPACE_AS_HOMEPAGE);
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const canDownloadMetadata: boolean | null = useHasAllPermission(Permission.EXPORT_OBJECT);
	const [visitorSpaceSearchUrl, setVisitorSpaceSearchUrl] = useState<string | null>(null);

	// Internal state
	const [activeTab, setActiveTab] = useState<string | number | null>(null);
	const [activeBlade, setActiveBlade] = useState<MediaActions | null>(null);
	const [metadataColumns, setMetadataColumns] = useState<number>(1);
	const [mediaType, setMediaType] = useState<MediaTypes>(null);
	const [isMediaPaused, setIsMediaPaused] = useState(true);
	const [hasMediaPlayed, setHasMediaPlayed] = useState(false);
	const [currentRepresentation, setCurrentRepresentation] = useState<
		MediaRepresentation | undefined
	>(undefined);
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | undefined>(undefined);
	const [similar, setSimilar] = useState<MediaObject[]>([]);
	const [related, setRelated] = useState<MediaObject[]>([]);

	// Layout
	useStickyLayout();
	useNavigationBorder();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();
	const showNavigationBorder = useSelector(selectShowNavigationBorder);
	const collections = useSelector(selectFolders);

	const metadataRef = useRef<HTMLDivElement>(null);
	const metadataSize = useElementSize(metadataRef);

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
	const { data: similarData } = useGetMediaSimilar(
		router.query.ie as string,
		mediaInfo?.maintainerId || '',
		!!mediaInfo
	);

	// gerelateerd
	const { data: relatedData } = useGetMediaRelated(
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
	} = useGetActiveVisitForUserAndSpace(router.query.slug as string);

	// get visitor space info, used to display contact information
	const { data: visitorSpace, isLoading: visitorSpaceIsLoading } = useGetVisitorSpace(
		router.query.slug as string,
		false
	);

	/**
	 * Computed
	 */

	const hasMedia = mediaInfo?.representations?.length || 0 > 0;
	const isErrorNotFound =
		(visitRequestError as HTTPError)?.response?.status === 404 ||
		(mediaInfoError as HTTPError)?.response?.status === 404;
	const isErrorSpaceNoAccess = (visitRequestError as HTTPError)?.response?.status === 403;
	const isErrorNoLicense =
		!hasMedia && !mediaInfo?.license?.includes(License.BEZOEKERTOOL_CONTENT);
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider = representationsToDisplay.length > 1;
	const isMobile = !!(windowSize.width && windowSize.width < Breakpoints.md);
	const accessEndDate = formatMediumDateWithTime(asDate(visitRequest?.endAt));
	const accessEndDateMobile = formatSameDayTimeOrDate(asDate(visitRequest?.endAt));

	/**
	 * Effects
	 */

	useEffect(() => {
		// Store the first previous url when arriving on this page, so we can return to the visitor space search url with query params
		// when we click the site's back button in the header
		if (previousUrl) {
			const parsedUrl = parseUrl(previousUrl);
			// Check if the url is of the format: /vrt and not of the format: /vrt/some-id
			if (isVisitorSpaceSearchPage(parsedUrl.url)) {
				// Previous url appears to be a visitor space url
				setVisitorSpaceSearchUrl(previousUrl);
			}
		}
	}, [previousUrl]);

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
		metadataSize &&
			setMetadataColumns(expandMetadata && !isMobile && metadataSize?.width > 500 ? 2 : 1);
	}, [expandMetadata, isMobile, metadataSize]);

	useEffect(() => {
		// Pause media if metadata tab is shown on mobile
		if (isMobile && activeTab === ObjectDetailTabs.Metadata) {
			setIsMediaPaused(true);
		}
	}, [activeTab, isMobile]);

	useEffect(() => {
		setMediaType(mediaInfo?.dctermsFormat as MediaTypes);

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
		similarData && setSimilar(mapSimilarData(similarData.hits.hits));
	}, [similarData]);

	useEffect(() => {
		relatedData && setRelated(mapRelatedData(relatedData.items));
	}, [relatedData]);

	/**
	 * Mapping
	 */
	const mapSimilarData = (data: MediaSimilarHit[]): MediaObject[] => {
		return data.map((hit) => {
			return {
				type: hit._source.dctermsFormat as MediaTypes,
				title: hit._source.name,
				subtitle: `${hit._source.maintainerName ?? ''} ${
					hit._source.datePublished
						? `(${formatMediumDate(asDate(hit._source.datePublished))})`
						: ''
				}`,
				description: hit._source.description || '',
				thumbnail: hit._source.thumbnailUrl,
				id: hit._id,
				maintainer_id: hit._source.maintainerId || '',
			};
		});
	};

	const mapRelatedData = (data: Media[]): MediaObject[] => {
		return data.map((item) => {
			return {
				type: item.dctermsFormat as MediaTypes,
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
		}
	};

	const onExportClick = async () => {
		const xmlBlob = await getMediaExport(router.query.ie as string);

		if (xmlBlob) {
			save(xmlBlob, `${kebabCase(mediaInfo?.name) || 'metadata'}.xml`);
		} else {
			toastService.notify({
				title: tHtml('pages/slug/ie/index___error') || 'error',
				description: tHtml('pages/slug/ie/index___het-ophalen-van-de-metadata-is-mislukt'),
			});
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

	/**
	 * Render
	 */

	const renderMedia = (
		playableUrl: string | undefined,
		representation: MediaRepresentation | undefined
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

	const renderMetadataCards = (
		type: 'similar' | 'related',
		items: MediaObject[],
		isHidden = false
	): ReactNode => (
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
	);

	const renderMetaData = () => {
		return (
			<div>
				<div className="p-object-detail__metadata-content">
					{showResearchWarning && (
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
					)}
					<h3
						className={clsx('u-pb-24', 'p-object-detail__title', {
							'u-pt-24': showResearchWarning,
							'u-pt-32': !showResearchWarning,
						})}
					>
						{mediaInfo?.name}
					</h3>

					<MetaDataDescription description={mediaInfo?.description || ''} />

					<div className="u-pb-24 p-object-detail__actions">
						{canDownloadMetadata && (
							<Button
								className="p-object-detail__export"
								iconStart={<Icon name={IconNamesLight.Export} aria-hidden />}
								onClick={onExportClick}
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
						)}
						<DynamicActionMenu
							{...MEDIA_ACTIONS(
								canManageFolders,
								isInAFolder(collections, mediaInfo?.schemaIdentifier)
							)}
							onClickAction={onClickAction}
						/>
					</div>
					{!mediaInfo?.description && (
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

				{mediaInfo && (
					<>
						<Metadata
							columns={metadataColumns}
							className="p-object-detail__metadata-component"
							metadata={METADATA_FIELDS(mediaInfo)}
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
							/>
						)}
					</>
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

	const getAccessEndDate = () => {
		if ((!accessEndDate && !accessEndDateMobile) || showLinkedSpaceAsHomepage) {
			return undefined;
		}
		if (isMobile) {
			return tHtml('pages/slug/index___tot-access-end-date-mobile', {
				accessEndDateMobile,
			});
		}
		return tHtml(
			'pages/bezoekersruimte/visitor-space-slug/object-id/index___toegang-tot-access-end-date',
			{
				accessEndDate,
			}
		);
	};

	const renderObjectDetail = () => (
		<>
			<VisitorSpaceNavigation
				className="p-object-detail__nav"
				showBorder={showNavigationBorder}
				title={mediaInfo?.maintainerName ?? ''}
				backLink={visitorSpaceSearchUrl || `/${router.query.slug}`}
				phone={visitorSpace?.contactInfo.telephone || ''}
				email={visitorSpace?.contactInfo.email || ''}
				showAccessEndDate={getAccessEndDate()}
			/>
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
					ref={metadataRef}
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
		</>
	);

	const renderPageContent = () => {
		if (mediaInfoIsLoading || visitRequestIsLoading || visitorSpaceIsLoading) {
			return <Loading fullscreen owner="object detail page: render page content" />;
		}
		if (isErrorNotFound) {
			return <ErrorNotFound />;
		}
		if (isErrorSpaceNoAccess) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={router.query.slug as string}
					description={tHtml(
						'modules/shared/components/error-space-no-access/error-space-no-access___je-hebt-geen-toegang-tot-deze-bezoekersruimte-dien-een-aanvraag-in-om-deze-te-bezoeken'
					)}
				/>
			);
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
		seoInfo = await MediaService.getSeoById(context.query.ie as string);
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

export default withAuth(ObjectDetailPage as ComponentType);
