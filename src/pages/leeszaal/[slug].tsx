import { TabProps, Tabs } from '@meemoo/react-components';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useMemo } from 'react';

import { Icon, Navigation, Placeholder, TabLabel } from '@shared/components';

const ReadingRoomPage: NextPage = () => {
	const tabs: TabProps[] = useMemo(
		() => [
			{
				id: 'all',
				label: (<TabLabel label="Alles" count={0} />) as any,
				active: true,
			},
			{
				id: 'video',
				icon: <Icon name="video" />,
				label: (<TabLabel label="Video's" count={0} />) as any,
				active: false,
			},
			{
				id: 'audio',
				icon: <Icon name="audio" />,
				label: (<TabLabel label="Audio" count={0} />) as any,
				active: false,
			},
		],
		[]
	);

	/**
	 * Methods
	 */

	const onTabClick = (tabId: string | number) => {
		console.log(tabId);
	};

	/**
	 * Render
	 */

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

			<section className="u-bg-black">
				<div className="l-container">
					<Tabs tabs={tabs} onClick={onTabClick} />
				</div>
			</section>

			<section className="u-py-48">
				<div className="l-container">
					<Placeholder
						img="/images/lightbulb.svg"
						title="Start je zoektocht!"
						description="Zoek op trefwoorden, jaartallen, aanbieders… en start je research."
					/>
				</div>
			</section>
		</div>
	);
};

export default ReadingRoomPage;
