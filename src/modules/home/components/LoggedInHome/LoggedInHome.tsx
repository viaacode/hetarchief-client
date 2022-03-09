import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import ReadingRoomCardsWithSearch from '@home/components/ReadingRoomCardsWithSearch/ReadingRoomCardsWithSearch';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { ReadingRoomCard, ReadingRoomCardType } from '@shared/components';
import { AccessGranted } from '@shared/components/ReadingRoomCard/__mocks__/reading-room-card';
import { toastService } from '@shared/services';
import { createPageTitle } from '@shared/utils';

import styles from './LoggedInHome.module.scss';
import { homeHeroRequests } from './__mocks__/HomeHeroRequests.mock';

const LoggedInHome: FC = () => {
	const { t } = useTranslation();
	const [query, setQuery] = useQueryParams({
		readingRoomId: StringParam,
	});

	const [isOpenRequestAccessBlade, setIsOpenRequestAccessBlade] = useState(false);

	const user = useSelector(selectUser);

	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	// Open request blade after user requested access and wasn't logged in
	useEffect(() => {
		if (query.readingRoomId) {
			setIsOpenRequestAccessBlade(true);
		}
	}, [query.readingRoomId]);

	/**
	 * Methods
	 */

	const onCloseRequestBlade = () => {
		if (query.readingRoomId) {
			setQuery({ readingRoomId: undefined });
		}
		setIsOpenRequestAccessBlade(false);
	};

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
			if (!user) {
				toastService.notify({
					title: t('Je bent niet ingelogd'),
					description: t('Je bent niet ingelogd, log opnieuw in en probeer opnieuw.'),
				});
				return;
			}
			if (!query.readingRoomId) {
				toastService.notify({
					title: t('Selecteer eerst een leeszaal'),
					description: t(
						'De leeszaal waarvoor je een aanvraag wil indienen is niet ingesteld.'
					),
				});
				return;
			}
			await createVisitRequest({
				acceptedTos: values.acceptTerms,
				reason: values.requestReason,
				spaceId: query.readingRoomId,
				timeframe: values.visitTime,
			});
			toastService.notify({
				title: t('Success'),
				description: t('Je aanvraag is verstuurd'),
			});

			setQuery({ readingRoomId: undefined });
			setIsOpenRequestAccessBlade(false);
		} catch (err) {
			console.error({
				message: 'Failed to create visit request',
				error: err,
				info: values,
			});
			toastService.notify({
				title: t('Error'),
				description: t(
					'Er ging iets mis bij het versturen van je aanvraag, probeer het later opnieuw of contacteer de support.'
				),
			});
		}
	};

	const onRequestAccess = (readingRoomId: string) => {
		setQuery({ readingRoomId });
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
