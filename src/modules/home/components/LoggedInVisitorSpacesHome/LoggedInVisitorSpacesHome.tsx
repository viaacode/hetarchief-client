import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import React, { type ComponentType, type FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { selectUser } from '@auth/store/user';
import { withAuth } from '@auth/wrappers/with-auth';
import {
	RequestAccessBlade,
	type RequestAccessFormState,
} from '@home/components/RequestAccessBlade';
import VisitorSpaceCardsWithSearch from '@home/components/VisitorSpaceCardsWithSearch/VisitorSpaceCardsWithSearch';
import { useCreateVisitRequest } from '@home/hooks/create-visit-request';
import { Blade } from '@shared/components/Blade/Blade';
import { Loading } from '@shared/components/Loading';
import { SpacePreview } from '@shared/components/SpacePreview';
import type { VisitSummaryType } from '@shared/components/VisitSummary';
import {
	VisitorSpaceCard,
	type VisitorSpaceCardProps,
	VisitorSpaceCardType,
} from '@shared/components/VisitorSpaceCard';
import { ROUTES_BY_LOCALE } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml } from '@shared/helpers/translate';
import { useScrollToId } from '@shared/hooks/scroll-to-id';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { toastService } from '@shared/services/toast-service';
import { type VisitRequest, VisitStatus } from '@shared/types/visit-request';
import { asDate } from '@shared/utils/dates';
import { scrollTo } from '@shared/utils/scroll-to-top';
import { useGetVisitRequests } from '@visit-requests/hooks/get-visit-requests';
import { VisitTimeframe } from '@visit-requests/types';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { VisitorSpaceStatus } from '@visitor-space/types';

import { ProcessVisitBlade } from '../ProcessVisitBlade';

import styles from './LoggedInVisitiorSpacesHome.module.scss';

const LoggedInVisitorSpacesHome: FC = () => {
	const router = useRouter();
	const locale = useLocale();
	const searchRef = useRef<HTMLDivElement>(null);

	const [query, setQuery] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
		[QUERY_PARAM_KEY.SEARCH_QUERY_KEY]: StringParam,
	});

	/**
	 * State
	 */

	const user = useSelector(selectUser);

	const [selected, setSelected] = useState<VisitRequest | undefined>();
	const [isVisitorSpaceNotAvailable, setIsVisitorSpaceNotAvailable] = useState(false);

	const [isRequestAccessBladeOpen, setIsRequestAccessBladeOpen] = useState(false);
	const [isProcessVisitBladeOpen, setIsProcessVisitBladeOpen] = useState(false);
	const [hasScrolledToSearch, setHasScrolledToSearch] = useState(false);

	useScrollToId(router?.asPath?.split('#')?.[1] || null);

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
	} = useGetVisitRequests({
		...defaultGetVisitsParams,
		status: VisitStatus.APPROVED,
		timeframe: VisitTimeframe.ACTIVE,
	});

	const {
		data: future,
		refetch: refetchFuture,
		isLoading: isLoadingFuture,
	} = useGetVisitRequests({
		...defaultGetVisitsParams,
		status: VisitStatus.APPROVED,
		timeframe: VisitTimeframe.FUTURE,
	});

	const {
		data: pending,
		refetch: refetchPending,
		isLoading: isLoadingPending,
	} = useGetVisitRequests({
		...defaultGetVisitsParams,
		status: VisitStatus.PENDING,
	});

	const { mutateAsync: createVisitRequest } = useCreateVisitRequest();

	const { data: visitorSpaceInfo, isError: isErrorGetVisitorSpace } = useGetVisitorSpace(
		query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] as string,
		false,
		{
			enabled: !!query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY],
		}
	);

	// ARC-1650: Do not show all visit accesses for admin users
	const filterOutPermanentIds = (items?: VisitRequest[]): VisitRequest[] => {
		if (items === undefined) {
			return [];
		}
		return items.filter((visit) => !visit.id.includes('permanent-id'));
	};

	const actualActiveVisitRequests = filterOutPermanentIds(active?.items);
	const actualFutureVisitRequests = filterOutPermanentIds(future?.items);
	const actualPendingVisitRequests = filterOutPermanentIds(pending?.items);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (
			!!query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] &&
			(isErrorGetVisitorSpace || visitorSpaceInfo?.status === VisitorSpaceStatus.Inactive)
		) {
			setIsVisitorSpaceNotAvailable(true);
		}
	}, [query, isErrorGetVisitorSpace, visitorSpaceInfo]);

	// Scroll to VisitorSpaceCardsWithSearch when search is present in query
	useEffect(() => {
		if (
			!hasScrolledToSearch &&
			query[QUERY_PARAM_KEY.SEARCH_QUERY_KEY] &&
			!isLoadingActive &&
			!isLoadingFuture &&
			!isLoadingPending &&
			!query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]
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
		if (
			query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] &&
			visitorSpaceInfo &&
			visitorSpaceInfo.status !== VisitorSpaceStatus.Inactive
		) {
			setIsRequestAccessBladeOpen(true);
		}
	}, [query, visitorSpaceInfo]);

	/**
	 * Methods
	 */

	const onCloseRequestBlade = () => {
		if (query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]) {
			setQuery({ [QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: undefined });
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
					title: tHtml(
						'modules/home/components/logged-in-home/logged-in-home___je-bent-niet-ingelogd'
					),
					description: tHtml(
						'modules/home/components/logged-in-home/logged-in-home___je-bent-niet-ingelogd-log-opnieuw-in-en-probeer-opnieuw'
					),
				});
				return;
			}

			if (!query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]) {
				toastService.notify({
					title: tHtml(
						'modules/home/components/logged-in-home/logged-in-home___selecteer-eerst-een-bezoekersruimte'
					),
					description: tHtml(
						'modules/home/components/logged-in-home/logged-in-home___de-bezoekersruimte-waarvoor-je-een-aanvraag-wil-indienen-is-niet-ingesteld'
					),
				});
				return;
			}

			const createdVisitRequest = await createVisitRequest({
				acceptedTos: values.acceptTerms,
				reason: values.requestReason,
				visitorSpaceSlug: query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] as string,
				timeframe: values.visitTime,
			});
			setQuery({ [QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: undefined });
			onCloseRequestBlade();
			await router.push(
				ROUTES_BY_LOCALE[locale].visitRequested.replace(':slug', createdVisitRequest.spaceSlug)
			);
		} catch (err) {
			console.error({
				message: 'Failed to create visit request',
				error: err,
				info: values,
			});
			toastService.notify({
				title: tHtml('modules/home/components/logged-in-home/logged-in-home___error'),
				description: tHtml(
					'modules/home/components/logged-in-home/logged-in-home___er-ging-iets-mis-bij-het-versturen-van-je-aanvraag-probeer-het-later-opnieuw-of-contacteer-de-support'
				),
			});
		}
	};

	const onRequestAccess = (visitorSpaceSlug: string) => {
		setQuery({
			[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: visitorSpaceSlug,
		});
		setIsRequestAccessBladeOpen(true);
	};

	const onProcessVisit = (visit: VisitRequest) => {
		setSelected(visit);
		setIsProcessVisitBladeOpen(true);
	};

	const mapVisitToRoom = (visit: VisitRequest): VisitorSpaceCardProps['room'] => ({
		image: visit.spaceImage || null,
		logo: visit.spaceLogo || '',
		color: visit.spaceColor || null,
		name: visit.spaceName || '',
		info: visit.spaceInfo || '',
		slug: visit.spaceSlug,
		id: visit.spaceId,
		contactInfo: {
			email: visit.spaceMail || null,
			telephone: visit.spaceTelephone || null,
		},
	});

	/**
	 * Render
	 */

	const renderHero = () => {
		return (
			<header className={clsx(styles['c-hero'], styles['c-hero--logged-in'])}>
				<div className="l-container">
					<section className={clsx(styles['c-hero__header'], 'u-mb-48 u-mb-64-md')}>
						<h1 className={styles['c-hero__title']}>
							{tHtml('modules/shared/components/hero/hero___dag-user', {
								user: user?.firstName,
							})}
						</h1>

						<p className={styles['c-hero__description']}>
							{tHtml(
								'modules/shared/components/hero/hero___plan-een-nieuw-bezoek-stap-fysiek-binnen-en-krijg-meteen-toegang-tot-het-digitale-archief-van-de-bezoekersruimte'
							)}
						</p>
					</section>

					{actualActiveVisitRequests.length > 0 && (
						<section className={clsx(styles['c-hero__section'], styles['c-hero__section--access'])}>
							<div className={styles['c-hero__access-cards']}>
								{actualActiveVisitRequests.map((visit, i) => (
									<VisitorSpaceCard
										key={`hero-access-${visit.id}`}
										access={{
											granted: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={mapVisitToRoom(visit)}
										type={VisitorSpaceCardType.access}
									/>
								))}
							</div>
						</section>
					)}

					{actualFutureVisitRequests.length > 0 && (
						<section className={clsx(styles['c-hero__section'])} id="toekomstige-bezoeken">
							<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')} id="planned-visits">
								{tHtml('modules/shared/components/hero/hero___geplande-bezoeken')}
							</h5>
							<div className={styles['c-hero__requests']}>
								{actualFutureVisitRequests.map((visit, i) => (
									<VisitorSpaceCard
										onClick={() => onProcessVisit(visit)}
										key={`hero-planned-${visit.id}`}
										access={{
											granted: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={mapVisitToRoom(visit)}
										type={VisitorSpaceCardType.futureApproved}
									/>
								))}
							</div>
						</section>
					)}

					{actualPendingVisitRequests.length > 0 && (
						<section className={clsx(styles['c-hero__section'])} id="aangevraagde-bezoeken">
							<h5 className={clsx(styles['c-hero__section-title'], 'u-mb-16')}>
								{tHtml('modules/shared/components/hero/hero___aanvragen')}
							</h5>
							<div className={styles['c-hero__requests']}>
								{actualPendingVisitRequests.map((visit, i) => (
									<VisitorSpaceCard
										onClick={() => onProcessVisit(visit)}
										key={`hero-requested-${visit.id}`}
										access={{
											granted: false,
											pending: true,
											until: asDate(visit.endAt),
											from: asDate(visit.startAt),
										}}
										room={mapVisitToRoom(visit)}
										type={VisitorSpaceCardType.futureRequested}
									/>
								))}
							</div>
						</section>
					)}
				</div>
			</header>
		);
	};

	const renderVisitorSpaceNotAvailableBlade = () => {
		return (
			<Blade
				className={styles['c-visitor-space-not-available-blade']}
				isOpen={isVisitorSpaceNotAvailable}
				renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
					<h2
						{...props}
						className={clsx(props.className, styles['c-visitor-space-not-available-blade__title'])}
					>
						{tHtml(
							'modules/home/components/request-access-blade/request-access-blade___vraag-toegang-aan'
						)}
					</h2>
				)}
				id="logged-in-home__visitor-space-not-available-blade"
			>
				<div className="u-px-32 u-px-16-md">
					{visitorSpaceInfo && <SpacePreview visitorSpace={visitorSpaceInfo} />}
					<p>
						{tHtml(
							'modules/home/components/logged-in-home/logged-in-home___het-is-niet-mogelijk-om-toegang-tot-deze-bezoekersruimte-aan-te-vragen-op-dit-moment'
						)}
					</p>
					<Button
						label={tHtml(
							'modules/home/components/logged-in-home/logged-in-home___ga-naar-de-homepage'
						)}
						variants="black"
						onClick={() => {
							setIsVisitorSpaceNotAvailable(false);
							setQuery({
								[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: undefined,
							});
						}}
					/>
				</div>
			</Blade>
		);
	};

	const renderPageContent = () => {
		return (
			<>
				{renderHero()}
				<div ref={searchRef}>
					<VisitorSpaceCardsWithSearch
						onRequestAccess={onRequestAccess}
						onSearch={() => setHasScrolledToSearch(true)}
					/>
				</div>
				<RequestAccessBlade
					isOpen={isRequestAccessBladeOpen}
					onClose={onCloseRequestBlade}
					onSubmit={onRequestAccessSubmit}
					id=""
				/>
				{renderVisitorSpaceNotAvailableBlade()}
				<ProcessVisitBlade
					selected={selected as (VisitSummaryType & Pick<VisitRequest, 'status'>) | undefined}
					isOpen={!!selected && isProcessVisitBladeOpen}
					onClose={onCloseProcessVisitBlade}
					onFinish={() => {
						refetchActive();
						refetchFuture();
						refetchPending();
					}}
					id=""
				/>
			</>
		);
	};
	const renderHomePageContent = () => {
		if (isLoadingFuture || isLoadingPending || isLoadingActive) {
			return <Loading fullscreen owner="logged in home" />;
		}
		return <div className="p-home u-page-bottom-padding">{renderPageContent()}</div>;
	};

	return renderHomePageContent();
};

export default withAuth(LoggedInVisitorSpacesHome as ComponentType, true) as FC;
