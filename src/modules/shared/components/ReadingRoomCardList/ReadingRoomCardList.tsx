import React, { FC } from 'react';

import ReadingRoomCard from '../ReadingRoomCard/ReadingRoomCard';

import styles from './ReadingRoomCardList.module.scss';
import { ReadingRoomCardListProps } from './ReadingRoomCardList.types';

const ReadingRoomCardList: FC<ReadingRoomCardListProps> = ({ items }) => {
	return items ? (
		<ul className={styles['c-reading-room-card-list']}>
			{items.map((item, i) => (
				<li className={styles['c-reading-room-card-list__item']} key={i}>
					<ReadingRoomCard {...item} />
				</li>
			))}
		</ul>
	) : null;
};

export default ReadingRoomCardList;
