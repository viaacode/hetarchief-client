import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC, useState } from 'react';

import { Icon, IconNamesLight } from '@shared/components';

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
		<div
			className={clsx(
				className,
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
						className={clsx(styles['c-related-objects-blade__arrow'], 'u-text-left')}
						name={isOpen ? IconNamesLight.AngleDown : IconNamesLight.AngleUp}
					/>
				}
				label={title}
			/>
			<div className={styles['c-related-objects-blade__scrollable']}>
				{renderContent(!isOpen)}
			</div>
		</div>
	);
};

export default RelatedObjectsBlade;
