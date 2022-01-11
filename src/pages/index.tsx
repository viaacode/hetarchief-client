import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

import { Hero } from '@shared/components';
import { createPageTitle } from '@shared/utils';

const Home: NextPage = () => {
	const { t } = useTranslation();

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
