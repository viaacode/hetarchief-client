import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

import { Hero } from '@shared/components';
import {
	heroDescription,
	heroImage,
	heroLink,
	heroTitle,
} from '@shared/components/Hero/__mocks__/hero';
import Modal from 'modules/shared/components/Modal/Modal';

const Home: NextPage = () => {
	const [modalOpen, setModalOpen] = useState(false);
	return (
		<div className="p-home">
			<Head>
				<title>Home | Het Archief</title>
				<meta name="description" content="TODO: Home meta description" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Hero
				title={heroTitle}
				description={heroDescription}
				link={heroLink}
				image={heroImage}
			/>
			<div style={{ display: 'grid', placeItems: 'center', height: '500px' }}>
				<h1>Welkom in de digitale leeszaal</h1>
				<Link href="/leeszaal/leeszaal-8">Ga naar leeszaal</Link>
			</div>
		</div>
	);
};

export default Home;
