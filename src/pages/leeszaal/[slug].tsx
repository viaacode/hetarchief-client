import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { Navigation, Placeholder } from '@shared/components';

const ReadingRoomPage: NextPage = () => {
	return (
		<div className="p-reading-room">
			<Head>
				<title>Leeszaal</title>
				<meta name="description" content="Leeszaal omschrijving" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Navigation contextual>
				<Navigation.Left>
					<Link href="/">Go back</Link>
				</Navigation.Left>
				<Navigation.Center title="Leeszaal" />
				<Navigation.Right />
			</Navigation>

			<Placeholder
				img="/images/lightbulb.svg"
				title="Start je zoektocht!"
				description="Zoek op trefwoorden, jaartallen, aanbieders… en start je research."
			/>
		</div>
	);
};

export default ReadingRoomPage;
