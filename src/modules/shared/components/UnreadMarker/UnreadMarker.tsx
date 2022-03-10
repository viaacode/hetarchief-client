import clsx from 'clsx';
import { FC } from 'react';

import styles from './UnreadMarker.module.scss';
import { UnreadMarkerProps } from './UnreadMarker.types';

const UnreadMarker: FC<UnreadMarkerProps> = ({ active }) => {
	return (
		<div
			className={clsx(styles['c-unread-marker'], {
				[styles['c-unread-marker__active']]: active,
			})}
		/>
	);
};

export default UnreadMarker;
