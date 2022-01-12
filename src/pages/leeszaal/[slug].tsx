import { Button, TabProps } from '@meemoo/react-components';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { READING_ROOM_QUERY_PARAM_CONFIG, READING_ROOM_TABS } from '@reading-room/const';
import {
	Icon,
	IconProps,
	MediaCardProps,
	MediaCardViewMode,
	Navigation,
	Placeholder,
	ScrollableTabs,
	TabLabel,
} from '@shared/components';
import { MediaCardList } from '@shared/components/MediaCardList';
import { mock } from '@shared/components/MediaCardList/__mocks__/media-card-list';
import { createPageTitle } from '@shared/utils';

const ReadingRoomPage: NextPage = () => {
	const [query, setQuery] = useQueryParams(READING_ROOM_QUERY_PARAM_CONFIG);
	const [media, setMedia] = useState<MediaCardProps[]>([]);
	const [mode] = useState<MediaCardViewMode>('grid');

	const tabs: TabProps[] = useMemo(
		() =>
			READING_ROOM_TABS.map((tab) => ({
				...tab,
				icon: <Icon name={tab.icon as IconProps['name']} />,
				// TODO: remove any once Tab type supports ReactNode
				label: (<TabLabel label={tab.label} count={0} />) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
				active: tab.id === query.mediaType,
			})),
		[query.mediaType]
	);

	useEffect(() => {
		async function fetchMedia() {
			const data = (await mock({ view: 'grid' })).items;
			data && setMedia(data);
		}

		fetchMedia();
	}, [setMedia]);

	/**
	 * Methods
	 */

	const onTabClick = (tabId: string | number) => {
		setQuery({ mediaType: String(tabId) });
	};

	/**
	 * Render
	 */

	return (
		<div className="p-reading-room">
			<Head>
				<title>{createPageTitle('Leeszaal')}</title>
				<meta name="description" content="Leeszaal omschrijving" />
			</Head>

			<Navigation contextual>
				<Navigation.Left>
					<Link href="/" passHref={true}>
						<Button
							icon={<Icon name="arrow-left" />}
							variants="text"
							className="u-color-white u-ml--12"
						/>
					</Link>
				</Navigation.Left>
				<Navigation.Center title="Leeszaal" />
				<Navigation.Right>
					<Button
						label="Contacteer"
						iconStart={<Icon className="u-fs-24" name="contact" />}
						variants="text"
						className="u-color-white u-mr--12 u-px-12 p-reading-room__contact-button"
					/>
				</Navigation.Right>
			</Navigation>
			<section className="u-bg-black">
				<div className="l-container">
					<ScrollableTabs tabs={tabs} onClick={onTabClick} />
				</div>
			</section>

			<section className="u-py-48">
				<div className="l-container">
					{media.length > 0 ? (
						<MediaCardList items={media} view={mode} />
					) : (
						<Placeholder
							img="/images/lightbulb.svg"
							title="Start je zoektocht!"
							description="Zoek op trefwoorden, jaartallen, aanbieders… en start je research."
						/>
					)}
				</div>
			</section>
		</div>
	);
};

export default ReadingRoomPage;
