import { TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { isEqual } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { MultiValue } from 'react-select';
import { useQueryParams } from 'use-query-params';

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
import { MetadataProp, ReadingRoomFilterId, TagIdentity } from '@reading-room/types';
import { mapFiltersToTags } from '@reading-room/utils';
import { mapFiltersToElastic } from '@reading-room/utils/elastic-filters';
import {
	IdentifiableMediaCard,
	MediaCardList,
	MediaCardViewMode,
	PaginationBar,
	Placeholder,
	ScrollableTabs,
	SearchBar,
	TabLabel,
	ToggleOption,
} from '@shared/components';
import { ROUTES, SEARCH_QUERY_KEY } from '@shared/const';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowNavigationBorder } from '@shared/store/ui';
import { OrderDirection, ReadingRoomMediaType, SortObject } from '@shared/types';
import { asDate, createPageTitle } from '@shared/utils';

import { useGetSpace } from 'modules/spaces/hooks/get-space';
import { VisitorLayout } from 'modules/visitors';

const ReadingRoomPage: NextPage = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { readingRoomSlug } = router.query;

	useNavigationBorder();

	/**
	 * State
	 */

	// We need 2 different states for the filter menu for different viewport sizes
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const showNavigationBorder = useSelector(selectShowNavigationBorder);

	const [viewMode, setViewMode] = useState<MediaCardViewMode>('grid');
	const [mediaCount, setMediaCount] = useState({
		[ReadingRoomMediaType.All]: 0,
		[ReadingRoomMediaType.Audio]: 0,
		[ReadingRoomMediaType.Video]: 0,
	});

	const [selected, setSelected] = useState<IdentifiableMediaCard | null>(null);
	const [isAddToCollectionBladeOpen, setShowAddToCollectionBlade] = useState(false);

	const [query, setQuery] = useQueryParams(READING_ROOM_QUERY_PARAM_CONFIG);

	useNavigationBorder();

	const hasSearched = useMemo(() => !isEqual(READING_ROOM_QUERY_PARAM_INIT, query), [query]);

	const activeSort: SortObject = {
		orderProp: query.orderProp,
		orderDirection: (query.orderDirection as OrderDirection) ?? undefined,
	};

	/**
	 * Data
	 */

	const { data: space } = useGetSpace(
		readingRoomSlug as string,
		typeof readingRoomSlug === 'string'
	);

	const { data: media } = useGetMediaObjects(
		readingRoomSlug as string,
		mapFiltersToElastic(query),
		query.page || 0,
		READING_ROOM_ITEM_COUNT,
		activeSort
	);

	/**
	 * Effects
	 */

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

	const onResetFilter = (id: string) => {
		setQuery({ [id]: undefined });
	};

	const onSubmitFilter = (id: ReadingRoomFilterId, values: unknown) => {
		let data;

		switch (id) {
			case ReadingRoomFilterId.Medium:
				data = (values as MediumFilterFormState).mediums;
				break;

			case ReadingRoomFilterId.Duration:
				data = values as DurationFilterFormState;
				data = [
					{
						prop: MetadataProp.Duration,
						op: data.operator,
						val: data.duration,
					},
				];
				break;

			case ReadingRoomFilterId.Created:
				data = values as CreatedFilterFormState;
				data = [
					{
						prop: MetadataProp.CreatedAt,
						op: data.operator,
						val: data.created,
					},
				];

				break;

			case ReadingRoomFilterId.Published:
				data = values as PublishedFilterFormState;
				data = [
					{
						prop: MetadataProp.PublishedAt,
						op: data.operator,
						val: data.published,
					},
				];

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

		data && setQuery({ [id]: data });
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

	const onMediaBookmark = (item: IdentifiableMediaCard) => {
		setSelected(item);
		setShowAddToCollectionBlade(true);
	};

	/**
	 * Computed
	 */

	const activeFilters = useMemo(() => mapFiltersToTags(query), [query]);
	const keywords = (query.search ?? []).filter((str) => !!str) as string[];
	const showInitialView = !hasSearched;
	const showNoResults = hasSearched && !!media && media?.items?.length === 0;
	const showResults = hasSearched && !!media && media?.items?.length > 0;

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
					onFilterReset={onResetFilter}
					onFilterSubmit={(id, values) =>
						onSubmitFilter(id as ReadingRoomFilterId, values)
					}
				/>
			</div>
		);
	};

	const renderResults = () => (
		<>
			<MediaCardList
				items={media?.items.map(
					(item): IdentifiableMediaCard => ({
						schemaIdentifier: item.schema_identifier,
						description: item.schema_description,
						title: item.schema_name,
						publishedAt: item.schema_date_published
							? asDate(item.schema_date_published)
							: undefined,
						publishedBy: item.schema_creator?.Maker?.join(', '),
						type: item.dcterms_format,
						detailLink: `/${ROUTES.spaces}/${item.schema_maintainer?.[0]?.schema_identifier}/${item.meemoo_fragment_id}`,
					})
				)}
				keywords={keywords}
				sidebar={renderFilterMenu()}
				onItemBookmark={({ item }) => onMediaBookmark(item as IdentifiableMediaCard)}
				view={viewMode}
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
			<div className="p-reading-room">
				<Head>
					<title>{createPageTitle(space?.name)}</title>
					<meta name="description" content={space?.description || 'Een leeszaal'} />
				</Head>

				<ReadingRoomNavigation
					title={space?.name}
					phone={space?.contactInfo.telephone || ''}
					email={space?.contactInfo.email || ''}
					showBorder={showNavigationBorder}
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

				<section
					className={clsx(
						'p-reading-room__results u-page-bottom-margin u-bg-platinum u-py-24 u-py-48:md',
						{
							'p-reading-room__results--placeholder':
								showInitialView || showNoResults,
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
									title="Start je zoektocht!"
									description="Zoek op trefwoorden, jaartallen, aanbieders… en start je research."
								/>
							</>
						)}
						{showNoResults && (
							<>
								{renderFilterMenu()}

								<Placeholder
									className="p-reading-room__placeholder"
									img="/images/looking-glass.svg"
									title="Geen resultaten"
									description="Pas je zoekopdracht aan om minder filter of trefwoorden te omvatten."
								/>
							</>
						)}
						{showResults && renderResults()}
					</div>
				</section>
			</div>

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
		</VisitorLayout>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(ReadingRoomPage);
