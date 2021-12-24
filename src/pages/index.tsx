import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { Hero } from '@shared/components';
import { heroMock } from '@shared/components/Hero/__mocks__/hero';

const Home: NextPage = () => {
	return (
		<div className="p-home">
			<Head>
				<title>Home | Het Archief</title>
				<meta name="description" content="TODO: Home meta description" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Hero {...heroMock} />
			<div style={{ display: 'grid', placeItems: 'center', height: '500px' }}>
				<Link href="/leeszaal/leeszaal-8">Ga naar leeszaal</Link>
			</div>
		</div>
	);
};

export default Home;
