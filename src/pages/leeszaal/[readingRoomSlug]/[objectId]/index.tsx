import { Button, TagList } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';

import { withI18n } from '@i18n/wrappers';
import { ReadingRoomNavigation } from '@reading-room/components/ReadingRoomNavigation';
import { Icon } from '@shared/components';
import { useNavigationContext, useStickyLayout } from '@shared/hooks';
import { createPageTitle } from '@shared/utils';

import { DynamicActionMenu, Metadata, ObjectPlaceholder } from 'modules/media/components';
import { dynamicActionMenuMock } from 'modules/media/components/DynamicActionMenu/__mocks__/dynamic-action-menu';
import { metadataMock } from 'modules/media/components/Metadata/__mocks__/metadata';
import { objectPlaceholderMock } from 'modules/media/components/ObjectPlaceholder/__mocks__/object-placeholder';

const ObjectDetailPage: NextPage = () => {
	const { t } = useTranslation();
	useStickyLayout();
	useNavigationContext({ isBordered: true });

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
						<h3 className="u-pt-32 u-pb-24">Op de koop toe: schepijs (1993)</h3>
						<p className="u-pb-24">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
							consectetur rutrum molestie. Mauris volutpat commodo velit, id fringilla
							neque. Integer at fringilla orci, eget hendrerit lorem. Donec malesuada
							non dui a elementum. Pellentesque habitant morbi tristique senectus et
							netus et malesuada fames ac turpis egestas. Vivamus convallis aliquet
							tellus a rutrum. Suspendisse ut posuere lectus, vel elementum sapien.
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
							<DynamicActionMenu {...dynamicActionMenuMock} />
						</div>
						<Metadata
							metadata={[
								...metadataMock.metadata,
								{
									title: 'Trefwoorden',
									data: (
										<TagList
											className="u-pt-12"
											tags={tags}
											onTagClicked={(id) => console.log(id)}
											variants={['clickable', 'silver', 'medium']}
										/>
									),
								},
							]}
						/>
					</div>
				</div>
			</article>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default ObjectDetailPage;
