import { Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import { Hero, ReadingRoomCardList } from '@shared/components';
import { sixItems } from '@shared/components/ReadingRoomCardList/__mocks__/reading-room-card-list';
import { createPageTitle } from '@shared/utils';

const Home: NextPage = () => {
	const { t } = useTranslation();

	const [readingRooms, setReadingRooms] = useState(sixItems);
	const [areAllReadingRoomsVisible, setAreAllReadingRoomsVisible] = useState(false);

	const handleLoadAllReadingRooms = () => {
		Promise.resolve([...sixItems, ...sixItems]).then((data) => {
			setReadingRooms(data);
			setAreAllReadingRoomsVisible(true);
		});
	};

	return (
		<div className="p-home">
			<Head>
				<title>{createPageTitle('Home')}</title>
				<meta name="description" content="TODO: Home meta description" />
			</Head>

			<Hero
				image={{ src: '/images/hero.png', alt: 'Hero image' }}
				title={t('pages/index___welkom-in-de-digitale-leeszaal')}
				description={t(
					'pages/index___plan-een-nieuw-bezoek-stap-fysiek-binnen-en-krijg-meteen-toegang-tot-het-digitale-archief-van-de-leeszaal-benieuwd-hoe-het-werkt'
				)}
				link={{
					label: t('pages/index___hier-kom-je-er-alles-over-te-weten'),
					to: '#',
				}}
			/>

			<div style={{ display: 'grid', placeItems: 'center', padding: '2rem' }}>
				<Link href="/leeszaal/leeszaal-8">Ga naar leeszaal</Link>
			</div>

			<div className="l-container u-mb-64">
				<ReadingRoomCardList items={readingRooms} limit={!areAllReadingRoomsVisible} />
			</div>

			{!areAllReadingRoomsVisible && (
				<div style={{ display: 'grid', placeItems: 'center' }} className="u-mb-80">
					<Button onClick={handleLoadAllReadingRooms} variants={['outline']}>
						Toon alles (123)
					</Button>
				</div>
			)}
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? '')),
		},
	};
};

export default Home;
