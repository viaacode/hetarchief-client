import clsx from 'clsx';
import { stringifyUrl } from 'query-string';
import { FC, memo, ReactNode } from 'react';
import Masonry from 'react-masonry-css';

import { ROUTE_PARTS } from '@shared/const';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';

import { MediaCard } from '../MediaCard';
import { IdentifiableMediaCard, MediaCardProps } from '../MediaCard/MediaCard.types';

import { MEDIA_CARD_LIST_GRID_BP_COLS } from './MediaCardList.const';
import styles from './MediaCardList.module.scss';
import { MediaCardListProps } from './MediaCardList.types';

const MediaCardList: FC<MediaCardListProps> = ({
	items,
	keywords,
	view,
	sidebar,
	breakpoints = MEDIA_CARD_LIST_GRID_BP_COLS,
	buttons,
	actions,
	wrapper = (card) => card,
	className,
	showLocallyAvailable = false,
	showManyResultsTile,
}) => {
	const windowSize = useWindowSizeContext();
	const { tText } = useTranslation();

	if (!items) {
		return null;
	}

	const isMasonryView = view === 'grid';

	const renderSidebar = () =>
		sidebar && (
			<div key={'MediaCardList--sidebar'} className={styles['c-media-card-list__sidebar']}>
				{sidebar}
			</div>
		);

	const getKey = (item: MediaCardProps, i: number) => {
		let key = (item as IdentifiableMediaCard).schemaIdentifier;

		if (key === undefined) {
			if (typeof item.title === 'string') {
				key = `${encodeURIComponent(item.title || 'card')}--${i}`;
			} else {
				key = i.toString();
			}
		}

		return key;
	};

	/**
	 * This function inserts a fake item to avoid the extra item under the sidebar
	 *
	 * This shows the problem:
	 *  ┌───┐ ┌───┐ ┌───┐ ┌───┐
	 *  │   │ │   │ │   │ │   │
	 *  │   │ │   │ │   │ │   │
	 *  │   │ │   │ │   │ │   │
	 *  │   │ └───┘ └───┘ └───┘
	 *  │   │ ┌───┐ ┌───┐ ┌───┐
	 *  │   │ │   │ │   │ │   │
	 *  │   │ │   │ │   │ │   │
	 *  └───┘ │   │ │   │ │   │
	 *  ┌───┐ └───┘ └───┘ └───┘
	 *  │   │ ┌───┐ ┌───┐ ┌───┐
	 *  │   │ │   │ │   │ │   │
	 *  │   │ │   │ │   │ │   │
	 *  └───┘ │   │ │   │ │   │
	 *  ┌───┐ └───┘ └───┘ └───┘
	 *  │   │
	 *  │   │
	 *  │   │
	 *  └───┘
	 *
	 * This show the solution with an inserted fake item with zero height:
	 * ┌───┐ ┌───┐ ┌───┐ ┌───┐
	 * │   │ │   │ │   │ │   │
	 * │   │ │   │ │   │ │   │
	 * │   │ │   │ │   │ │   │
	 * │   │ └───┘ └───┘ └───┘
	 * │   │ ┌───┐ ┌───┐ ┌───┐
	 * │   │ │   │ │   │ │   │
	 * │   │ │   │ │   │ │   │
	 * └───┘ │   │ │   │ │   │
	 *  fake └───┘ └───┘ └───┘
	 *  item ┌───┐ ┌───┐ ┌───┐
	 * ┌───┐ │   │ │   │ │   │
	 * │   │ │   │ │   │ │   │
	 * │   │ │   │ │   │ │   │
	 * │   │ └───┘ └───┘ └───┘
	 * └───┘ ┌───┐
	 *       │   │
	 *       │   │
	 *       │   │
	 *       └───┘
	 * @param tiles
	 */
	const insertFakeHeightItem = (tiles: ReactNode[]): ReactNode => {
		// Figure out how many columns the masonry has, to know where to insert the fake item
		let widthSegment: keyof typeof MEDIA_CARD_LIST_GRID_BP_COLS = 'default';
		if (windowSize.width && windowSize.width < Breakpoints.sm) {
			widthSegment = Breakpoints.sm;
		}
		if (windowSize.width && windowSize.width < Breakpoints.md) {
			widthSegment = Breakpoints.md;
		}
		if (windowSize.width && windowSize.width < Breakpoints.lg) {
			widthSegment = Breakpoints.lg;
		}
		const numberOfColumns = MEDIA_CARD_LIST_GRID_BP_COLS[widthSegment];
		return [
			...tiles.slice(0, numberOfColumns - 1),
			<span
				key="fake-zero-height-card-list-item"
				className={styles['c-media-card-list__fake-height-spacer']}
			/>,
			...tiles.slice(numberOfColumns - 1),
		];
	};

	const insertManyResultsTile = (tiles: ReactNode[]): ReactNode[] => {
		if (showManyResultsTile) {
			tiles.push(
				<MediaCard
					key="manyResultsTile"
					id="manyResultsTileId"
					type={null}
					preview="/images/more.png"
					title={tText(
						'modules/shared/components/media-card-list/media-card-list___teveel-resultaten'
					)}
					view={view}
				/>
			);
		}
		return tiles;
	};

	const tiles = items.map((item, i) => {
		const link = stringifyUrl({
			url: `/${ROUTE_PARTS.search}/${item.maintainerSlug}/${item.schemaIdentifier}`,
			query: {
				[QUERY_PARAM_KEY.HIGHLIGHTED_SEARCH_TERMS]: keywords,
			},
		});
		return wrapper(
			<MediaCard
				key={getKey(item, i)}
				id={getKey(item, i)}
				buttons={buttons?.(item)}
				meemooIdentifier={item.meemooIdentifier}
				actions={actions?.(item)}
				{...item}
				keywords={keywords}
				view={view}
				showLocallyAvailable={showLocallyAvailable}
				link={link}
				maintainerSlug={item.maintainerSlug}
			/>,
			item
		);
	});

	return (
		<div
			className={clsx(
				className,
				styles['c-media-card-list'],
				styles[`c-media-card-list--${isMasonryView ? 'masonry' : 'two-columns'}`],
				!sidebar && styles[`c-media-card-list--no-sidebar`]
			)}
		>
			{!isMasonryView && renderSidebar()}
			<Masonry
				breakpointCols={isMasonryView ? breakpoints : 1}
				className={styles['c-media-card-list__content']}
				columnClassName={styles['c-media-card-list__column']}
			>
				{isMasonryView && renderSidebar()}
				{insertFakeHeightItem(insertManyResultsTile(tiles))}
			</Masonry>
		</div>
	);
};

export default memo(MediaCardList);
