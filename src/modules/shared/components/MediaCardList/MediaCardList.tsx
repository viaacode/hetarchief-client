import clsx from 'clsx';
import { type FC, memo, type ReactNode } from 'react';
import Masonry from 'react-masonry-css';

import type { MediaCardListProps } from '@shared/components/MediaCardList/MediaCardList.types';
import { tText } from '@shared/helpers/translate';
import { useWindowSizeContext } from '@shared/hooks/use-window-size-context';
import { Breakpoints } from '@shared/types';

import { type IdentifiableMediaCard, MediaCard, type MediaCardProps } from '../MediaCard';

import { MEDIA_CARD_LIST_GRID_BP_COLS } from './MediaCardList.const';
import styles from './MediaCardList.module.scss';

const MediaCardList: FC<MediaCardListProps> = ({
	items,
	keywords,
	view,
	sidebar,
	breakpoints = MEDIA_CARD_LIST_GRID_BP_COLS,
	renderButtons,
	renderActions,
	renderWrapper = (card) => card,
	className,
	showManyResultsTile,
}) => {
	const windowSize = useWindowSizeContext();

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
					thumbnail="/images/more.png"
					title={tText(
						'modules/shared/components/media-card-list/media-card-list___teveel-resultaten'
					)}
					view={view}
					link={undefined}
				/>
			);
		}
		return tiles;
	};

	const tiles = items.map((item, i) => {
		return renderWrapper(
			<MediaCard
				key={getKey(item, i)}
				id={getKey(item, i)}
				buttons={renderButtons?.(item)}
				objectId={item.schemaIdentifier}
				actions={renderActions?.(item)}
				{...item}
				keywords={keywords}
				view={view}
				showLocallyAvailable={item.showLocallyAvailable}
				showPlanVisitButtons={item.showPlanVisitButtons}
				link={item.link}
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
				!sidebar && styles["c-media-card-list--no-sidebar"]
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
