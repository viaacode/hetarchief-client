import { TabProps, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useQueryParams } from 'use-query-params';

import { FilterMenu } from '@reading-room/components';
import { filterOptionsMock } from '@reading-room/components/FilterMenu/__mocks__/filter-menu';
import { READING_ROOM_QUERY_PARAM_CONFIG, READING_ROOM_TABS } from '@reading-room/const';
import {
	Icon,
	IconProps,
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
	const windowSize = useWindowSize();
	const isMobile = windowSize.width ? windowSize.width < Breakpoints.md : false;

	const [query, setQuery] = useQueryParams(READING_ROOM_QUERY_PARAM_CONFIG);
	const [hasInitialSearch, setHasInitialSearch] = useState<boolean>(false);
	const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(isMobile ? false : true);
	const [media, setMedia] = useState<MediaCardProps[]>([]);
	const [mode] = useState<MediaCardViewMode>('grid');

	const tabs: TabProps[] = useMemo(
		() =>
			READING_ROOM_TABS.map((tab) => ({
				...tab,
				icon: <Icon name={tab.icon as IconProps['name']} />,
				// TODO: remove any once Tab type supports ReactNode
				label: (<TabLabel label={tab.label} count={0} />) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
				active: tab.id === query.mediaType,
			})),
		[query.mediaType]
	);

	useEffect(() => {
		// TODO: replace this with actual results
		async function fetchMedia() {
			const data = (await mock({ view: 'grid' })).items;
			data && setMedia(data);
		}

		fetchMedia();
	}, [setMedia]);

	/**
	 * Methods
	 */

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSearch = (value: string[]) => {
		if (!hasInitialSearch) {
			setHasInitialSearch(true);
		}
	};

	const onSearchKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onSearch([e.currentTarget.value]);
		}
	};

	const onTabClick = (tabId: string | number) => {
		setQuery({ mediaType: String(tabId) });
	};

	const onFilterMenuToggle = () => setFilterMenuOpen((prevOpen) => !prevOpen);

	const showInitialView = !hasInitialSearch && (!media || media.length === 0);

	/**
	 * Render
	 */

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
					{/* TODO: Replace with Search component */}
					<TextInput
						className="u-mb-24"
						iconEnd={<Icon name="search" />}
						placeholder="Zoek op trefwoord, jaartal, aanbieder..."
						variants={['lg', 'rounded']}
						onKeyUp={onSearchKeyUp}
					/>
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
							<WindowSizeContext.Provider value={windowSize}>
								<FilterMenu
									className="p-reading-room__filter-menu"
									filters={filterOptionsMock}
									isOpen={filterMenuOpen}
									onMenuToggle={onFilterMenuToggle}
								/>
							</WindowSizeContext.Provider>
							<Placeholder
								className="p-reading-room__placeholder"
								img="/images/lightbulb.svg"
								title="Start je zoektocht!"
								description="Zoek op trefwoorden, jaartallen, aanbieders… en start je research."
							/>
						</>
					)}
					{media.length > 0 && <MediaCardList items={media} view={mode} />}
				</div>
			</section>
		</div>
	);
};

export default ReadingRoomPage;
