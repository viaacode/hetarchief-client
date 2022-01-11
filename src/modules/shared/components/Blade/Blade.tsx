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
	hideOverlay,
	hideCloseButton,
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
				{heading || <h3 id="bladeTitle">{title}</h3>}
				{children}
				{footer || <></>}
				{!hideCloseButton && renderCloseButton()}
			</div>
		</>
	);
};

export default Blade;
