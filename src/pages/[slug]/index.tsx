import { Button, TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { isToday } from 'date-fns';
import { HTTPError } from 'ky';
import { isEqual } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { MultiValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

import { Permission } from '@account/const';
import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { useGetMediaObjects } from '@media/hooks/get-media-objects';
import {
	AddToCollectionBlade,
	AdvancedFilterFormState,
	CreatedFilterFormState,
	DurationFilterFormState,
	FilterMenu,
	GenreFilterFormState,
	KeywordsFilterFormState,
	MediumFilterFormState,
	PublishedFilterFormState,
	ReadingRoomNavigation,
} from '@reading-room/components';
import { CreatorFilterFormState } from '@reading-room/components/CreatorFilterForm';
import { LanguageFilterFormState } from '@reading-room/components/LanguageFilterForm';
import {
	READING_ROOM_FILTERS,
	READING_ROOM_ITEM_COUNT,
	READING_ROOM_QUERY_PARAM_CONFIG,
	READING_ROOM_QUERY_PARAM_INIT,
	READING_ROOM_SORT_OPTIONS,
	READING_ROOM_TABS,
	READING_ROOM_VIEW_TOGGLE_OPTIONS,
} from '@reading-room/const';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { MetadataProp, ReadingRoomFilterId, TagIdentity } from '@reading-room/types';
import { mapFiltersToTags } from '@reading-room/utils';
import { mapFiltersToElastic } from '@reading-room/utils/elastic-filters';
import {
	Icon,
	IdentifiableMediaCard,
	MediaCardList,
	MediaCardProps,
	MediaCardViewMode,
	PaginationBar,
	Placeholder,
	ScrollableTabs,
	SearchBar,
	TabLabel,
	ToggleOption,
} from '@shared/components';
import Callout from '@shared/components/Callout/Callout';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { useHasAllPermission } from '@shared/hooks/has-permission';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { toastService } from '@shared/services/toast-service';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { OrderDirection, ReadingRoomMediaType, SortObject } from '@shared/types';
import {
	asDate,
	createPageTitle,
	formatDate,
	formatMediumDateWithTime,
	formatTime,
} from '@shared/utils';
import { useGetActiveVisitForUserAndSpace } from '@visits/hooks/get-active-visit-for-user-and-space';

import { VisitorLayout } from 'modules/visitors';

const ReadingRoomPage: NextPage = () => {
	useNavigationBorder();

	const { t } = useTranslation();
	const router = useRouter();
	const windowSize = useWindowSizeContext();

	const { slug } = router.query;
	const canManageFolders: boolean | null = useHasAllPermission(Permission.MANAGE_FOLDERS);
	const showResearchWarning = useHasAllPermission(Permission.SHOW_RESEARCH_WARNING);

	/**
	 * State
	 */

	const showNavigationBorder = useSelector(selectShowNavigationBorder);

	// We need 2 different states for the filter menu for different viewport sizes
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const [viewMode, setViewMode] = useState<MediaCardViewMode>('grid');
	const [mediaCount, setMediaCount] = useState({
		[ReadingRoomMediaType.All]: 0,
		[ReadingRoomMediaType.Audio]: 0,
		[ReadingRoomMediaType.Video]: 0,
	});

	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);
	const [isAddToCollectionBladeOpen, setShowAddToCollectionBlade] = useState(false);

	const [query, setQuery] = useQueryParams(READING_ROOM_QUERY_PARAM_CONFIG);

	const hasSearched = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { filter, ...rest } = query; // Don't include UI state
		return !isEqual(READING_ROOM_QUERY_PARAM_INIT, rest);
	}, [query]);

	const activeSort: SortObject = {
		orderProp: query.orderProp,
		orderDirection: (query.orderDirection as OrderDirection) ?? undefined,
	};

	/**
	 * Data
	 */

	const {
		error: accessError,
		isError: hasAccessError,
		data: access,
	} = useGetActiveVisitForUserAndSpace(slug as string, typeof slug === 'string');

	const { data: space } = useGetReadingRoom(slug as string, { enabled: access !== undefined });

	const { data: media } = useGetMediaObjects(
		space?.maintainerId?.toLocaleLowerCase() as string,
		mapFiltersToElastic(query),
		query.page || 0,
		READING_ROOM_ITEM_COUNT,
		activeSort,
		space?.maintainerId !== undefined
	);

	// visit info
	const { data: visitStatus } = useGetActiveVisitForUserAndSpace(router.query.slug as string);

	/**
	 * Effects
	 */

	useEffect(() => {
		if (!hasAccessError) {
			return;
		}

		onError(accessError, 404, () => {
			router.push(ROUTES.home).finally(() => {
				toastService.notify({
					title: t('pages/slug/index___geen-toegang'),
					description: t('pages/slug/index___je-hebt-geen-toegang-tot-deze-ruimte'),
				});
			});
		});
	}, [hasAccessError, accessError, router, t]);

	useEffect(() => {
		let buckets = media?.aggregations.dcterms_format.buckets;

		if (!buckets || buckets.length === 0) {
			buckets = [
				{ key: 'video', doc_count: 0 }, // Provide mock value for reduce
			];
		}

		setMediaCount({
			[ReadingRoomMediaType.All]: buckets
				.map((pair) => pair.doc_count)
				.reduce((p, c) => {
					return p + c;
				}),
			[ReadingRoomMediaType.Audio]:
				buckets.find((bucket) => bucket.key === ReadingRoomMediaType.Audio)?.doc_count || 0,
			[ReadingRoomMediaType.Video]:
				buckets.find((bucket) => bucket.key === ReadingRoomMediaType.Video)?.doc_count || 0,
		});
	}, [media?.aggregations]);

	/**
	 * Display
	 */

	const tabs: TabProps[] = useMemo(
		() =>
			READING_ROOM_TABS().map((tab) => ({
				...tab,
				label: (
					<TabLabel
						label={tab.label}
						count={mediaCount[tab.id as ReadingRoomMediaType]}
					/>
				),
				active: tab.id === query.format,
			})),
		[query.format, mediaCount]
	);

	const toggleOptions: ToggleOption[] = useMemo(
		() =>
			READING_ROOM_VIEW_TOGGLE_OPTIONS.map((option) => ({
				...option,
				active: option.id === viewMode,
			})),
		[viewMode]
	);

	/**
	 * Methods
	 */

	const onError = (e: unknown, code: number, callback?: () => void) => {
		const cast = e as HTTPError;

		if (cast.response && cast.response.status === code) {
			callback?.();
		}
	};

	const onSearch = async (newValue: string) => {
		if (newValue.trim()) {
			if (!query.search?.includes(newValue)) {
				setQuery({ [SEARCH_QUERY_KEY]: (query.search ?? []).concat(newValue) });
			}
		}
	};

	const onFilterMenuToggle = (nextOpen?: boolean, isMobile?: boolean) => {
		const nextOpenState =
			typeof nextOpen !== 'undefined' ? nextOpen : (prevOpen: boolean) => !prevOpen;
		if (isMobile) {
			setMobileMenuOpen(nextOpenState);
		} else {
			setFilterMenuOpen(nextOpenState);
		}
	};

	const onResetFilters = () => {
		setQuery(READING_ROOM_QUERY_PARAM_INIT);
	};

	const onSubmitFilter = (id: ReadingRoomFilterId, values: unknown) => {
		let data;

		switch (id) {
			case ReadingRoomFilterId.Medium:
				data = (values as MediumFilterFormState).mediums;
				break;

			case ReadingRoomFilterId.Duration:
				data = values as DurationFilterFormState;
				data = data.duration
					? [
							{
								prop: MetadataProp.Duration,
								op: data.operator,
								val: data.duration,
							},
					  ]
					: undefined;
				break;

			case ReadingRoomFilterId.Created:
				data = values as CreatedFilterFormState;
				data = data.created
					? [
							{
								prop: MetadataProp.CreatedAt,
								op: data.operator,
								val: data.created,
							},
					  ]
					: undefined;
				break;

			case ReadingRoomFilterId.Published:
				data = values as PublishedFilterFormState;
				data = data.published
					? [
							{
								prop: MetadataProp.PublishedAt,
								op: data.operator,
								val: data.published,
							},
					  ]
					: undefined;
				break;

			case ReadingRoomFilterId.Creator:
				data = (values as CreatorFilterFormState).creators;
				break;

			case ReadingRoomFilterId.Genre:
				data = (values as GenreFilterFormState).genres;
				break;

			case ReadingRoomFilterId.Keywords:
				data = (values as KeywordsFilterFormState).values;
				break;

			case ReadingRoomFilterId.Language:
				data = (values as LanguageFilterFormState).languages;
				break;

			case ReadingRoomFilterId.Advanced:
				data = (values as AdvancedFilterFormState).advanced;
				break;

			default:
				console.warn(`[WARN][ReadingRoomPage] No submit handler for ${id}`);
				break;
		}

		setQuery({ [id]: data, filter: undefined });
	};

	const onRemoveTag = (tags: MultiValue<TagIdentity>) => {
		const query: Record<string, unknown> = {};

		tags.forEach((tag) => {
			switch (tag.key) {
				case ReadingRoomFilterId.Creator:
				case ReadingRoomFilterId.Genre:
				case ReadingRoomFilterId.Keywords:
				case ReadingRoomFilterId.Language:
				case ReadingRoomFilterId.Medium:
				case SEARCH_QUERY_KEY:
					query[tag.key] = [...((query[tag.key] as Array<unknown>) || []), tag.value];
					break;

				case ReadingRoomFilterId.Advanced:
				case ReadingRoomFilterId.Created:
				case ReadingRoomFilterId.Duration:
				case ReadingRoomFilterId.Published:
					query[tag.key] = [...((query[tag.key] as Array<unknown>) || []), tag];
					break;

				default:
					query[tag.key] = tag.value;
					break;
			}
		});

		// Destructure to keyword-able filters
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { format, orderProp, orderDirection, page, ...rest } = {
			...READING_ROOM_QUERY_PARAM_INIT,
		};

		setQuery({ ...rest, ...query });
	};

	const onSortClick = (orderProp: string, orderDirection?: OrderDirection) =>
		setQuery({ orderProp, orderDirection });

	const onTabClick = (tabId: string | number) => setQuery({ format: String(tabId) });

	const onViewToggle = (nextMode: string) => setViewMode(nextMode as MediaCardViewMode);

	/**
	 * Computed
	 */

	const activeFilters = useMemo(() => mapFiltersToTags(query), [query]);
	const keywords = (query.search ?? []).filter((str) => !!str) as string[];
	const showInitialView = !hasSearched;
	const showNoResults = hasSearched && !!media && media?.items?.length === 0;
	const showResults = hasSearched && !!media && media?.items?.length > 0;
	const isMobile = windowSize.width && windowSize.width > 700;
	const accessEndDate =
		visitStatus && visitStatus.endAt ? formatMediumDateWithTime(asDate(visitStatus.endAt)) : '';
	const accessEndDateMobile =
		visitStatus && visitStatus.endAt
			? isToday(asDate(visitStatus.endAt) ?? 0)
				? formatTime(asDate(visitStatus.endAt))
				: formatDate(asDate(visitStatus.endAt))
			: '';

	/**
	 * Render
	 */

	const renderFilterMenu = () => {
		const filterMenuCls = clsx('p-reading-room__filter-menu', {
			'u-mr-32:md': viewMode === 'list' && showResults,
		});

		return (
			<div className={filterMenuCls}>
				<FilterMenu
					activeSort={activeSort}
					filters={READING_ROOM_FILTERS()}
					filterValues={query}
					label={t('pages/leeszaal/reading-room-slug/index___filters')}
					isOpen={filterMenuOpen}
					isMobileOpen={mobileMenuOpen}
					showNavigationBorder={showNavigationBorder}
					sortOptions={READING_ROOM_SORT_OPTIONS()}
					toggleOptions={toggleOptions}
					onSortClick={onSortClick}
					onMenuToggle={onFilterMenuToggle}
					onViewToggle={onViewToggle}
					onFilterSubmit={(id, values) =>
						onSubmitFilter(id as ReadingRoomFilterId, values)
					}
				/>
			</div>
		);
	};

	const getCardButtons = (item: MediaCardProps): ReactNode => {
		if (!canManageFolders) {
			return null;
		}
		return (
			<Button
				onClick={(e) => {
					// Avoid navigating to detail when opening
					e.preventDefault();
					e.stopPropagation();

					setSelected(item as IdentifiableMediaCard);
					setShowAddToCollectionBlade(true);
				}}
				icon={<Icon type="light" name="bookmark" />}
				variants={['text', 'xxs']}
			/>
		);
	};

	const renderResults = () => (
		<>
			<MediaCardList
				items={media?.items
					.filter((mediaObject) => {
						const isSOLR = mediaObject.type === 'SOLR';
						isSOLR && alert('SOLR item detected') && console.error(mediaObject);
						return !isSOLR;
					})
					.map(
						(item): IdentifiableMediaCard => ({
							schemaIdentifier: item.schema_identifier,
							description: item.schema_description,
							title: item.schema_name,
							publishedAt: item.schema_date_published
								? asDate(item.schema_date_published)
								: undefined,
							publishedBy: item.schema_creator?.Maker?.join(', '),
							type: item.dcterms_format,
							preview: item.schema_thumbnail_url || undefined,
						})
					)}
				keywords={keywords}
				sidebar={renderFilterMenu()}
				view={viewMode}
				buttons={getCardButtons}
				wrapper={(card, item) => {
					const cast = item as IdentifiableMediaCard;
					const source = media?.items.find(
						(media) => media.schema_identifier === cast.schemaIdentifier
					);

					const href = `/${slug}/${source?.meemoo_fragment_id}`;

					return (
						<Link href={href.toLowerCase()}>
							<a className="u-text-no-decoration">{card}</a>
						</Link>
					);
				}}
			/>
			<PaginationBar
				className="u-mb-48"
				start={(query.page - 1) * READING_ROOM_ITEM_COUNT}
				count={READING_ROOM_ITEM_COUNT}
				showBackToTop
				total={mediaCount[query.format as ReadingRoomMediaType]}
				onPageChange={(page) =>
					setQuery({
						...query,
						page: page + 1,
					})
				}
			/>
		</>
	);

	return (
		<VisitorLayout>
			<Head>
				<title>{createPageTitle(space?.name)}</title>
				<meta
					name="description"
					content={
						space?.info || t('pages/leeszaal/reading-room-slug/index___een-leeszaal')
					}
				/>
			</Head>

			{space && (
				<div className="p-reading-room">
					<ReadingRoomNavigation
						title={space?.name}
						phone={space?.contactInfo.telephone || ''}
						email={space?.contactInfo.email || ''}
						showBorder={showNavigationBorder}
						showAccessEndDate={
							accessEndDate || accessEndDateMobile
								? isMobile
									? t(
											'pages/leeszaal/reading-room-slug/object-id/index___toegang-tot-access-end-date',
											{ accessEndDate }
									  )
									: t('pages/slug/index___tot-access-end-date-mobile', {
											accessEndDateMobile,
									  })
								: undefined
						}
					/>

					<section className="u-bg-black u-pt-8">
						<div className="l-container">
							<SearchBar
								allowCreate
								className="u-mb-24"
								clearLabel={t('pages/leeszaal/slug___wis-volledige-zoekopdracht')}
								instanceId="reading-room-search-bar"
								isMulti
								size="lg"
								placeholder={t(
									'pages/leeszaal/slug___zoek-op-trefwoord-jaartal-aanbieder'
								)}
								syncSearchValue={false}
								value={activeFilters}
								onClear={onResetFilters}
								onRemoveValue={onRemoveTag}
								onSearch={onSearch}
							/>
							<ScrollableTabs variants={['dark']} tabs={tabs} onClick={onTabClick} />
						</div>
					</section>

					{showResearchWarning && (
						<aside className="u-bg-platinum">
							<div className="l-container u-flex u-justify-center u-py-32">
								<Callout
									icon={<Icon name="info" />}
									text={t(
										'pages/slug/index___door-gebruik-te-maken-van-deze-applicatie-bevestigt-u-dat-u-het-beschikbare-materiaal-enkel-raadpleegt-voor-wetenschappelijk-of-prive-onderzoek'
									)}
									action={
										<Button
											className="u-py-0 u-px-8 u-color-neutral u-font-size-14 u-height-auto"
											label={t('pages/slug/index___meer-info')}
											variants={['text', 'underline']}
											onClick={() => router.push('#')}
										/>
									}
								/>
							</div>
						</aside>
					)}
					<section
						className={clsx(
							'p-reading-room__results u-page-bottom-margin u-bg-platinum u-py-24 u-py-48:md',
							{
								'p-reading-room__results--placeholder':
									showInitialView || showNoResults,
								'u-pt-0': showResearchWarning,
							}
						)}
					>
						<div className="l-container">
							{showInitialView && (
								<>
									{renderFilterMenu()}

									<Placeholder
										className="p-reading-room__placeholder"
										img="/images/lightbulb.svg"
										title={t(
											'pages/leeszaal/reading-room-slug/index___start-je-zoektocht'
										)}
										description={t(
											'pages/leeszaal/reading-room-slug/index___zoek-op-trefwoorden-jaartallen-aanbieders-en-start-je-research'
										)}
									/>
								</>
							)}
							{showNoResults && (
								<>
									{renderFilterMenu()}

									<Placeholder
										className="p-reading-room__placeholder"
										img="/images/looking-glass.svg"
										title={t(
											'pages/leeszaal/reading-room-slug/index___geen-resultaten'
										)}
										description={t(
											'pages/leeszaal/reading-room-slug/index___pas-je-zoekopdracht-aan-om-minder-filter-of-trefwoorden-te-omvatten'
										)}
									/>
								</>
							)}
							{showResults && renderResults()}
						</div>
					</section>
				</div>
			)}

			{space && (
				<AddToCollectionBlade
					isOpen={isAddToCollectionBladeOpen}
					selected={selected || undefined}
					onClose={() => {
						setShowAddToCollectionBlade(false);
						setSelected(null);
					}}
					onSubmit={() => {
						setShowAddToCollectionBlade(false);
						setSelected(null);
					}}
				/>
			)}
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(ReadingRoomPage);
