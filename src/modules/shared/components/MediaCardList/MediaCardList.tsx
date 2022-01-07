import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import Masonry from 'react-masonry-css';

import { MediaCard } from '..';

import styles from './MediaCardList.module.scss';
import { MediaCardListProps } from './MediaCardList.types';

const MediaCardList: FC<MediaCardListProps> = ({ children, items, view }) => {
	if (!items) return null;

	const renderWrapper = (style: 'masonry' | 'sidebar', children?: ReactNode) => (
		<div className={clsx(styles['c-media-card-list'], styles[`c-media-card-list--${style}`])}>
			{children}
		</div>
	);

	const renderChildren = () =>
		children && <div className={styles['c-media-card-list__sidebar']}>{children}</div>;

	const renderItems = () => items.map((item, i) => <MediaCard key={i} {...item} />);

	switch (view) {
		case 'grid':
			return renderWrapper(
				'masonry',
				<Masonry
					breakpointCols={{
						default: 4,
						992: 3,
						768: 2,
						576: 1,
					}}
					className={styles['c-media-card-list__content']}
					columnClassName={styles['c-media-card-list__column']}
				>
					{renderChildren()}

					{renderItems()}
				</Masonry>
			);

		default:
			return renderWrapper(
				'sidebar',
				<>
					{renderChildren()}

					<Masonry
						breakpointCols={1}
						className={styles['c-media-card-list__content']}
						columnClassName={styles['c-media-card-list__column']}
					>
						{renderItems()}
					</Masonry>
				</>
			);
	}
};

export default MediaCardList;
