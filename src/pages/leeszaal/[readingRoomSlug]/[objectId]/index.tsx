import { Button, FlowPlayer, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { withI18n } from '@i18n/wrappers';
import { relatedObjectVideoMock } from '@media/components/RelatedObject/__mocks__/related-object';
import { MEDIA_ACTIONS, OBJECT_DETAIL_TABS, PARSED_METADATA_FIELDS } from '@media/const';
import { useGetMediaInfo } from '@media/hooks/get-media-info';
import { MediaActions, MediaTypes, ObjectDetailTabs } from '@media/types';
import { AddToCollectionBlade } from '@reading-room/components';
import { ReadingRoomNavigation } from '@reading-room/components/ReadingRoomNavigation';
import { Icon, Loading, ScrollableTabs, TabLabel } from '@shared/components';
import { useElementSize } from '@shared/hooks/use-element-size';
import { useHideFooter } from '@shared/hooks/use-hide-footer';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { useStickyLayout } from '@shared/hooks/use-sticky-layout';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

import {
	DynamicActionMenu,
	Metadata,
	ObjectPlaceholder,
	RelatedObject,
	RelatedObjectProps,
} from 'modules/media/components';
import { objectPlaceholderMock } from 'modules/media/components/ObjectPlaceholder/__mocks__/object-placeholder';

const ObjectDetailPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();
	const router = useRouter();

	// Internal state
	const [activeTab, setActiveTab] = useState<string | number | undefined>(undefined);
	const [activeBlade, setActiveBlade] = useState<MediaActions | undefined>(undefined);
	const [mediaType, setMediaType] = useState<MediaTypes>(null);
	const [pauseMedia, setPauseMedia] = useState(true);

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
	const { data: mediaInfo, isLoading: isLoadingMediaInfo } = useGetMediaInfo(
		router.query.objectId as string
	);
	console.log(isLoadingMediaInfo ? 'loading...' : 'finished!', mediaInfo);

	// Set default view
	useEffect(() => {
		setMediaType(mediaInfo?.dctermsFormat as MediaTypes);

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

	return (
		<>
			{/* <!-- Flowplayer --> */}
			<Script strategy="beforeInteractive" src="/flowplayer/flowplayer.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/speed.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/chromecast.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/airplay.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/subtitles.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/hls.min.js" />
			<Script strategy="beforeInteractive" src="/flowplayer/plugins/cuepoints.min.js" />
			<Script
				strategy="beforeInteractive"
				src="/flowplayer/plugins/google-analytics.min.js"
			/>
			<div className={'p-object-detail'}>
				<Head>
					<title>{createPageTitle('Object detail')}</title>
					<meta name="description" content="Object detail omschrijving" />
				</Head>
				{/* TODO: bind title to state */}
				<ReadingRoomNavigation
					showBorder={showNavigationBorder}
					className="p-object-detail__nav"
					title={'Leeszaal'}
				/>
				<ScrollableTabs
					className="p-object-detail__tabs"
					variants={['dark']}
					tabs={tabs}
					onClick={onTabClick}
				/>
				{isLoadingMediaInfo && <Loading />}
				<article
					className={clsx(
						'p-object-detail__wrapper',
						isLoadingMediaInfo && 'p-object-detail--loading',
						expandMetadata && 'p-object-detail__wrapper--expanded',
						activeTab === ObjectDetailTabs.Metadata &&
							'p-object-detail__wrapper--metadata',
						activeTab === ObjectDetailTabs.Media && 'p-object-detail__wrapper--video'
					)}
				>
					<Button
						className={clsx(
							'p-object-detail__expand-button',
							expandMetadata && 'p-object-detail__expand-button--expanded'
						)}
						icon={<Icon name={expandMetadata ? 'expand-right' : 'expand-left'} />}
						onClick={onClickToggle}
						variants="white"
					/>
					<div className="p-object-detail__video">
						{mediaType ? (
							<FlowPlayer
								className="p-object-detail__flowplayer"
								src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
								poster="https://via.placeholder.com/1920x1080"
								title="Elephants dream"
								pause={pauseMedia}
								onPlay={() => setPauseMedia(false)}
							/>
						) : (
							<>
								<ObjectPlaceholder
									{...objectPlaceholderMock}
									openModalButtonLabel={t(
										'pages/leeszaal/reading-room-slug/object-id/index___meer-info'
									)}
									closeModalButtonLabel={t(
										'pages/leeszaal/reading-room-slug/object-id/index___sluit'
									)}
								/>
							</>
						)}
					</div>
					<div
						ref={metadataRef}
						className={clsx(
							'p-object-detail__metadata',
							expandMetadata && 'p-object-detail__metadata--expanded'
						)}
					>
						<div>
							<div className="u-px-32">
								{/* TODO: bind content to state */}
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
										onClickAction={(id) => setActiveBlade(id as MediaActions)}
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
										metadata={PARSED_METADATA_FIELDS(mediaInfo)}
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
					id: mediaInfo?.meemooFragmentId ?? '',
					title: mediaInfo?.name,
				}}
				onClose={() => {
					setActiveBlade(undefined);
				}}
				onSubmit={() => {
					setActiveBlade(undefined);
				}}
			/>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default ObjectDetailPage;
