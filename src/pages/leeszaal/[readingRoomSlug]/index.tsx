import { TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { withAuth } from '@auth/wrappers/with-auth';
import { FilterMenu } from '@reading-room/components';
import { filterOptionsMock } from '@reading-room/components/FilterMenu/__mocks__/filter-menu';
import { ReadingRoomNavigation } from '@reading-room/components/ReadingRoomNavigation';
import {
	READING_ROOM_ITEM_COUNT,
	READING_ROOM_QUERY_PARAM_CONFIG,
	READING_ROOM_TABS,
	READING_ROOM_VIEW_TOGGLE_OPTIONS,
} from '@reading-room/const';
import { ReadingRoomMediaType } from '@reading-room/types';
import { mapFilters } from '@reading-room/utils';
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
import { mock } from '@shared/components/MediaCardList/__mocks__/media-card-list';
import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { useWindowSize } from '@shared/hooks';
import { createPageTitle } from '@shared/utils';
import { withI18n } from '@shared/wrappers';

const ReadingRoomPage: NextPage = () => {
	// State
	const [filterMenuOpen, setFilterMenuOpen] = useState(true);
	// We need 2 different states for the filter menu for different viewport sizes
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const { t } = useTranslation();

	const [query, setQuery] = useQueryParams(READING_ROOM_QUERY_PARAM_CONFIG);
	const windowSize = useWindowSize();

	// Data
	const [media, setMedia] = useState<MediaCardProps[]>([]);
	const [mediaCount] = useState({
		[ReadingRoomMediaType.All]: 1245,
		[ReadingRoomMediaType.Audio]: 456,
		[ReadingRoomMediaType.Video]: 789,
	});

	// Display
	const [viewMode, setViewMode] = useState<MediaCardViewMode>('grid');

	const activeFilters = useMemo(() => mapFilters(query), [query]);
	const tabs: TabProps[] = useMemo(
		() =>
			READING_ROOM_TABS.map((tab) => ({
				...tab,
				label: <TabLabel label={tab.label} count={mediaCount[tab.id]} />,
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
	const setMediaKeywords = (data: MediaCardProps[], keywords: string[]): MediaCardProps[] => {
		return data.map((item) => {
			return {
				...item,
				keywords: keywords,
			};
		});
	};

	// TODO: replace this with actual results
	const fetchMedia = async (keywords: string) => {
		const data = (await mock({ view: 'grid' }, query.start, READING_ROOM_ITEM_COUNT)).items;

		// Fill keywords property for keyword highlighting in media card
		const dataWithKeywords = setMediaKeywords(
			data ?? [],
			(query.search ?? []).concat(keywords) as string[]
		);
		dataWithKeywords && setMedia(dataWithKeywords);
	};

	const onSearch = async (values: SearchBarValue<true>) => {
		if (!hasSearched) {
			setHasSearched(true);
		}

		if (!values?.[0]) {
			setMedia([]);
			setQuery({ search: undefined });
		} else {
			await fetchMedia(String(values));
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

	const onNewKeyWord = (newKeyWord: string) => {
		setQuery({ search: (query.search ?? []).concat(newKeyWord) });
	};

	const onResetFilters = () => {
		setQuery({ search: undefined });
	};

	const onRemoveFilter = (newValue: SearchBarValue<true>) => {
		setQuery({ search: newValue.map((tag) => tag.value as string) });
	};

	const onViewToggle = (nextMode: string) => {
		setViewMode(nextMode as MediaCardViewMode);
	};

	const onTabClick = (tabId: string | number) => {
		setQuery({ mediaType: String(tabId) });
	};

	/**
	 * Computed
	 */

	const showInitialView = !hasSearched && (!media || media.length === 0);
	const showNoResults = hasSearched && media.length === 0;
	const showResults = hasSearched && media.length > 0;

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
						filters={filterOptionsMock}
						isOpen={filterMenuOpen}
						isMobileOpen={mobileMenuOpen}
						toggleOptions={toggleOptions}
						onMenuToggle={onFilterMenuToggle}
						onViewToggle={onViewToggle}
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
						isMulti
						large
						placeholder={t('pages/leeszaal/slug___zoek-op-trefwoord-jaartal-aanbieder')}
						syncSearchValue={false}
						valuePlaceholder={t('pages/leeszaal/slug___zoek-naar')}
						value={activeFilters}
						onCreate={onNewKeyWord}
						onSearch={onSearch}
						onRemoveValue={onRemoveFilter}
						onClear={onResetFilters}
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
								items={media}
								sidebar={renderFilterMenu()}
								view={viewMode}
							/>
							<PaginationBar
								className="u-mb-48"
								start={query.start}
								count={READING_ROOM_ITEM_COUNT}
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

export const getServerSideProps: GetServerSideProps = withAuth(withI18n());

export default ReadingRoomPage;
