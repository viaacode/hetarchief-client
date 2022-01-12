import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { Icon } from '../Icon';
import { Overlay } from '../Overlay';

import styles from './Blade.module.scss';
import { BladeProps } from './Blade.types';

const Blade: FC<BladeProps> = ({
	className,
	children,
	isOpen,
	title,
	heading,
	footer,
	hideOverlay = false,
	hideCloseButton = false,
	onClose,
}) => {
	const renderCloseButton = () => {
		return (
			<Button
				className={styles['c-blade__close-button']}
				icon={<Icon name="times" />}
				variants="text"
				onClick={onClose}
			/>
		);
	};
	return (
		<>
			{!hideOverlay && (
				<Overlay visible={isOpen} onClick={onClose} animate="animate-default" />
			)}
			<div
				role="dialog"
				aria-modal={isOpen}
				aria-labelledby="bladeTitle"
				className={clsx(className, styles['c-blade'], isOpen && styles['c-blade--visible'])}
			>
				{!hideCloseButton && renderCloseButton()}
				<div className={styles['c-blade__title-wrapper']}>
					{heading ||
						(title && (
							<h3 id="bladeTitle" className={styles['c-blade__title']}>
								{title}
							</h3>
						))}
				</div>
				<div className={styles['c-blade__body-wrapper']}>{children}</div>
				<div className={styles['c-blade__footer-wrapper']}>{footer || <></>}</div>
			</div>
		</>
	);
};

export default Blade;
