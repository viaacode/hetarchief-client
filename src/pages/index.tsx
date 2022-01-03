import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';

const Home: NextPage = () => {
	const { t } = useTranslation();

	return (
		<div className="p-home">
			<Head>
				<title>Home | Het Archief</title>
				<meta name="description" content="TODO: Home meta description" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div style={{ display: 'grid', placeItems: 'center', height: '500px' }}>
				<h1>{t('pages/index___welkom-in-de-digitale-leeszaal')}</h1>
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
