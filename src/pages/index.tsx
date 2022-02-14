import { Button } from '@meemoo/react-components';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryParams } from 'use-query-params';

import { AuthModal } from '@auth/components';
import { selectIsLoggedIn, selectUser } from '@auth/store/user';
import { RequestAccessBlade } from '@home/components';
import { HOME_QUERY_PARAM_CONFIG } from '@home/const';
import { withI18n } from '@i18n/wrappers';
import { useGetReadingRooms } from '@reading-room/hooks/get-reading-rooms';
import { ReadingRoomInfo } from '@reading-room/types';
import {
	Hero,
	ReadingRoomCardList,
	ReadingRoomCardProps,
	ReadingRoomCardType,
	SearchBar,
} from '@shared/components';
import { heroRequests } from '@shared/components/Hero/__mocks__/hero';
import { selectShowAuthModal, setShowAuthModal } from '@shared/store/ui';
import { createPageTitle } from '@shared/utils';

const Home: NextPage = () => {
	const [areAllReadingRoomsVisible, setAreAllReadingRoomsVisible] = useState(false);
	const [isOpenRequestAccessBlade, setIsOpenRequestAccessBlade] = useState(false);

	const dispatch = useDispatch();
	const [query, setQuery] = useQueryParams(HOME_QUERY_PARAM_CONFIG);
	const isLoggedIn = useSelector(selectIsLoggedIn);
	const user = useSelector(selectUser);
	const showAuthModal = useSelector(selectShowAuthModal);
	const { t } = useTranslation();
	const { data: readingRoomInfo, isLoading: isLoadingReadingRooms } = useGetReadingRooms(
		query.search || undefined,
		0,
		areAllReadingRoomsVisible ? 200 : 6
	);

	// Sync showAuth query param with store value
	useEffect(() => {
		if (typeof query.showAuth === 'boolean') {
			dispatch(setShowAuthModal(query.showAuth));
		}
	}, [dispatch, query.showAuth]);

	// Open request blade after user requested access and wasn't logged in
	useEffect(() => {
		if (!showAuthModal && isLoggedIn && query.returnToRequestAccess) {
			setIsOpenRequestAccessBlade(true);
		}
	}, [isLoggedIn, query.returnToRequestAccess, setQuery, showAuthModal]);

	/**
	 * Methods
	 */

	const handleLoadAllReadingRooms = () => {
		setAreAllReadingRoomsVisible(true);
	};

	const onClearSearch = () => {
		setQuery({ search: undefined });
	};

	const onSearch = (searchValue: string) => {
		setQuery({ search: searchValue });
	};

	const onCloseAuthModal = () => {
		if (typeof query.showAuth === 'boolean') {
			setQuery({ showAuth: undefined });
		}
		dispatch(setShowAuthModal(false));
	};

	const onOpenAuthModal = () => {
		dispatch(setShowAuthModal(true));
	};

	const onCloseRequestBlade = () => {
		if (typeof query.returnToRequestAccess === 'boolean') {
			setQuery({ returnToRequestAccess: undefined });
		}
		setIsOpenRequestAccessBlade(false);
	};

	const onRequestAccess = () => {
		if (isLoggedIn) {
			setIsOpenRequestAccessBlade(true);
		} else {
			onOpenAuthModal();
			setQuery({ returnToRequestAccess: true });
		}
	};

	const onRequestAccessSubmit = () => {
		// TODO: add create request call here
		setIsOpenRequestAccessBlade(false);
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
						backspaceRemovesValue={false}
						instanceId="home-seach-bar"
						placeholder={t('pages/index___zoek')}
						searchValue={query.search ?? ''}
						onClear={onClearSearch}
						onSearch={onSearch}
					/>
				</div>

				{isLoadingReadingRooms && <p>{t('pages/index___laden')}</p>}
				{!isLoadingReadingRooms && readingRoomInfo?.items?.length === 0 && (
					<p>{t('pages/index___geen-resultaten-voor-de-geselecteerde-filters')}</p>
				)}
				{!isLoadingReadingRooms && readingRoomInfo?.items?.length && (
					<ReadingRoomCardList
						className="u-mb-64"
						items={(readingRoomInfo?.items || []).map(
							(room: ReadingRoomInfo): ReadingRoomCardProps => {
								return {
									room: {
										color: room.color || undefined,
										description: room.description || undefined,
										id: room.id,
										image: room.image || undefined,
										name: room.name,
										logo: room.logo,
									},
									type: ReadingRoomCardType.noAccess, // TODO change this based on current logged in user
									onAccessRequest: onRequestAccess,
								};
							}
						)}
						limit={!areAllReadingRoomsVisible}
					/>
				)}

				{!areAllReadingRoomsVisible && (
					<div className="u-text-center">
						<Button
							className="u-font-weight-400"
							onClick={handleLoadAllReadingRooms}
							variants={['outline']}
						>
							{t('pages/index___toon-alles-amount', {
								amount: readingRoomInfo?.total,
							})}
						</Button>
					</div>
				)}
			</div>

			<AuthModal isOpen={showAuthModal && !user} onClose={onCloseAuthModal} />
			<RequestAccessBlade
				isOpen={isOpenRequestAccessBlade}
				onClose={onCloseRequestBlade}
				onSubmit={onRequestAccessSubmit}
			/>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default Home;
