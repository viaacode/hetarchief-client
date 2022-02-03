import { Button, TagList } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';

import { ReadingRoomNavigation } from '@reading-room/components/ReadingRoomNavigation';
import { Icon } from '@shared/components';
import { createPageTitle } from '@shared/utils';
import { withI18n } from '@shared/wrappers';

import { Metadata } from 'modules/object-detail/components';
import { metadataMock } from 'modules/object-detail/components/Metadata/__mocks__/metadata';

const ObjectDetailPage: NextPage = () => {
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
				<div>fragment placeholder</div>
				<div className="p-object-detail__metadata">
					<div className="u-px-32">
						{/* TODO: bind content to state */}
						<h3 className="u-pt-32 u-pb-24">Object detail</h3>
						<p className="u-pb-24">
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
							consectetur rutrum molestie. Mauris volutpat commodo velit, id fringilla
							neque. Integer at fringilla orci, eget hendrerit lorem. Donec malesuada
							non dui a elementum. Pellentesque habitant morbi tristique senectus et
							netus et malesuada fames ac turpis egestas. Vivamus convallis aliquet
							tellus a rutrum. Suspendisse ut posuere lectus, vel elementum sapien.
						</p>
						<div className="u-pb-24">
							<Button label="Exporteer metadata" iconStart={<Icon name="export" />} />
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
