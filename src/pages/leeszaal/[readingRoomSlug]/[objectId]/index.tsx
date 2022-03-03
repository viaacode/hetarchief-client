import { Button, TagList } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';

import { withI18n } from '@i18n/wrappers';
import { MEDIA_ACTIONS } from '@media/const';
import { useGetMediaInfo } from '@media/hooks/get-media-info';
import { MediaInfo } from '@media/types';
import { mapMetadata } from '@media/utils';
import { ReadingRoomNavigation } from '@reading-room/components/ReadingRoomNavigation';
import { Icon } from '@shared/components';
import { useNavigationBorder, useStickyLayout } from '@shared/hooks';
import { createPageTitle } from '@shared/utils';

import { DynamicActionMenu, Metadata, ObjectPlaceholder } from 'modules/media/components';
import { objectPlaceholderMock } from 'modules/media/components/ObjectPlaceholder/__mocks__/object-placeholder';

const ObjectDetailPage: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	useStickyLayout();
	useNavigationBorder();
	const { data: mediaInfo, isLoading: isLoadingMediaInfo } = useGetMediaInfo(
		router.query.objectId as string
	);
	// const hasMedia = !!mediaInfo?.embedUrl;
	// console.log(mediaInfo, isLoadingMediaInfo);

	/**
	 * Mock data
	 */
	const tags = [
		{
			label: 'Schepijs',
			id: 'schepijs',
		},
		{
			label: 'Op de koop toe',
			id: 'op de koop toe',
		},
		{
			label: 'Rita Van Neygen',
			id: 'rita van neygen',
		},
		{
			label: 'Emiel Goelen',
			id: 'emiel goelen',
		},
	];

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
			<ReadingRoomNavigation title={'Leeszaal'} />
			{!isLoadingMediaInfo && mediaInfo ? (
				<article className="p-object-detail__wrapper">
					<ObjectPlaceholder
						{...objectPlaceholderMock}
						openModalButtonLabel={t(
							'pages/leeszaal/reading-room-slug/object-id/index___meer-info'
						)}
						closeModalButtonLabel={t(
							'pages/leeszaal/reading-room-slug/object-id/index___sluit'
						)}
					/>
					<div className="p-object-detail__metadata">
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
							<Metadata metadata={mapMetadata(mediaInfo as any)} />
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
