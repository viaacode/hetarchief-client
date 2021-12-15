import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
	return (
		<div className="p-home">
			<Head>
				<title>Home | Het Archief</title>
				<meta name="description" content="TODO: Home meta description" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div style={{ display: 'grid', placeItems: 'center', height: '500px' }}>
				<h1>Welcome in de digitale leeszaal</h1>
				<Link href="/leeszaal/leeszaal-8">Ga naar leeszaal</Link>
			</div>
		</div>
	);
};

export default Home;
