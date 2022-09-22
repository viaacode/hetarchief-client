import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { default as Scrollbar } from 'react-scrollbars-custom';

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
				<Button
					className={styles['c-related-objects-blade__toggle']}
					onClick={() => setIsOpen(!isOpen)}
					iconStart={icon}
					iconEnd={
						<Icon
							className={clsx(
								styles['c-related-objects-blade__arrow'],
								'u-text-left'
							)}
							name={isOpen ? 'angle-down' : 'angle-up'}
						/>
					}
					label={title}
				/>
				<Scrollbar noScrollX>{renderContent(!isOpen)}</Scrollbar>
			</div>
		</div>
	);
};

export default RelatedObjectsBlade;
