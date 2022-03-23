import { Button, FlowPlayer, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import getConfig from 'next/config';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { FragmentSlider } from '@media/components/FragmentSlider';
import { fragmentSliderMock } from '@media/components/FragmentSlider/__mocks__/fragmentSlider';
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
import { useGetMediaTicketInfo } from '@media/hooks/get-media-ticket-url';
import { MediaActions, MediaRepresentation, MediaTypes, ObjectDetailTabs } from '@media/types';
import { AddToCollectionBlade, ReadingRoomNavigation } from '@reading-room/components';
import { Icon, Loading, ScrollableTabs, TabLabel } from '@shared/components';
import { useElementSize } from '@shared/hooks/use-element-size';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { createPageTitle, formatAccessDate, parseDatabaseDate } from '@shared/utils';
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

	// Internal state
	const [activeTab, setActiveTab] = useState<string | number | null>(null);
	const [activeBlade, setActiveBlade] = useState<MediaActions | null>(null);
	const [mediaType, setMediaType] = useState<MediaTypes>(null);
	const [pauseMedia, setPauseMedia] = useState(true);
	const [currentRepresentation, setCurrentRepresentaton] = useState<
		MediaRepresentation | undefined
	>(undefined);
	const [flowPlayerKey, setFlowPlayerKey] = useState<string | undefined>(undefined);

	// Layout
	useStickyLayout();
	useNavigationBorder();
	useHideFooter();

	// Sizes
	const windowSize = useWindowSizeContext();
	const showNavigationBorder = useSelector(selectShowNavigationBorder);

	const metadataRef = useRef<HTMLDivElement>(null);
	const metadataSize = useElementSize(metadataRef);

	// Fetch data
	const {
		data: mediaInfo,
		isLoading: isLoadingMediaInfo,
		isError,
	} = useGetMediaInfo(router.query.objectId as string);

	const {
		data: playableUrl,
		isLoading: isLoadingPlayableUrl,
		isError: isErrorPlayableUrl,
	} = useGetMediaTicketInfo(
		currentRepresentation?.id ?? null,
		() => setFlowPlayerKey(currentRepresentation?.id) // Force flowplayer rerender after successful fetch
	);

	const { data: visitStatus } = useGetActiveVisitForUserAndSpace(
		router.query.readingRoomSlug as string
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		// Mock representations for slider testing
		if (mediaInfo) {
			mediaInfo.representations = [
				...mediaInfo.representations,
				...fragmentSliderMock.fragments,
			];
		}

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

	/**
	 * Variables
	 */
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;
	const showFragmentSlider = mediaInfo?.representations && mediaInfo?.representations.length > 1;
	const accessEndDate =
		visitStatus && visitStatus.endAt
			? formatAccessDate(parseDatabaseDate(visitStatus.endAt))
			: '';

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
	 * Metadata
	 */
	const renderInterestingListItem = (data: RelatedObjectProps) => (
		<li className="u-py-8">
			<RelatedObject {...data} />
		</li>
	);

	/**
	 * Render
	 */

	const renderMedia = (playableUrl: string, representation: MediaRepresentation): ReactNode => {
		// Flowplayer
		if (FLOWPLAYER_FORMATS.includes(representation.dctermsFormat)) {
			return (
				// TODO: implement thumbnail
				<FlowPlayer
					className={clsx(
						'p-object-detail__flowplayer',
						showFragmentSlider && 'p-object-detail__flowplayer--with-slider'
					)}
					key={flowPlayerKey}
					src={playableUrl}
					poster="https://via.placeholder.com/1920x1080"
					title={representation.name}
					pause={pauseMedia}
					onPlay={() => setPauseMedia(false)}
					token={publicRuntimeConfig.FLOWPLAYER_TOKEN}
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
						src={representation.id}
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

	return (
		<VisitorLayout>
			<div className="p-object-detail">
				<Head>
					<title>{createPageTitle('Object detail')}</title>
					<meta name="description" content="Object detail omschrijving" />
				</Head>
				<ReadingRoomNavigation
					showBorder={showNavigationBorder}
					title={mediaInfo?.maintainerName ?? ''}
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
									<Metadata
										className="u-px-32"
										metadata={[
											{
												title: 'Ook interessant',
												data: (
													<ul className="u-list-reset u-bg-platinum u-mx--32 u-px-32 u-py-24 u-mt-24">
														{renderInterestingListItem(
															relatedObjectVideoMock
														)}
														{renderInterestingListItem(
															relatedObjectVideoMock
														)}
														{renderInterestingListItem(
															relatedObjectVideoMock
														)}
													</ul>
												),
												className: 'u-pb-0',
											},
										]}
									/>
								</>
							)}
						</div>
					</div>
				</article>
			</div>
			<AddToCollectionBlade
				isOpen={activeBlade === MediaActions.Bookmark}
				selected={{
					id: mediaInfo?.id ?? '',
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
