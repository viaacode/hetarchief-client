import { Button, TextInput } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { AuthModal } from '@auth/components';
import { HOME_QUERY_PARAM_CONFIG } from '@home/const';
import { Hero, Icon, ReadingRoomCardList } from '@shared/components';
import { sixItems } from '@shared/components/ReadingRoomCardList/__mocks__/reading-room-card-list';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

const Home: NextPage = () => {
	const [areAllReadingRoomsVisible, setAreAllReadingRoomsVisible] = useState(false);
	const [readingRooms, setReadingRooms] = useState(sixItems);
	const [searchValue, setSearchValue] = useState('');

	const showAuthModal = useSelector(selectShowAuthModal);
	const dispatch = useDispatch();
	const [, setQuery] = useQueryParams(HOME_QUERY_PARAM_CONFIG);
	const { t } = useTranslation();

	// Sync showAuthModal query param with store
	useEffect(() => {
		setQuery({ showAuthModal });
	}, [setQuery, showAuthModal]);

	/**
	 * Methods
	 */

	const handleLoadAllReadingRooms = () => {
		Promise.resolve([...sixItems, ...sixItems]).then((data) => {
			setReadingRooms(data);
			setAreAllReadingRoomsVisible(true);
		});
	};

	const onCloseAuthModal = () => {
		dispatch(setShowAuthModal(false));
	};

	const onSearchKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setQuery({ search: searchValue });
		}
	};

	/**
	 * Render
	 */

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

			<div className="l-container u-pt-32 u-pt-80:md u-pb-48 u-pb-80:md">
				<div className="u-flex u-flex-col u-flex-row:md u-align-center u-justify-between:md u-mb-32 u-mb-80:md">
					<h3 className="p-home__subtitle">{t('pages/index___vind-een-leeszaal')}</h3>

					<TextInput
						className="p-home__search"
						iconEnd={<Icon name="search" />}
						placeholder="Zoek"
						value={searchValue}
						variants={['grey', 'large', 'rounded']}
						onChange={(e) => setSearchValue(e.target.value)}
						onKeyUp={onSearchKeyUp as () => void}
					/>
				</div>

				<ReadingRoomCardList
					className="u-mb-64"
					items={readingRooms}
					limit={!areAllReadingRoomsVisible}
				/>

				{!areAllReadingRoomsVisible && (
					<div className="u-text-center">
						<Button onClick={handleLoadAllReadingRooms} variants={['outline']}>
							Toon alles (123)
						</Button>
					</div>
				)}
			</div>

			<AuthModal isOpen={showAuthModal} onClose={onCloseAuthModal} />
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
