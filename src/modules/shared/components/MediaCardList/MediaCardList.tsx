import clsx from 'clsx';
import { FC, memo } from 'react';
import Masonry from 'react-masonry-css';

import { MediaCard } from '../MediaCard';

import { MEDIA_CARD_LIST_GRID_BP_COLS } from './MediaCardList.const';
import styles from './MediaCardList.module.scss';
import { MediaCardListProps } from './MediaCardList.types';

const MediaCardList: FC<MediaCardListProps> = ({ items, keywords, view, sidebar }) => {
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
				breakpointCols={isMasonryView ? MEDIA_CARD_LIST_GRID_BP_COLS : 1}
				className={styles['c-media-card-list__content']}
				columnClassName={styles['c-media-card-list__column']}
			>
				{isMasonryView && renderSidebar()}
				{items.map((item, i) => (
					<MediaCard key={i} {...item} keywords={keywords} view={view} />
				))}
			</Masonry>
		</div>
	);
};

export default memo(MediaCardList);
