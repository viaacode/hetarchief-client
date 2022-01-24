import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';

import ReadingRoomCard from '../ReadingRoomCard/ReadingRoomCard';

import styles from './ReadingRoomCardList.module.scss';
import { ReadingRoomCardListProps } from './ReadingRoomCardList.types';

const ReadingRoomCardList: FC<ReadingRoomCardListProps> = ({
	className,
	items = [],
	limit = true,
	style,
}) => {
	const [max, setMax] = useState(3);

	// Only run once to avoid listeners
	useEffect(() => {
		if (window.innerWidth >= 768) {
			setMax(6);
		}
	}, []);

	const getItems = () => {
		if (!items) {
			return [];
		}

		if (limit) {
			return items.slice(0, max);
		}

		return items;
	};

	return (
		<ul style={style} className={clsx(className, styles['c-reading-room-card-list'])}>
			{getItems().map((item, i) => (
				<li className={styles['c-reading-room-card-list__item']} key={i}>
					<ReadingRoomCard {...item} />
				</li>
			))}
		</ul>
	);
};

export default ReadingRoomCardList;
