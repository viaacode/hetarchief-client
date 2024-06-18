import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC } from 'react';

import { CollapsableBladeProps } from '@ie-objects/components';
import { Icon, IconNamesLight } from '@shared/components';

import styles from './CollapsableBlade.module.scss';

const CollapsableBlade: FC<CollapsableBladeProps> = ({
	className,
	icon,
	title,
	renderContent,
	isOpen,
	setIsOpen,
}) => {
	return (
		<div
			className={clsx(className, styles['c-collapsable-blade'], {
				[styles['c-collapsable-blade--open']]: isOpen,
				[styles['c-collapsable-blade--closed']]: !isOpen,
			})}
		>
			<Button
				className={styles['c-collapsable-blade__toggle']}
				onClick={() => setIsOpen(!isOpen)}
				iconStart={icon}
				iconEnd={
					<Icon
						className={clsx(styles['c-collapsable-blade__arrow'], 'u-text-left')}
						name={isOpen ? IconNamesLight.AngleDown : IconNamesLight.AngleUp}
					/>
				}
				label={title}
			/>
			<div className={styles['c-collapsable-blade__scrollable']}>
				{renderContent(!isOpen)}
			</div>
		</div>
	);
};

export default CollapsableBlade;
