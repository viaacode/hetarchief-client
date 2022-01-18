import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC } from 'react';

import { useBladeManagerContext } from '@shared/hooks/use-blade-manager-context';

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
	layer,
}) => {
	const { isManaged, currentLayer, opacityStep } = useBladeManagerContext();

	const isBladeOpen = isManaged && layer ? layer <= currentLayer : isOpen;

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
				<Overlay
					visible={isBladeOpen}
					onClick={onClose}
					animate="animate-default"
					className={
						isManaged && layer && layer > 1 ? styles['c-blade__overlay--managed'] : ''
					}
					style={
						isManaged && layer && layer > 1
							? {
									right: `${(currentLayer - layer) * 5.6}rem`,
									opacity: isBladeOpen ? 0.4 - (layer - 2) * opacityStep : 0,
							  }
							: {}
					}
					type={isManaged && layer && layer > 1 ? 'light' : 'dark'}
				/>
			)}
			<div
				role="dialog"
				aria-modal={isBladeOpen}
				aria-labelledby="bladeTitle"
				className={clsx(
					className,
					styles['c-blade'],
					isBladeOpen && styles['c-blade--visible']
				)}
				// offset underlying blades
				style={
					isManaged && layer && layer < currentLayer
						? { transform: `translateX(-${(currentLayer - layer) * 5.6}rem)` }
						: {}
				}
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
