import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import ReadingRoomCardsWithSearch from '@home/components/ReadingRoomCardsWithSearch/ReadingRoomCardsWithSearch';
import { READING_ROOM_QUERY_KEY } from '@home/const';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { ReadingRoomCard, ReadingRoomCardType } from '@shared/components';
import { ROUTES } from '@shared/const';
import { toastService } from '@shared/services/toast-service';
import { VisitStatus } from '@shared/types';
import { asDate, createPageTitle } from '@shared/utils';
import { useGetVisits } from '@visits/hooks/get-visits';
import { VisitTimeframe } from '@visits/types';

import styles from './LoggedInHome.module.scss';

const LoggedInHome: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();

	const [query, setQuery] = useQueryParams({
		[READING_ROOM_QUERY_KEY]: StringParam,
	});

	/**
	 * State
	 */

	const user = useSelector(selectUser);
	const [isOpenRequestAccessBlade, setIsOpenRequestAccessBlade] = useState(false);

	/**
	 * Data
	 */

	const defaultGetVisitsParams = {
		searchInput: '%',
		personal: true,
		page: 0,
		size: 1000,
	};

	const { data: active } = useGetVisits({
		...defaultGetVisitsParams,
		status: VisitStatus.APPROVED,
		timeframe: VisitTimeframe.ACTIVE,
	});

	const { data: future } = useGetVisits({
		...defaultGetVisitsParams,
		status: VisitStatus.APPROVED,
		timeframe: VisitTimeframe.FUTURE,
	});

	const { data: pending } = useGetVisits({
		...defaultGetVisitsParams,
		status: VisitStatus.PENDING,
	});

	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	/**
	 * Effects
	 */

	// Open request blade after user requested access and wasn't logged in
	useEffect(() => {
		if (query[READING_ROOM_QUERY_KEY]) {
			setIsOpenRequestAccessBlade(true);
		}
	}, [query]);

	/**
	 * Methods
	 */

	const onCloseRequestBlade = () => {
		if (query[READING_ROOM_QUERY_KEY]) {
			setQuery({ [READING_ROOM_QUERY_KEY]: undefined });
		}
		setIsOpenRequestAccessBlade(false);
	};

	const onRequestAccessSubmit = async (values: RequestAccessFormState) => {
		try {
			if (!user) {
				toastService.notify({
					title: t(
						'modules/home/components/logged-in-home/logged-in-home___je-bent-niet-ingelogd'
					),
					description: t(
						'modules/home/components/logged-in-home/logged-in-home___je-bent-niet-ingelogd-log-opnieuw-in-en-probeer-opnieuw'
					),
				});
				return;
			}

			if (!query[READING_ROOM_QUERY_KEY]) {
				toastService.notify({
					title: t(
						'modules/home/components/logged-in-home/logged-in-home___selecteer-eerst-een-leeszaal'
					),
					description: t(
						'modules/home/components/logged-in-home/logged-in-home___de-leeszaal-waarvoor-je-een-aanvraag-wil-indienen-is-niet-ingesteld'
					),
				});
				return;
			}

			createVisitRequest({
				acceptedTos: values.acceptTerms,
				reason: values.requestReason,
				spaceId: query[READING_ROOM_QUERY_KEY] as string,
				timeframe: values.visitTime,
			}).then((res) => {
				setQuery({ [READING_ROOM_QUERY_KEY]: undefined });
				setIsOpenRequestAccessBlade(false);

				router.push(ROUTES.visitRequested.replace(':slug', res.spaceSlug));
			});
		} catch (err) {
			console.error({
				message: 'Failed to create visit request',
				error: err,
				info: values,
			});
			toastService.notify({
				title: t('modules/home/components/logged-in-home/logged-in-home___error'),
				description: t(
					'modules/home/components/logged-in-home/logged-in-home___er-ging-iets-mis-bij-het-versturen-van-je-aanvraag-probeer-het-later-opnieuw-of-contacteer-de-support'
				),
			});
		}
	};

	const onRequestAccess = (id: string) => {
		setQuery({ [READING_ROOM_QUERY_KEY]: id });
		setIsOpenRequestAccessBlade(true);
	};

	/**
	 * Render
	 */

	const renderHero = () => {
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

					{(active?.items || []).length > 0 && (
						<section
							className={clsx(
								styles['c-hero__section'],
								styles['c-hero__section--access']
							)}
						>
							<div className={styles['c-hero__access-cards']}>
								{(active?.items || []).map((visit, i) => (
									<ReadingRoomCard
										key={`hero-access-${i}`}
										access={{
											granted: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={{
											name: visit.spaceName,
											info: 'TODO',
										}}
										type={ReadingRoomCardType.access}
									/>
								))}
							</div>
						</section>
					)}

					{(future?.items || []).length > 0 && (
						<section className={clsx(styles['c-hero__section'])}>
							<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')}>
								{t('modules/shared/components/hero/hero___geplande-bezoeken')}
							</h5>
							<div className={styles['c-hero__requests']}>
								{(future?.items || []).map((visit, i) => (
									<ReadingRoomCard
										key={`hero-planned-${i}`}
										access={{
											granted: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={{
											name: visit.spaceName,
											info: 'TODO',
										}}
										type={ReadingRoomCardType.futureApproved}
									/>
								))}
							</div>
						</section>
					)}

					{(pending?.items || []).length > 0 && (
						<section className={clsx(styles['c-hero__section'])}>
							<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')}>
								{t('modules/shared/components/hero/hero___aanvragen')}
							</h5>
							<div className={styles['c-hero__requests']}>
								{(pending?.items || []).map((visit, i) => (
									<ReadingRoomCard
										key={`hero-requested-${i}`}
										access={{
											granted: false,
											pending: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={{
											name: visit.spaceName,
											info: 'TODO',
										}}
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
		<div className="p-home u-page-bottom-padding">
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
