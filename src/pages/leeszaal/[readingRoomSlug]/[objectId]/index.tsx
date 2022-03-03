import { Button, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';

import { withI18n } from '@i18n/wrappers';
import { MEDIA_ACTIONS, OBJECT_DETAIL_TABS, PARSED_METADATA_FIELDS } from '@media/const';
import { useGetMediaInfo } from '@media/hooks/get-media-info';
import { MediaTypes, ObjectDetailTabs } from '@media/types';
import { ReadingRoomNavigation } from '@reading-room/components/ReadingRoomNavigation';
import { Icon, ScrollableTabs, TabLabel } from '@shared/components';
import { useElementSize, useNavigationBorder, useStickyLayout, useWindowSize } from '@shared/hooks';
import { useFooter } from '@shared/hooks/use-footer';
import { createPageTitle } from '@shared/utils';

import { DynamicActionMenu, Metadata, ObjectPlaceholder } from 'modules/media/components';
import { objectPlaceholderMock } from 'modules/media/components/ObjectPlaceholder/__mocks__/object-placeholder';

const ObjectDetailPage: NextPage = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();
	const router = useRouter();

	// Internal state
	const [activeTab, setActiveTab] = useState<string | number | undefined>(undefined);
	const [mediaType, setMediaType] = useState<MediaTypes>(null);

	// Layout
	useStickyLayout();
	useNavigationBorder();
	useFooter();

	// Sizes
	const windowSize = useWindowSize();
	const metadataRef = useRef<HTMLDivElement>(null);
	const metadataSize = useElementSize(metadataRef);

	// Fetch data
	const { data: mediaInfo, isLoading: isLoadingMediaInfo } = useGetMediaInfo(
		router.query.objectId as string
	);
	console.log(isLoadingMediaInfo ? 'loading...' : 'finished!', mediaInfo);

	// Set default view
	useEffect(() => {
		setMediaType((mediaInfo as any)?.dctermsFormat);

		if (windowSize.width && windowSize.width < 768) {
			// Default to metadata tab on mobile
			setActiveTab(ObjectDetailTabs.Metadata);
		} else {
			// Check media content for default tab on desktop
			setActiveTab(
				(mediaInfo as any)?.dctermsFormat
					? ObjectDetailTabs.Media
					: ObjectDetailTabs.Metadata
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mediaInfo]);

	/**
	 * Variables
	 */
	const expandMetadata = activeTab === ObjectDetailTabs.Metadata;

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
	 * Render
	 */

	return (
		<div className="p-object-detail">
			<Head>
				<title>{createPageTitle('Object detail')}</title>
				<meta name="description" content="Object detail omschrijving" />
			</Head>
			{/* TODO: bind title to state */}
			{/* TODO: use correct left and right sections */}
			<ReadingRoomNavigation className="p-object-detail__nav" title={'Leeszaal'} />
			<ScrollableTabs
				className="p-object-detail__tabs"
				variants={['dark']}
				tabs={tabs}
				onClick={onTabClick}
			/>
			{!isLoadingMediaInfo && mediaInfo ? (
				<article
					className={clsx(
						'p-object-detail__wrapper',
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
							<p>media</p>
						) : (
							<ObjectPlaceholder
								{...objectPlaceholderMock}
								openModalButtonLabel={t(
									'pages/leeszaal/reading-room-slug/object-id/index___meer-info'
								)}
								closeModalButtonLabel={t(
									'pages/leeszaal/reading-room-slug/object-id/index___sluit'
								)}
							/>
						)}
					</div>
					<div
						ref={metadataRef}
						className={clsx(
							'p-object-detail__metadata',
							expandMetadata && 'p-object-detail__metadata--expanded'
						)}
					>
						<div className="u-px-32">
							{/* TODO: bind content to state */}
							<h3 className="u-pt-32 u-pb-24">{(mediaInfo as any).name}</h3>
							<p className="u-pb-24">{(mediaInfo as any).description}</p>
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
								<DynamicActionMenu {...MEDIA_ACTIONS} />
							</div>
							<Metadata
								columns={
									expandMetadata && metadataSize && metadataSize?.width > 500
										? 2
										: 1
								}
								metadata={PARSED_METADATA_FIELDS(mediaInfo as any)}
							/>
						</div>
					</div>
				</article>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default ObjectDetailPage;
