import clsx from 'clsx';
import React, { FC, useState } from 'react';

import { Icon } from '@shared/components';

import styles from './RelatedObjectsBlade.module.scss';
import { RelatedObjectsBladeProps } from './RelatedObjectsBlade.types';

const RelatedObjectsBlade: FC<RelatedObjectsBladeProps> = ({
	className,
	icon,
	title,
	renderContent,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		// Wrapped to avoid conflicting css transitions and jerky motion
		<div className={className}>
			<div
				className={clsx(
					styles['c-related-objects-blade'],
					isOpen && styles['c-related-objects-blade--open']
				)}
			>
				<button
					className={styles['c-related-objects-blade__toggle']}
					onClick={() => setIsOpen(!isOpen)}
				>
					{icon && icon}
					<b className={styles['c-related-objects-blade__title']}>{title}</b>
					<Icon
						className={styles['c-related-objects-blade__arrow']}
						name={isOpen ? 'angle-down' : 'angle-up'}
					/>
				</button>
				{renderContent(!isOpen)}
			</div>
		</div>
	);
};

export default RelatedObjectsBlade;
