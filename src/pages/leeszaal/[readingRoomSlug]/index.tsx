import { TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { withAuth } from '@auth/wrappers/with-auth';
import { withI18n } from '@i18n/wrappers';
import { useGetMediaObjects } from '@media/hooks/get-media-objects';
import { FilterMenu, ReadingRoomNavigation } from '@reading-room/components';
import {
	READING_ROOM_FILTERS,
	READING_ROOM_ITEM_COUNT,
	READING_ROOM_QUERY_PARAM_CONFIG,
	READING_ROOM_QUERY_PARAM_INIT,
	READING_ROOM_SORT_OPTIONS,
	READING_ROOM_TABS,
	READING_ROOM_VIEW_TOGGLE_OPTIONS,
} from '@reading-room/const';
import { ReadingRoomFilterId, ReadingRoomMediaType } from '@reading-room/types';
import { mapFiltersToQuery, mapFiltersToTags } from '@reading-room/utils';
import {
	MediaCardList,
	MediaCardProps,
	MediaCardViewMode,
	PaginationBar,
	Placeholder,
	ScrollableTabs,
	SearchBar,
	SearchBarValue,
	TabLabel,
	ToggleOption,
} from '@shared/components';
import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { useWindowSize } from '@shared/hooks';
import { OrderDirection, SortObject } from '@shared/types';
import { createPageTitle } from '@shared/utils';

const ReadingRoomPage: NextPage = () => {
	// State
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	// We need 2 different states for the filter menu for different viewport sizes
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const { t } = useTranslation();

	const [query, setQuery] = useQueryParams(READING_ROOM_QUERY_PARAM_CONFIG);
	const windowSize = useWindowSize();

	const hasSearched = !!query?.search?.length || query?.mediaType !== ReadingRoomMediaType.All; // TODO add other filters once available

	// Data
	const { data: mediaResultInfo } = useGetMediaObjects(
		{
			query: (query.search || []).join(' '),
		},
		query.start || 0,
		20
	);
	const [mediaCount] = useState({
		[ReadingRoomMediaType.All]: 1245,
		[ReadingRoomMediaType.Audio]: 456,
		[ReadingRoomMediaType.Video]: 789,
	});

	// Display
	const [viewMode, setViewMode] = useState<MediaCardViewMode>('grid');

	const activeFilters = useMemo(() => mapFiltersToTags(query), [query]);

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
				active: tab.id === query.mediaType,
			})),
		[query.mediaType, mediaCount]
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
			setQuery({ search: (query.search ?? []).concat(newValue) });
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
			...READING_ROOM_QUERY_PARAM_INIT,
			search: undefined,
			orderDirection: undefined,
		});
	};

	const onResetFilter = (id: string) => {
		setQuery({ [id]: undefined });
	};

	const onSubmitFilter = (id: string, values: unknown) => {
		const parsedQueryValue = mapFiltersToQuery(id as ReadingRoomFilterId, values);

		if (parsedQueryValue) {
			setQuery({ [id]: parsedQueryValue });
		}
	};

	const onRemoveKeyword = (newValue: SearchBarValue<true>) =>
		setQuery({ search: newValue?.map((tag) => tag.value as string) });

	const onSortClick = (orderProp: string, orderDirection?: OrderDirection) =>
		setQuery({ orderProp, orderDirection });

	const onTabClick = (tabId: string | number) => setQuery({ mediaType: String(tabId) });

	const onViewToggle = (nextMode: string) => setViewMode(nextMode as MediaCardViewMode);

	/**
	 * Computed
	 */

	const activeSort: SortObject = {
		orderProp: query.orderProp,
		orderDirection: (query.orderDirection as OrderDirection) ?? undefined,
	};
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
				<WindowSizeContext.Provider value={windowSize}>
					<FilterMenu
						activeSort={activeSort}
						filters={READING_ROOM_FILTERS()}
						label={t('pages/leeszaal/reading-room-slug/index___filters')}
						isOpen={filterMenuOpen}
						isMobileOpen={mobileMenuOpen}
						sortOptions={READING_ROOM_SORT_OPTIONS()}
						toggleOptions={toggleOptions}
						onSortClick={onSortClick}
						onMenuToggle={onFilterMenuToggle}
						onViewToggle={onViewToggle}
						onFilterReset={onResetFilter}
						onFilterSubmit={onSubmitFilter}
					/>
				</WindowSizeContext.Provider>
			</div>
		);
	};

	return (
		<div className="p-reading-room">
			<Head>
				<title>{createPageTitle('Leeszaal')}</title>
				<meta name="description" content="Leeszaal omschrijving" />
			</Head>

			{/* TODO: bind title to state */}
			<ReadingRoomNavigation title={'Leeszaal'} />

			<section className="u-bg-black u-pt-8">
				<div className="l-container">
					<SearchBar
						allowCreate
						className="u-mb-24"
						clearLabel={t('pages/leeszaal/slug___wis-volledige-zoekopdracht')}
						instanceId="reading-room-search-bar"
						isMulti
						size="lg"
						placeholder={t('pages/leeszaal/slug___zoek-op-trefwoord-jaartal-aanbieder')}
						syncSearchValue={false}
						valuePlaceholder={t('pages/leeszaal/slug___zoek-naar')}
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
					{showResults && (
						<>
							<MediaCardList
								items={mediaResultInfo?.items
									// TODO: check why these 'empty' results are there
									?.filter((mediaObject) => mediaObject.type !== 'SOLR')
									.map(
										(mediaObject): MediaCardProps => ({
											description: mediaObject.schema_description,
											title: mediaObject.schema_name,
											published_at: mediaObject.schema_date_published
												? new Date(mediaObject.schema_date_published)
												: undefined,
											published_by:
												mediaObject.schema_creator?.Maker?.join(', '),
											type: mediaObject.dcterms_format || undefined,
										})
									)}
								keywords={keywords}
								sidebar={renderFilterMenu()}
								view={viewMode}
							/>
							<PaginationBar
								className="u-mb-48"
								start={query.start}
								count={READING_ROOM_ITEM_COUNT}
								showBackToTop
								total={mediaCount[query.mediaType as ReadingRoomMediaType]}
								onPageChange={(page) =>
									setQuery({
										...query,
										start: page * READING_ROOM_ITEM_COUNT,
									})
								}
							/>
						</>
					)}
				</div>
			</section>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = withI18n();

// export default withAuth(ReadingRoomPage);
export default ReadingRoomPage;
