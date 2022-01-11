import { TabProps } from '@meemoo/react-components';
import clsx from 'clsx';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { KeyboardEvent, useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { FilterMenu, SearchBar } from '@reading-room/components';
import { filterOptionsMock } from '@reading-room/components/FilterMenu/__mocks__/filter-menu';
import { READING_ROOM_QUERY_PARAM_CONFIG, READING_ROOM_TABS } from '@reading-room/const';
import {
	MediaCardProps,
	MediaCardViewMode,
	Navigation,
	Placeholder,
	ScrollableTabs,
	TabLabel,
} from '@shared/components';
import { MediaCardList } from '@shared/components/MediaCardList';
import { mock } from '@shared/components/MediaCardList/__mocks__/media-card-list';
import { WindowSizeContext } from '@shared/context/WindowSizeContext';
import { useWindowSize } from '@shared/hooks';
import { Breakpoints } from '@shared/types';
import { createPageTitle } from '@shared/utils';

const ReadingRoomPage: NextPage = () => {
	const [hasInitialSearch, setHasInitialSearch] = useState<boolean>(false);
	const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(true);
	// We need 2 different states for the filter menu for different viewport sizes
	const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
	const [media, setMedia] = useState<MediaCardProps[]>([]);
	const [mode] = useState<MediaCardViewMode>('grid');

	const [query, setQuery] = useQueryParams(READING_ROOM_QUERY_PARAM_CONFIG);
	const windowSize = useWindowSize();

	const tabs: TabProps[] = useMemo(
		() =>
			READING_ROOM_TABS.map((tab) => ({
				...tab,
				// TODO: remove any once Tab type supports ReactNode
				label: (<TabLabel label={tab.label} count={0} />) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
				active: tab.id === query.mediaType,
			})),
		[query.mediaType]
	);

	/**
	 * Methods
	 */

	const onSearch = (keywords: string[]) => {
		if (!hasInitialSearch) {
			setHasInitialSearch(true);
		}

		setQuery({ search: keywords });

		// TODO: replace this with actual results
		async function fetchMedia() {
			const data = (await mock({ view: 'grid' })).items;
			data && setMedia(data);
		}

		fetchMedia();
	};

	const onSearchKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onSearch([e.currentTarget.value]);
		}
	};

	const onTabClick = (tabId: string | number) => {
		setQuery({ mediaType: String(tabId) });
	};

	const onFilterMenuToggle = (nextOpen?: boolean) => {
		const isMobile = windowSize.width ? windowSize.width < Breakpoints.sm : false;
		const nextOpenState =
			typeof nextOpen !== 'undefined' ? nextOpen : (prevOpen: boolean) => !prevOpen;
		if (isMobile) {
			setMobileMenuOpen(nextOpenState);
		} else {
			setFilterMenuOpen(nextOpenState);
		}
	};

	const showInitialView = !hasInitialSearch && (!media || media.length === 0);
	const showResults = hasInitialSearch && media.length > 0;

	/**
	 * Render
	 */

	const renderFilterMenu = () => {
		return (
			<WindowSizeContext.Provider value={windowSize}>
				<FilterMenu
					className="p-reading-room__filter-menu"
					filters={filterOptionsMock}
					isOpen={filterMenuOpen}
					isMobileOpen={mobileMenuOpen}
					onMenuToggle={onFilterMenuToggle}
				/>
			</WindowSizeContext.Provider>
		);
	};

	return (
		<div className="p-reading-room">
			<Head>
				<title>{createPageTitle('Leeszaal')}</title>
				<meta name="description" content="Leeszaal omschrijving" />
			</Head>

			<Navigation contextual>
				<Navigation.Left>
					<Link href="/">Terug</Link>
				</Navigation.Left>
				<Navigation.Center title="Leeszaal" />
				<Navigation.Right />
			</Navigation>

			<section className="u-bg-black u-pt-8">
				<div className="l-container">
					<SearchBar onKeyUp={onSearchKeyUp} />
					<ScrollableTabs tabs={tabs} onClick={onTabClick} />
				</div>
			</section>

			<section
				className={clsx('p-reading-room__results u-py-24 u-py-48:md', {
					'p-reading-room__results--initial': showInitialView,
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
					{showResults && (
						<MediaCardList items={media} sidebar={renderFilterMenu()} view={mode} />
					)}
				</div>
			</section>
		</div>
	);
};

export default ReadingRoomPage;
