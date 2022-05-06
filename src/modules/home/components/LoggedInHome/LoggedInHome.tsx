import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import { RequestAccessBlade, RequestAccessFormState } from '@home/components';
import ReadingRoomCardsWithSearch from '@home/components/ReadingRoomCardsWithSearch/ReadingRoomCardsWithSearch';
import { VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { useGetVisitorSpace } from '@reading-room/hooks/get-reading-room';
import { ReadingRoomCard, ReadingRoomCardType, VisitorSpaceCardProps } from '@shared/components';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { toastService } from '@shared/services/toast-service';
import { Visit, VisitStatus } from '@shared/types';
import { asDate, createPageTitle } from '@shared/utils';
import { scrollTo } from '@shared/utils/scroll-to-top';
import { useGetVisits } from '@visits/hooks/get-visits';
import { VisitTimeframe } from '@visits/types';

import { ProcessVisitBlade, ProcessVisitBladeProps } from '../ProcessVisitBlade';

import styles from './LoggedInHome.module.scss';

type SelectedVisit = ProcessVisitBladeProps['selected'];

const LoggedInHome: FC = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const searchRef = useRef<HTMLDivElement>(null);

	const [query, setQuery] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
		[SEARCH_QUERY_KEY]: StringParam,
	});

	/**
	 * State
	 */

	const user = useSelector(selectUser);

	const [selected, setSelected] = useState<SelectedVisit | undefined>();

	const [isRequestAccessBladeOpen, setIsRequestAccessBladeOpen] = useState(false);
	const [isProcessVisitBladeOpen, setIsProcessVisitBladeOpen] = useState(false);
	const [hasScrolledToSearch, setHasScrolledToSearch] = useState(false);

	/**
	 * Data
	 */

	const defaultGetVisitsParams = {
		searchInput: '%',
		personal: true,
		page: 0,
		size: 1000,
	};

	const {
		data: active,
		refetch: refetchActive,
		isLoading: isLoadingActive,
	} = useGetVisits({
		...defaultGetVisitsParams,
		status: VisitStatus.APPROVED,
		timeframe: VisitTimeframe.ACTIVE,
	});

	const {
		data: future,
		refetch: refetchFuture,
		isLoading: isLoadingFuture,
	} = useGetVisits({
		...defaultGetVisitsParams,
		status: VisitStatus.APPROVED,
		timeframe: VisitTimeframe.FUTURE,
	});

	const {
		data: pending,
		refetch: refetchPending,
		isLoading: isLoadingPending,
	} = useGetVisits({
		...defaultGetVisitsParams,
		status: VisitStatus.PENDING,
	});

	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	const { data: visitorSpaceInfo, isError: isErrorGetVisitorSpace } = useGetVisitorSpace(
		query[VISITOR_SPACE_SLUG_QUERY_KEY] as string,
		{ enabled: !!query[VISITOR_SPACE_SLUG_QUERY_KEY], retry: false }
	);

	/**
	 * Effects
	 */

	// Scroll to ReadingRoomCardsWithSearch when search is present in query
	useEffect(() => {
		if (
			!hasScrolledToSearch &&
			query[SEARCH_QUERY_KEY] &&
			!isLoadingActive &&
			!isLoadingFuture &&
			!isLoadingPending &&
			!query[VISITOR_SPACE_SLUG_QUERY_KEY]
		) {
			const offset = searchRef.current?.offsetTop;
			offset &&
				// Small timeout so page is rendered before scrolling to search
				setTimeout(() => {
					scrollTo(offset);
					setHasScrolledToSearch(true); // Only allow scrollTo once
				}, 300);
		}
	}, [hasScrolledToSearch, isLoadingActive, isLoadingFuture, isLoadingPending, query]);

	// Open request blade after user requested access and wasn't logged in
	useEffect(() => {
		if (query[VISITOR_SPACE_SLUG_QUERY_KEY] && visitorSpaceInfo) {
			setIsRequestAccessBladeOpen(true);
		}
	}, [query, visitorSpaceInfo]);

	useEffect(() => {
		if (isErrorGetVisitorSpace) {
			toastService.notify({
				title: t('modules/home/components/logged-in-home/logged-in-home___error'),
				description: t(
					'modules/home/components/logged-in-home/logged-in-home___deze-bezoekersruimte-bestaat-niet'
				),
			});
		}
	}, [isErrorGetVisitorSpace, t]);

	/**
	 * Methods
	 */

	const onCloseRequestBlade = () => {
		if (query[VISITOR_SPACE_SLUG_QUERY_KEY]) {
			setQuery({ [VISITOR_SPACE_SLUG_QUERY_KEY]: undefined });
		}

		setIsRequestAccessBladeOpen(false);
	};

	const onCloseProcessVisitBlade = () => {
		setIsProcessVisitBladeOpen(false);
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

			if (!query[VISITOR_SPACE_SLUG_QUERY_KEY]) {
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
				visitorSpaceSlug: query[VISITOR_SPACE_SLUG_QUERY_KEY] as string,
				timeframe: values.visitTime,
			}).then((createdVisitRequest) => {
				setQuery({ [VISITOR_SPACE_SLUG_QUERY_KEY]: undefined });
				setIsRequestAccessBladeOpen(false);

				router.push(ROUTES.visitRequested.replace(':slug', createdVisitRequest.spaceSlug));
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

	const onRequestAccess = (visitorSpaceSlug: string) => {
		setQuery({ [VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug });
		setIsRequestAccessBladeOpen(true);
	};

	const onProcessVisit = (visit: SelectedVisit) => {
		setSelected(visit);
		setIsProcessVisitBladeOpen(true);
	};

	const mapVisitToRoom = (visit: Visit): VisitorSpaceCardProps['room'] => ({
		image: visit.spaceImage || null,
		logo: visit.spaceLogo || '',
		color: visit.spaceColor || null,
		name: visit.spaceName || '',
		info: visit.spaceInfo || '',
		slug: visit.spaceSlug,
		id: visit.spaceId,
	});

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
										room={mapVisitToRoom(visit)}
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
										onClick={() => onProcessVisit(visit)}
										key={`hero-planned-${i}`}
										access={{
											granted: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={mapVisitToRoom(visit)}
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
										onClick={() => onProcessVisit(visit)}
										key={`hero-requested-${i}`}
										access={{
											granted: false,
											pending: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={mapVisitToRoom(visit)}
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
		<>
			<div className="p-home u-page-bottom-padding">
				<Head>
					<title>{createPageTitle('Home')}</title>
					<meta name="description" content="TODO: Home meta description" />
				</Head>

				{renderHero()}
				<div ref={searchRef}>
					<ReadingRoomCardsWithSearch
						onRequestAccess={onRequestAccess}
						onSearch={() => setHasScrolledToSearch(true)}
					/>
				</div>
			</div>

			<RequestAccessBlade
				isOpen={isRequestAccessBladeOpen}
				onClose={onCloseRequestBlade}
				onSubmit={onRequestAccessSubmit}
			/>

			<ProcessVisitBlade
				selected={selected}
				isOpen={!!selected && isProcessVisitBladeOpen}
				onClose={onCloseProcessVisitBlade}
				onFinish={() => {
					refetchActive();
					refetchFuture();
					refetchPending();
				}}
			/>
		</>
	);
};

export default withAuth(LoggedInHome);
