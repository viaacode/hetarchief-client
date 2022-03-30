import clsx from 'clsx';
import { FC, memo, MouseEvent, useMemo } from 'react';
import Masonry from 'react-masonry-css';

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
}) => {
	if (!items) {
		return null;
	}

	const isMasonryView = view === 'grid';

	const renderSidebar = () =>
		sidebar && <div className={styles['c-media-card-list__sidebar']}>{sidebar}</div>;

	return (
		<div
			className={clsx(
				styles['c-media-card-list'],
				styles[`c-media-card-list--${isMasonryView ? 'masonry' : 'sidebar'}`]
			)}
		>
			{!isMasonryView && renderSidebar()}
			<Masonry
				breakpointCols={isMasonryView ? breakpoints : 1}
				className={styles['c-media-card-list__content']}
				columnClassName={styles['c-media-card-list__column']}
			>
				{isMasonryView && renderSidebar()}
				{items.map((item, i) => (
					<MediaCard
						key={
							(item as IdentifiableMediaCard).schemaIdentifier ||
							`${encodeURIComponent(item.title || 'card')}--${i}`
						}
						buttons={buttons?.(item)}
						actions={actions?.(item)}
						{...item}
						keywords={keywords}
						view={view}
					/>
				))}
			</Masonry>
		</div>
	);
};

export default memo(MediaCardList);
