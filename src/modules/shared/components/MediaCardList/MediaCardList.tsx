import clsx from 'clsx';
import { FC } from 'react';

import { MediaCard } from '..';

import styles from './MediaCardList.module.scss';
import { MediaCardListProps } from './MediaCardList.types';

const MediaCardList: FC<MediaCardListProps> = ({ children, items, view }) => {
	if (!items) return null;

	const renderChildren = () =>
		children && <div className={styles['c-media-card-list__sidebar']}>{children}</div>;

	const renderItems = () => items.map((item, i) => <MediaCard key={i} {...item} />);

	switch (view) {
		case 'grid':
			return (
				<div
					className={clsx(
						styles['c-media-card-list'],
						styles['c-media-card-list__content'],
						styles['c-media-card-list__content--grid']
					)}
				>
					{renderChildren()}

					{renderItems()}
				</div>
			);

		default:
			return (
				<div className={styles['c-media-card-list']}>
					{renderChildren()}

					<div
						className={clsx(
							styles['c-media-card-list__content'],
							styles['c-media-card-list__content--list']
						)}
					>
						{renderItems()}
					</div>
				</div>
			);
	}
};

export default MediaCardList;
