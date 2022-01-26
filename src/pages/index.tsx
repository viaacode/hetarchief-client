import { Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { AuthModal } from '@auth/components';
import { selectUser } from '@auth/store/user';
import { HOME_QUERY_PARAM_CONFIG } from '@home/const';
import { Hero, ReadingRoomCardList, SearchBar } from '@shared/components';
import { heroRequests } from '@shared/components/Hero/__mocks__/hero';
import { sixItems } from '@shared/components/ReadingRoomCardList/__mocks__/reading-room-card-list';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';
import { withI18n } from '@shared/wrappers';

const Home: NextPage = () => {
	const [areAllReadingRoomsVisible, setAreAllReadingRoomsVisible] = useState(false);
	const [readingRooms, setReadingRooms] = useState(sixItems);

	const dispatch = useDispatch();
	const [query, setQuery] = useQueryParams(HOME_QUERY_PARAM_CONFIG);
	const user = useSelector(selectUser);
	const showAuthModal = useSelector(selectShowAuthModal);
	const { t } = useTranslation();

	/**
	 * Methods
	 */

	const handleLoadAllReadingRooms = () => {
		Promise.resolve([...sixItems, ...sixItems]).then((data) => {
			setReadingRooms(data);
			setAreAllReadingRoomsVisible(true);
		});
	};

	const onClearSearch = () => {
		setQuery({ search: undefined });
	};

	const onSearch = (searchValue: string) => {
		setQuery({ search: searchValue });
	};

	const onCloseAuthModal = () => {
		dispatch(setShowAuthModal(false));
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
				user={user}
				requests={heroRequests}
			/>

			<div className="l-container u-pt-32 u-pt-80:md u-pb-48 u-pb-80:md">
				<div className="u-flex u-flex-col u-flex-row:md u-align-center u-justify-between:md u-mb-32 u-mb-80:md">
					<h3 className="p-home__subtitle">{t('pages/index___vind-een-leeszaal')}</h3>

					<SearchBar
						className="p-home__search"
						placeholder="Zoek"
						backspaceRemovesValue={false}
						searchValue={query.search ?? ''}
						onClear={onClearSearch}
						onSearch={onSearch}
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

export const getServerSideProps: GetServerSideProps = withI18n();

export default Home;
