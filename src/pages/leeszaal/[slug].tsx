import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { MediaCardProps, MediaCardViewMode, Navigation, Placeholder } from '@shared/components';
import { MediaCardList } from '@shared/components/MediaCardList';
import { mock } from '@shared/components/MediaCardList/__mocks__/media-card-list';

const ReadingRoomPage: NextPage = () => {
	const [media, setMedia] = useState<MediaCardProps[]>([]);
	const [mode] = useState<MediaCardViewMode>('grid');

	useEffect(() => {
		async function fetchMedia() {
			const data = (await mock({ view: 'grid' })).items;
			data && setMedia(data);
		}

		fetchMedia();
	}, [setMedia]);

	return (
		<div className="p-reading-room">
			<Head>
				<title>Leeszaal</title>
				<meta name="description" content="Leeszaal omschrijving" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Navigation contextual>
				<Navigation.Left>
					<Link href="/">Terug</Link>
				</Navigation.Left>
				<Navigation.Center title="Leeszaal" />
				<Navigation.Right />
			</Navigation>

			<div style={{ padding: '3.2rem' }}>
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
		</div>
	);
};

export default ReadingRoomPage;
