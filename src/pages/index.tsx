import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { Hero } from '@shared/components';
import { heroMock } from '@shared/components/Hero/__mocks__/hero';
import { createPageTitle } from '@shared/utils';

const Home: NextPage = () => {
	return (
		<div className="p-home">
			<Head>
				<title>{createPageTitle('Home')}</title>
				<meta name="description" content="TODO: Home meta description" />
			</Head>

			<Hero {...heroMock} />
			<div style={{ display: 'grid', placeItems: 'center', height: '500px' }}>
				<Link href="/leeszaal/leeszaal-8">Ga naar leeszaal</Link>
			</div>
		</div>
	);
};

export default Home;
