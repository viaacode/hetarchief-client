import { Button, FlowPlayer, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { toLower } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { FragmentSlider } from '@media/components/FragmentSlider';
import { relatedObjectVideoMock } from '@media/components/RelatedObject/__mocks__/related-object';
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
import { useGetMediaSimilar } from '@media/hooks/get-media-similar';
import { useGetMediaTicketInfo } from '@media/hooks/get-media-ticket-url';
import { MediaActions, MediaRepresentation, ObjectDetailTabs } from '@media/types';
import { mapKeywordsToTagList } from '@media/utils';
import { AddToCollectionBlade, ReadingRoomNavigation } from '@reading-room/components';
import { Icon, Loading, ScrollableTabs, TabLabel } from '@shared/components';
import { ROUTES } from '@shared/const';
import { useElementSize } from '@shared/hooks/use-element-size';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectPreviousUrl } from '@shared/store/history';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { MediaTypes } from '@shared/types';
import { asDate, createPageTitle, formatAccessDate, formatWithLocale } from '@shared/utils';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';

import {
	DynamicActionMenu,
	Metadata,
	ObjectPlaceholder,
	RelatedObject,
	RelatedObjectProps,
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
	const [activeTab, setActiveTab] = useState<string | number | null>(null);
	const [activeBlade, setActiveBlade] = useState<MediaActions | null>(null);
	const [mediaType, setMediaType] = useState<MediaTypes>(null);
	const [pauseMedia, setPauseMedia] = useState(true);
	const [currentRepresentation, setCurrentRepresentaton] = useState<
		MediaRepresentation | undefined
	>(undefined);
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | undefined>(undefined);
	const [similar, setSimilar] = useState<RelatedObjectProps[]>([]);

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
	} = useGetMediaInfo(router.query.objectId as string);

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
		router.query.objectId as string,
		toLower(router.query.readingRoomSlug as string)
	);

	// visit info
	const { data: visitStatus } = useGetActiveVisitForUserAndSpace(
		router.query.readingRoomSlug as string
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		// Mock representations for slider testing
		// if (mediaInfo) {
		// 	mediaInfo.representations = [
		// 		...mediaInfo.representations,
		// 		...fragmentSliderMock.fragments,
		// 	];
		// }

		setMediaType(mediaInfo?.dctermsFormat as MediaTypes);

		setCurrentRepresentaton(mediaInfo?.representations[0]);

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
		similarData &&
			setSimilar(
				similarData.hits.hits.map((hit) => {
					return {
						object: {
							type: hit._source.dcterms_format as MediaTypes,
							title: hit._source.schema_name,
							subtitle: `(${
								hit._source.schema_date_published
									? formatWithLocale(
											'PP',
											asDate(hit._source.schema_date_published)
									  )
									: undefined
							})`,
							description: hit._source.schema_description || '',
							// thumbnail: hit._source.schema_thumbnail_url,
							id: hit._source.schema_identifier,
						},
					};
				})
			);
	}, [similarData]);

	/**
	 * Variables
	 */
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider = mediaInfo?.representations && mediaInfo?.representations.length > 1;
	const accessEndDate =
		visitStatus && visitStatus.endAt ? formatAccessDate(asDate(visitStatus.endAt)) : '';

	/**
	 * Effects
	 */
	useEffect(() => {
		// Pause media if metadata tab is shown on mobile
		if (windowSize.width && windowSize.width < 768 && activeTab === ObjectDetailTabs.Metadata) {
			setPauseMedia(true);
		}
	}, [activeTab, windowSize.width]);

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
					onPlay={() => setPauseMedia(false)}
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
	const renderSimilarItems = (items: RelatedObjectProps[]) => (
		<ul className="u-list-reset u-bg-platinum u-mx--32 u-px-32 u-py-24 u-mt-24">
			{items.map((item) => {
				return (
					<li className="u-py-8" key={`similar-object-${item.object.id}`}>
						<Link
							passHref
							href={`/${ROUTES.spaces}/${router.query.readingRoomSlug}/${item.object.id}`}
						>
							<a className="p-object-detail__similar-link">
								{<RelatedObject {...item} />}
							</a>
						</Link>
					</li>
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
					backLink={
						previousUrl?.startsWith(`/${ROUTES.spaces}/`)
							? previousUrl
							: `/${ROUTES.spaces}/${router.query.readingRoomSlug}`
					}
					showAccessEndDate={
						accessEndDate
							? t(
									'pages/leeszaal/reading-room-slug/object-id/index___toegang-tot-access-end-date',
									{ accessEndDate }
							  )
							: ''
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
											setCurrentRepresentaton(
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
							expandMetadata && 'p-object-detail__metadata--expanded',
							!mediaType && 'p-object-detail__metadata--no-media'
						)}
					>
						<div>
							<div className="u-px-32">
								<h3 className="u-pt-32 u-pb-24">{mediaInfo?.name}</h3>
								<p className="u-pb-24">{mediaInfo?.description}</p>
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
													title: t('trefwoorden'),
													data: mapKeywordsToTagList(mediaInfo.keywords),
												},
												{
													title: 'Ook interessant',
													data: renderSimilarItems(similar),
													className: 'u-pb-0',
												},
											]}
										/>
									)}
								</>
							)}
						</div>
					</div>
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
