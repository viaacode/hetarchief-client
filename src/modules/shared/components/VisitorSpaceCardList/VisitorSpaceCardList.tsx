import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';

import VisitorSpaceCard from '../VisitorSpaceCard/VisitorSpaceCard';

import styles from './VisitorSpaceCardList.module.scss';
import { VisitorSpaceCardListProps } from './VisitorSpaceCardList.types';

const VisitorSpaceCardList: FC<VisitorSpaceCardListProps> = ({
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
		<ul style={style} className={clsx(className, styles['c-visitor-space-card-list'])}>
			{getItems().map((item, i) => (
				<li className={styles['c-visitor-space-card-list__item']} key={i}>
					<VisitorSpaceCard {...item} />
				</li>
			))}
		</ul>
	);
};

export default VisitorSpaceCardList;
