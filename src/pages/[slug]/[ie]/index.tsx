import { Button, FlowPlayer, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { HTTPError } from 'ky';
import { capitalize, kebabCase, lowerCase } from 'lodash-es';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';
import { Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import save from 'save-file';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
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
import { useGetMediaExport } from '@media/hooks/get-media-export';
import { useGetMediaInfo } from '@media/hooks/get-media-info';
import { useGetMediaRelated } from '@media/hooks/get-media-related';
import { useGetMediaSimilar } from '@media/hooks/get-media-similar';
import { useGetMediaTicketInfo } from '@media/hooks/get-media-ticket-url';
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
	Loading,
	ScrollableTabs,
	TabLabel,
	TextWithNewLines,
} from '@shared/components';
import Callout from '@shared/components/Callout/Callout';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useElementSize } from '@shared/hooks/use-element-size';
import { useGetPeakFile } from '@shared/hooks/use-get-peak-file/use-get-peak-file';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { toastService } from '@shared/services/toast-service';
import { selectPreviousUrl } from '@shared/store/history';
import { selectCollections } from '@shared/store/media';
import { selectShowNavigationBorder, setShowZendesk } from '@shared/store/ui';
import { Breakpoints, License, MediaTypes, VisitorSpaceMediaType } from '@shared/types';
import {
	asDate,
	createPageTitle,
	formatMediumDate,
	formatMediumDateWithTime,
	formatSameDayTimeOrDate,
} from '@shared/utils';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';

import {
	AddToCollectionBlade,
	VisitorSpaceNavigation,
} from '../../../modules/visitor-space/components';

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

const ObjectDetailPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();
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
	const collections = useSelector(selectCollections);

	const metadataRef = useRef<HTMLDivElement>(null);
	const metadataSize = useElementSize(metadataRef);

	// Fetch object
	const {
		data: mediaInfo,
		isLoading: mediaInfoIsLoading,
		isError: mediaInfoIsError,
		error: mediaInfoError,
	} = useGetMediaInfo(router.query.ie as string);

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
	} = useGetMediaTicketInfo(
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
	const { mutateAsync: getMediaExport } = useGetMediaExport();

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
			if (/^\/[^/]+$/g.test(parsedUrl.url)) {
				// Previous url appears to be a visitor space url
				setVisitorSpaceSearchUrl(previousUrl);
			}
		}
	}, [previousUrl]);

	useEffect(() => {
		dispatch(setShowZendesk(false));
	}, [dispatch]);

	useEffect(() => {
		if (router.query.ie) {
			EventsService.triggerEvent(LogEventType.ITEM_VIEW, window.location.href, {
				schema_identifier: router.query.ie as string,
			});
		}
	}, [router.query.ie]);

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
				type: hit._source.dcterms_format as MediaTypes,
				title: hit._source.schema_name,
				subtitle: `${hit._source.schema_maintainer?.schema_name ?? ''} ${
					hit._source.schema_date_published
						? `(${formatMediumDate(asDate(hit._source.schema_date_published))})`
						: ''
				}`,
				description: hit._source.schema_description || '',
				thumbnail: hit._source.schema_thumbnail_url,
				id: hit._id,
				maintainer_id: hit._source.schema_maintainer?.schema_identifier || '',
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
				title: t('pages/slug/ie/index___error') || 'error',
				description: t('pages/slug/ie/index___het-ophalen-van-de-metadata-is-mislukt'),
			});
		}
	};

	const handleOnPlay = () => {
		setIsMediaPaused(false);
		if (!hasMediaPlayed) {
			setHasMediaPlayed(true);
			EventsService.triggerEvent(LogEventType.ITEM_PLAY, window.location.href, {
				schema_identifier: router.query.ie as string,
			});
		}
	};

	const handleOnPause = () => {
		setIsMediaPaused(true);
	};

	/**
	 * Content
	 */
	const tabs: TabProps[] = useMemo(
		() =>
			OBJECT_DETAIL_TABS(mediaType).map((tab) => ({
				...tab,
				label: <TabLabel label={tab.label} />,
				active: tab.id === activeTab,
			})),
		[activeTab, mediaType]
	);

	/**
	 * Render
	 */

	const renderMedia = (playableUrl: string, representation: MediaRepresentation): ReactNode => {
		// Flowplayer
		if (FLOWPLAYER_VIDEO_FORMATS.includes(representation.dctermsFormat)) {
			return (
				<FlowPlayer
					className={clsx(
						'p-object-detail__flowplayer',
						showFragmentSlider && 'p-object-detail__flowplayer--with-slider'
					)}
					key={flowPlayerKey}
					src={playableUrl}
					poster={mediaInfo?.thumbnailUrl || undefined}
					title={representation.name}
					pause={isMediaPaused}
					onPlay={handleOnPlay}
					onPause={handleOnPause}
					token={publicRuntimeConfig.FLOW_PLAYER_TOKEN}
					dataPlayerId={publicRuntimeConfig.FLOW_PLAYER_ID}
					plugins={['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio']}
				/>
			);
		}
		if (FLOWPLAYER_AUDIO_FORMATS.includes(representation.dctermsFormat)) {
			if (!peakFileId || !!peakJson) {
				return (
					<FlowPlayer
						className={clsx(
							'p-object-detail__flowplayer',
							showFragmentSlider && 'p-object-detail__flowplayer--with-slider'
						)}
						key={flowPlayerKey}
						src={[
							{
								src: playableUrl,
								type: 'audio/mp3',
							},
						]}
						title={representation.name}
						pause={isMediaPaused}
						onPlay={handleOnPlay}
						onPause={handleOnPause}
						token={publicRuntimeConfig.FLOW_PLAYER_TOKEN}
						dataPlayerId={publicRuntimeConfig.FLOW_PLAYER_ID}
						plugins={['speed', 'subtitles', 'cuepoints', 'hls', 'ga', 'audio']}
						waveformData={peakJson?.data || undefined}
					/>
				);
			} else {
				return <Loading fullscreen />;
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

	const renderMediaPlaceholder = (): ReactNode => {
		if (isLoadingPlayableUrl) {
			return null;
		}
		if (isErrorNoLicense) {
			return <ObjectPlaceholder {...noLicensePlaceholder()} />;
		}
		if (isErrorPlayableUrl) {
			return <ObjectPlaceholder {...ticketErrorPlaceholder()} />;
		}

		return null;
	};

	// Metadata
	const renderCard = (item: MediaObject, isHidden: boolean) => (
		<li>
			<Link passHref href={`/${router.query.slug}/${item.id}`}>
				<a
					tabIndex={isHidden ? -1 : 0}
					className={`p-object-detail__metadata-card-link u-text-no-decoration`}
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
							icon={<Icon name="info" />}
							text={t(
								'pages/slug/ie/index___door-gebruik-te-maken-van-deze-applicatie-bevestigt-u-dat-u-het-beschikbare-materiaal-enkel-raadpleegt-voor-wetenschappelijk-of-prive-onderzoek'
							)}
							action={
								<Link passHref href="/kiosk-voorwaarden">
									<a>
										<Button
											className="u-py-0 u-px-8 u-color-neutral u-font-size-14 u-height-auto"
											label={t('pages/slug/index___meer-info')}
											variants={['text', 'underline']}
										/>
									</a>
								</Link>
							}
						/>
					)}
					<h3
						className={clsx('u-pb-24', {
							'u-pt-24': showResearchWarning,
							'u-pt-32': !showResearchWarning,
						})}
					>
						{mediaInfo?.name}
					</h3>
					<p className="u-pb-24 u-line-height-1-4 u-font-size-14">
						<TextWithNewLines text={mediaInfo?.description} />
					</p>

					<div className="u-pb-24 p-object-detail__actions">
						{canDownloadMetadata && (
							<Button
								className="p-object-detail__export"
								iconStart={<Icon name="export" />}
								onClick={onExportClick}
							>
								<span className="u-text-ellipsis u-display-none u-display-block:md">
									{t(
										'pages/bezoekersruimte/visitor-space-slug/object-id/index___exporteer-metadata'
									)}
								</span>
								<span className="u-text-ellipsis u-display-none:md">
									{t(
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
										title: t(
											'pages/bezoekersruimte/visitor-space-slug/object-id/index___trefwoorden'
										),
										data: mapKeywordsToTagList(mediaInfo.keywords),
									},
									{
										title: 'Ook interessant',
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
				icon={<Icon className="u-font-size-24 u-mr-8 u-text-left" name="related-objects" />}
				title={
					related.length === 1
						? t(
								'pages/bezoekersruimte/visitor-space-slug/object-id/index___1-gerelateerd-object'
						  )
						: t(
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
					{playableUrl && currentRepresentation ? (
						// Flowplayer/image/not playable
						renderMedia(playableUrl, currentRepresentation)
					) : (
						// Loading/error
						<div>{renderMediaPlaceholder()}</div>
					)}
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
			return t('pages/slug/index___tot-access-end-date-mobile', {
				accessEndDateMobile,
			});
		}
		return t(
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
					{t(
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
						icon={<Icon name={expandMetadata ? 'expand-right' : 'expand-left'} />}
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
				<AddToCollectionBlade
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
			return <Loading fullscreen />;
		}
		if (isErrorNotFound) {
			return <ErrorNotFound />;
		}
		if (isErrorSpaceNoAccess) {
			return (
				<ErrorNoAccess
					visitorSpaceSlug={router.query.slug as string}
					description={t(
						'modules/shared/components/error-space-no-access/error-space-no-access___je-hebt-geen-toegang-tot-deze-bezoekersruimte-dien-een-aanvraag-in-om-deze-te-bezoeken'
					)}
				/>
			);
		}
		return <div className="p-object-detail">{renderObjectDetail()}</div>;
	};

	return (
		<VisitorLayout>
			<Head>
				<title>{createPageTitle(mediaInfo?.name)}</title>
				<meta
					name="description"
					content={capitalize(lowerCase((router.query.slug as string) || ''))}
				/>
			</Head>
			{renderPageContent()}
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(ObjectDetailPage);
