import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestAccessBlade } from '@home/components';
import ReadingRoomCardsWithSearch from '@home/components/ReadingRoomCardsWithSearch/ReadingRoomCardsWithSearch';
import { ReadingRoomCard, ReadingRoomCardType } from '@shared/components';
import { AccessGranted } from '@shared/components/ReadingRoomCard/__mocks__/reading-room-card';
import { createPageTitle } from '@shared/utils';

import styles from './LoggedInHome.module.scss';
import { homeHeroRequests } from './__mocks__/HomeHeroRequests.mock';

const LoggedInHome: FC = () => {
	const { t } = useTranslation();
	const [query, setQuery] = useQueryParams({
		returnToRequestAccess: StringParam,
	});

	const [isOpenRequestAccessBlade, setIsOpenRequestAccessBlade] = useState(false);

	const user = useSelector(selectUser);

	// Open request blade after user requested access and wasn't logged in
	useEffect(() => {
		if (query.returnToRequestAccess) {
			setIsOpenRequestAccessBlade(true);
		}
	}, [query.returnToRequestAccess]);

	/**
	 * Methods
	 */

	const onCloseRequestBlade = () => {
		if (query.returnToRequestAccess) {
			setQuery({ returnToRequestAccess: undefined });
		}
		setIsOpenRequestAccessBlade(false);
	};

	const onRequestAccessSubmit = () => {
		// TODO: add create request call here
		setIsOpenRequestAccessBlade(false);
	};

	const onRequestAccess = () => {
		setIsOpenRequestAccessBlade(true);
	};

	/**
	 * Render
	 */

	const renderHero = () => {
		const accessGranted = homeHeroRequests.filter((request) => request.status === 'access');
		const planned = homeHeroRequests.filter((request) => request.status === 'planned');
		const requested = homeHeroRequests.filter((request) => request.status === 'requested');

		return (
			<header className={clsx(styles['c-hero'], styles['c-hero--logged-in'])}>
				<div className="l-container">
					<section className={clsx(styles['c-hero__header'], 'u-mb-48 u-mb-64:md')}>
						<h1 className={styles['c-hero__title']}>
							{t('modules/shared/components/hero/hero___dag-user', {
								user: user?.firstName,
							})}
						</h1>
						<p className={styles['c-hero__description']}>
							{t(
								'modules/shared/components/hero/hero___plan-een-nieuw-bezoek-stap-fysiek-binnen-en-krijg-meteen-toegang-tot-het-digitale-archief-van-de-leeszaal'
							)}
						</p>
					</section>
					{accessGranted.length > 0 && (
						<section
							className={clsx(
								styles['c-hero__section'],
								styles['c-hero__section--access']
							)}
						>
							<div className={styles['c-hero__access-cards']}>
								{accessGranted.map((room, i) => (
									<ReadingRoomCard
										key={`hero-access-${i}`}
										access={AccessGranted}
										room={room}
										type={ReadingRoomCardType.access}
									/>
								))}
							</div>
						</section>
					)}
					{planned.length > 0 && (
						<section className={clsx(styles['c-hero__section'])}>
							<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')}>
								{t('modules/shared/components/hero/hero___geplande-bezoeken')}
							</h5>
							<div className={styles['c-hero__requests']}>
								{planned.map((room, i) => (
									<ReadingRoomCard
										key={`hero-planned-${i}`}
										access={AccessGranted}
										room={room}
										type={ReadingRoomCardType.futureApproved}
									/>
								))}
							</div>
						</section>
					)}
					{requested.length > 0 && (
						<section className={clsx(styles['c-hero__section'])}>
							<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')}>
								{t('modules/shared/components/hero/hero___aanvragen')}
							</h5>
							<div className={styles['c-hero__requests']}>
								{requested.map((room, i) => (
									<ReadingRoomCard
										key={`hero-requested-${i}`}
										access={AccessGranted}
										room={room}
										type={ReadingRoomCardType.futureRequested}
									/>
								))}
							</div>
						</section>
					)}
				</div>
			</header>
		);
	};

	return (
		<div className="p-home">
			<Head>
				<title>{createPageTitle('Home')}</title>
				<meta name="description" content="TODO: Home meta description" />
			</Head>

			{renderHero()}

			<ReadingRoomCardsWithSearch onRequestAccess={onRequestAccess} />

			<RequestAccessBlade
				isOpen={isOpenRequestAccessBlade}
				onClose={onCloseRequestBlade}
				onSubmit={onRequestAccessSubmit}
			/>
		</div>
	);
};

export default withAuth(LoggedInHome, false);
