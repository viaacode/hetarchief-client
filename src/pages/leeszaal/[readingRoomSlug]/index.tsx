import { TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { format } from 'date-fns';
import { isEqual } from 'lodash';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
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
	FilterMenu,
	MediumFilterFormState,
	ReadingRoomNavigation,
} from '@reading-room/components';
import { CreatorFilterFormState } from '@reading-room/components/CreatorFilterForm';
import {
	getMetadataSearchFilters,
	READING_ROOM_FILTERS,
	READING_ROOM_ITEM_COUNT,
	READING_ROOM_QUERY_PARAM_CONFIG,
	READING_ROOM_QUERY_PARAM_INIT,
	READING_ROOM_SORT_OPTIONS,
	READING_ROOM_TABS,
	READING_ROOM_VIEW_TOGGLE_OPTIONS,
} from '@reading-room/const';
import {
	AdvancedFilter,
	MetadataProp,
	ReadingRoomFilterId,
	TagIdentity,
} from '@reading-room/types';
import { mapFiltersToTags } from '@reading-room/utils';
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
import { ROUTES, SEARCH_QUERY_KEY, SEPARATOR } from '@shared/const';
import { useNavigationBorder } from '@shared/hooks/use-navigation-border';
import { selectShowNavigationBorder } from '@shared/store/ui';
import {
	MediaSearchFilterField,
	MediaSearchOperator,
	Operator,
	OrderDirection,
	ReadingRoomMediaType,
	SortObject,
} from '@shared/types';
import { asDate, createPageTitle } from '@shared/utils';

const ReadingRoomPage: NextPage = () => {
	const { t } = useTranslation();

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

	const { data: mediaResultInfo } = useGetMediaObjects(
		[
			// Searchbar
			{
				field: MediaSearchFilterField.QUERY,
				operator: MediaSearchOperator.CONTAINS,
				value: query.search !== null ? query.search?.toString() : '',
			},
			// Tabs
			{
				field: MediaSearchFilterField.FORMAT,
				operator: MediaSearchOperator.IS,
				value: query.format || READING_ROOM_QUERY_PARAM_INIT.format,
			},
			// Creator
			{
				field: MediaSearchFilterField.CREATOR,
				operator: MediaSearchOperator.IS,
				multiValue: (query.creator || []).filter((item) => item !== null) as string[],
			},
			// Advanced
			...(query.advanced || [])
				.map((item) => {
					const values = (item.val || '').split(SEPARATOR);
					const filters =
						item.prop && item.op
							? getMetadataSearchFilters(
									item.prop as MetadataProp,
									item.op as Operator
							  )
							: [];

					// Format data for Elastic
					return filters.map((filter, i) => {
						let parsed;

						switch (item.prop) {
							case MetadataProp.CreatedAt:
							case MetadataProp.PublishedAt:
								parsed = asDate(values[i]);
								values[i] = (parsed && format(parsed, 'uuuu-MM-dd')) || values[i];
								break;

							default:
								break;
						}

						return { ...filter, value: values[i] };
					});
				})
				.reduce((prev, filters) => prev.concat(filters), []),
		],
		query.page || 0,
		READING_ROOM_ITEM_COUNT,
		activeSort
	);

	/**
	 * Effects
	 */

	useEffect(() => {
		let buckets = mediaResultInfo?.aggregations.dcterms_format.buckets;

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
	}, [mediaResultInfo?.aggregations]);

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
		setQuery({
			[SEARCH_QUERY_KEY]: undefined,
			advanced: undefined,
			format: undefined,
			orderDirection: undefined,
			orderProp: undefined,
			page: undefined,
		});
	};

	const onResetFilter = (id: string) => {
		setQuery({ [id]: undefined });
	};

	const onSubmitFilter = (id: ReadingRoomFilterId, values: unknown) => {
		let cast;

		switch (id) {
			case ReadingRoomFilterId.Medium:
				cast = values as MediumFilterFormState;
				setQuery({ [id]: cast.mediums });
				break;

			case ReadingRoomFilterId.Creator:
				cast = values as CreatorFilterFormState;
				setQuery({ [id]: cast.creators });
				break;

			case ReadingRoomFilterId.Advanced:
				cast = values as AdvancedFilterFormState;
				setQuery({ [id]: cast.advanced });
				break;

			default:
				console.warn(`No submit handler for ${id}`);
				break;
		}
	};

	const onRemoveKeyword = (newValue: MultiValue<TagIdentity>) => {
		const search = newValue
			?.filter((val) => val.key === SEARCH_QUERY_KEY)
			.map((tag) => tag.value as string);

		const advanced = newValue
			?.filter((val) => val.key === ReadingRoomFilterId.Advanced)
			.map((tag) => {
				const { prop, op, val } = tag;
				const filter: AdvancedFilter = { prop, op, val };

				return filter;
			});

		setQuery({
			[SEARCH_QUERY_KEY]: (search.length > 0 && search) || undefined,
			[ReadingRoomFilterId.Advanced]: (advanced.length > 0 && advanced) || undefined,
		});
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
	const showNoResults = hasSearched && !!mediaResultInfo && mediaResultInfo?.items?.length === 0;
	const showResults = hasSearched && !!mediaResultInfo && mediaResultInfo?.items?.length > 0;

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
				items={mediaResultInfo?.items
					// TODO: check why these 'empty' results are there
					?.filter((mediaObject) => mediaObject.type !== 'SOLR')
					.map(
						(mediaObject): IdentifiableMediaCard => ({
							id: mediaObject.schema_identifier,
							description: mediaObject.schema_description,
							title: mediaObject.schema_name,
							publishedAt: mediaObject.schema_date_published
								? asDate(mediaObject.schema_date_published)
								: undefined,
							publishedBy: mediaObject.schema_creator?.Maker?.join(', '),
							type: mediaObject.dcterms_format || undefined,
							detailLink: `/${ROUTES.spaces}/${mediaObject.schema_maintainer[0].schema_identifier}/${mediaObject.schema_identifier}`,
						})
					)}
				keywords={keywords}
				sidebar={renderFilterMenu()}
				onItemBookmark={({ item }) => onMediaBookmark(item as IdentifiableMediaCard)}
				view={viewMode}
			/>
			<PaginationBar
				className="u-mb-48"
				start={query.page * READING_ROOM_ITEM_COUNT}
				count={READING_ROOM_ITEM_COUNT}
				showBackToTop
				total={mediaCount[query.format as ReadingRoomMediaType]}
				onPageChange={(page) =>
					setQuery({
						...query,
						page: page,
					})
				}
			/>
		</>
	);

	return (
		<>
			<div className="p-reading-room">
				<Head>
					<title>{createPageTitle('Leeszaal')}</title>
					<meta name="description" content="Leeszaal omschrijving" />
				</Head>

				{/* TODO: bind title to state */}
				<ReadingRoomNavigation title={'Leeszaal'} showBorder={showNavigationBorder} />

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
							onRemoveValue={onRemoveKeyword}
							onSearch={onSearch}
						/>
						<ScrollableTabs variants={['dark']} tabs={tabs} onClick={onTabClick} />
					</div>
				</section>

				<section
					className={clsx('p-reading-room__results u-bg-platinum u-py-24 u-py-48:md', {
						'p-reading-room__results--placeholder': showInitialView || showNoResults,
					})}
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
		</>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

export default withAuth(ReadingRoomPage);
