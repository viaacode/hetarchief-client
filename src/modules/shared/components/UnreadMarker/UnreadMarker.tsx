import clsx from 'clsx';
import { FC } from 'react';

import styles from './UnreadMarker.module.scss';
import { UnreadMarkerProps } from './UnreadMarker.types';

const UnreadMarker: FC<UnreadMarkerProps> = ({ className, active }) => {
	return (
		<div
			className={clsx(className, styles['c-unread-marker'], {
				[styles['c-unread-marker__active']]: active,
			})}
		/>
	);
};

export default UnreadMarker;
