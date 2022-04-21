import { Button, FlowPlayer, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { isToday } from 'date-fns/esm';
import { lowerCase } from 'lodash-es';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { FragmentSlider } from '@media/components/FragmentSlider';
import {
	FLOWPLAYER_FORMATS,
	formatErrorPlaceholder,
	IMAGE_FORMATS,
	MEDIA_ACTIONS,
	METADATA_FIELDS,
	OBJECT_DETAIL_TABS,
	objectPlaceholder,
	ticketErrorPlaceholder,
} from '@media/const';
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
import { mapKeywordsToTagList } from '@media/utils';
import { AddToCollectionBlade, ReadingRoomNavigation } from '@reading-room/components';
import { Icon, Loading, ScrollableTabs, TabLabel } from '@shared/components';
import { useElementSize } from '@shared/hooks/use-element-size';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { EventsService, LogEventType } from '@shared/services/events-service';
import { selectPreviousUrl } from '@shared/store/history';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { MediaTypes, ReadingRoomMediaType } from '@shared/types';
import {
	asDate,
	createPageTitle,
	formatDate,
	formatMediumDate,
	formatMediumDateWithTime,
	formatTime,
} from '@shared/utils';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';

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
	const previousUrl = useSelector(selectPreviousUrl);

	// Internal state
	const [backLink, setBackLink] = useState(`/${router.query.slug}`);
	const [activeTab, setActiveTab] = useState<string | number | null>(null);
	const [activeBlade, setActiveBlade] = useState<MediaActions | null>(null);
	const [mediaType, setMediaType] = useState<MediaTypes>(null);
	const [pauseMedia, setPauseMedia] = useState(true);
	const [isPlayEventFired, setIsPlayEventFired] = useState(false);
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

	const metadataRef = useRef<HTMLDivElement>(null);
	const metadataSize = useElementSize(metadataRef);

	// Fetch object
	const {
		data: mediaInfo,
		isLoading: isLoadingMediaInfo,
		isError,
	} = useGetMediaInfo(router.query.ie as string);

	// playable url
	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetMediaTicketInfo(
		currentRepresentation?.files[0].schemaIdentifier ?? null,
		() => setFlowPlayerKey(currentRepresentation?.files[0].schemaIdentifier) // Force flowplayer rerender after successful fetch
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

	// visit info
	const { data: visitStatus } = useGetActiveVisitForUserAndSpace(router.query.slug as string);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (router.query.ie) {
			EventsService.triggerEvent(LogEventType.ITEM_VIEW, window.location.href, {
				schema_identifier: router.query.ie as string,
			});
		}
	}, [router.query.ie]);

	useEffect(() => {
		// Pause media if metadata tab is shown on mobile
		if (windowSize.width && windowSize.width < 768 && activeTab === ObjectDetailTabs.Metadata) {
			setPauseMedia(true);
		}
	}, [activeTab, windowSize.width]);

	useEffect(() => {
		let backLink = `/${router.query.slug}`;
		if (previousUrl) {
			const subgroups = previousUrl?.match(/(?:[^/\n]|\/\/)+/gi);
			const validBacklink =
				subgroups?.length === 1 && lowerCase(subgroups[0]).startsWith('or-');

			if (validBacklink) {
				backLink = previousUrl;
			}
		}
		setBackLink(backLink);
	}, [previousUrl, router.query.slug]);

	useEffect(() => {
		setMediaType(mediaInfo?.dctermsFormat as MediaTypes);

		// Filter out peak files if type === video
		if (mediaInfo?.dctermsFormat === ReadingRoomMediaType.Video) {
			mediaInfo.representations = mediaInfo?.representations.filter(
				(object) => object.dctermsFormat !== 'peak'
			);
		}

		setCurrentRepresentation(mediaInfo?.representations[0]);

		// Set default view
		if (windowSize.width && windowSize.width < 768) {
			// Default to metadata tab on mobile
			setActiveTab(ObjectDetailTabs.Metadata);
		} else {
			// Check media content for default tab on desktop
			setActiveTab(
				mediaInfo?.dctermsFormat ? ObjectDetailTabs.Media : ObjectDetailTabs.Metadata
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
	 * Variables
	 */
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider = mediaInfo?.representations && mediaInfo?.representations.length > 1;
	const isMobile = windowSize.width && windowSize.width > 700;
	const accessEndDate =
		visitStatus && visitStatus.endAt ? formatMediumDateWithTime(asDate(visitStatus.endAt)) : '';
	const accessEndDateMobile =
		visitStatus && visitStatus.endAt
			? isToday(asDate(visitStatus.endAt) ?? 0)
				? formatTime(asDate(visitStatus.endAt))
				: formatDate(asDate(visitStatus.endAt))
			: '';

	/**
	 * Mapping
	 */
	const mapSimilarData = (data: MediaSimilarHit[]): MediaObject[] => {
		return data.map((hit) => {
			return {
				type: hit._source.dcterms_format as MediaTypes,
				title: hit._source.schema_name,
				subtitle: `(${
					hit._source.schema_date_published
						? formatMediumDate(asDate(hit._source.schema_date_published))
						: undefined
				})`,
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
				subtitle: `(${
					item.datePublished ? formatMediumDate(asDate(item.datePublished)) : undefined
				})`,
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

	const handleOnPlay = () => {
		setPauseMedia(false);
		if (!isPlayEventFired) {
			setIsPlayEventFired(true);
			EventsService.triggerEvent(LogEventType.ITEM_PLAY, window.location.href, {
				schema_identifier: router.query.ie as string,
			});
		}
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
		if (FLOWPLAYER_FORMATS.includes(representation.dctermsFormat)) {
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
					pause={pauseMedia}
					onPlay={handleOnPlay}
					token={publicRuntimeConfig.FLOW_PLAYER_TOKEN}
					dataPlayerId={publicRuntimeConfig.FLOW_PLAYER_ID}
				/>
			);
		}

		// Image
		if (IMAGE_FORMATS.includes(representation.dctermsFormat)) {
			return (
				// TODO: replace with real image
				<div className="p-object-detail__image">
					<Image
						src={representation.files[0].schemaIdentifier}
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
		if (isErrorPlayableUrl) {
			return <ObjectPlaceholder {...ticketErrorPlaceholder()} />;
		}

		return null;
	};

	// Metadata
	const renderCard = (item: MediaObject, isHidden: boolean) => (
		<li>
			<Link passHref href={`/${item.maintainer_id}/${item.id}`}>
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
			className={`u-list-reset p-object-detail__metadata-list p-object-detail__metadata-list--${type}`}
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

	return (
		<VisitorLayout>
			<div className="p-object-detail">
				<Head>
					<title>{createPageTitle('Object detail')}</title>
					<meta name="description" content="Object detail omschrijving" />
				</Head>
				<ReadingRoomNavigation
					className="p-object-detail__nav"
					showBorder={showNavigationBorder}
					title={mediaInfo?.maintainerName ?? ''}
					backLink={backLink}
					showAccessEndDate={
						accessEndDate || accessEndDateMobile
							? isMobile
								? t(
										'pages/leeszaal/reading-room-slug/object-id/index___toegang-tot-access-end-date',
										{ accessEndDate }
								  )
								: t('pages/slug/ie/index___tot-access-end-date-mobile', {
										accessEndDateMobile,
								  })
							: undefined
					}
				/>
				<ScrollableTabs
					className="p-object-detail__tabs"
					variants={['dark']}
					tabs={tabs}
					onClick={onTabClick}
				/>
				{isLoadingMediaInfo && <Loading />}
				{isError && (
					<p className={'p-object-detail__error'}>
						{t(
							'pages/leeszaal/reading-room-slug/object-id/index___er-ging-iets-mis-bij-het-ophalen-van-de-data'
						)}
					</p>
				)}{' '}
				<article
					className={clsx(
						'p-object-detail__wrapper',
						isLoadingMediaInfo && 'p-object-detail--hidden ',
						isError && 'p-object-detail--hidden ',
						expandMetadata && 'p-object-detail__wrapper--expanded',
						activeTab === ObjectDetailTabs.Metadata &&
							'p-object-detail__wrapper--metadata',
						activeTab === ObjectDetailTabs.Media && 'p-object-detail__wrapper--video'
					)}
				>
					{mediaType && (
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
					<div className="p-object-detail__video">
						{mediaType ? (
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
										thumbnail={mediaInfo.thumbnailUrl}
										className="p-object-detail__slider"
										fragments={mediaInfo?.representations ?? []}
										onChangeFragment={(index) =>
											setCurrentRepresentation(
												mediaInfo?.representations[index]
											)
										}
									/>
								)}
							</>
						) : (
							<>
								<ObjectPlaceholder {...objectPlaceholder()} />
							</>
						)}
					</div>
					<div
						ref={metadataRef}
						className={clsx(
							'p-object-detail__metadata',
							'p-object-detail__metadata--collapsed',
							expandMetadata && 'p-object-detail__metadata--expanded',
							!mediaType && 'p-object-detail__metadata--no-media'
						)}
					>
						<div>
							<div className="u-px-32">
								<h3 className="u-pt-32 u-pb-24">{mediaInfo?.name}</h3>
								<p className="u-pb-24 u-line-height-1-4">
									{mediaInfo?.description}
								</p>
								<div className="u-pb-24 p-object-detail__actions">
									<Button
										className="p-object-detail__export"
										iconStart={<Icon name="export" />}
									>
										<span className="u-text-ellipsis u-display-none u-display-block:md">
											{t(
												'pages/leeszaal/reading-room-slug/object-id/index___exporteer-metadata'
											)}
										</span>
										<span className="u-text-ellipsis u-display-none:md">
											{t(
												'pages/leeszaal/reading-room-slug/object-id/index___metadata'
											)}
										</span>
									</Button>
									<DynamicActionMenu
										{...MEDIA_ACTIONS()}
										onClickAction={onClickAction}
									/>
								</div>
							</div>
							{mediaInfo && (
								<>
									<Metadata
										className="u-px-32"
										columns={
											expandMetadata &&
											metadataSize &&
											metadataSize?.width > 500
												? 2
												: 1
										}
										metadata={METADATA_FIELDS(mediaInfo)}
									/>
									{!!similar.length && (
										<Metadata
											className="u-px-32"
											metadata={[
												{
													title: t(
														'pages/leeszaal/reading-room-slug/object-id/index___trefwoorden'
													),
													data: mapKeywordsToTagList(mediaInfo.keywords),
												},
												{
													title: 'Ook interessant',
													data: renderMetadataCards('similar', similar),
													className: 'u-pb-0',
												},
											]}
										/>
									)}
								</>
							)}
						</div>
					</div>
					{!!related.length && (
						<RelatedObjectsBlade
							className={clsx(
								'p-object-detail__related',
								'p-object-detail__metadata--collapsed',
								expandMetadata && 'p-object-detail__metadata--expanded'
							)}
							icon={
								<Icon
									className="u-font-size-24 u-mr-8 u-text-left"
									name="related-objects"
								/>
							}
							title={
								related.length === 1
									? t(
											'pages/leeszaal/reading-room-slug/object-id/index___1-gerelateerd-object'
									  )
									: t(
											'pages/leeszaal/reading-room-slug/object-id/index___amount-gerelateerde-objecten',
											{
												amount: related.length,
											}
									  )
							}
							renderContent={(hidden) =>
								renderMetadataCards('related', related, hidden)
							}
						/>
					)}
				</article>
			</div>
			<AddToCollectionBlade
				isOpen={activeBlade === MediaActions.Bookmark}
				selected={{
					schemaIdentifier: mediaInfo?.schemaIdentifier ?? '',
					title: mediaInfo?.name,
				}}
				onClose={onCloseBlade}
				onSubmit={onCloseBlade}
			/>
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(ObjectDetailPage);
