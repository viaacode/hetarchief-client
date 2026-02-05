import { keysEscape } from '@meemoo/react-components';
import { BladeContent } from '@shared/components/Blade/BladeContent';
import { useBladeManagerContext } from '@shared/hooks/use-blade-manager-context';
import { useScrollLock } from '@shared/hooks/use-scroll-lock';
import { selectHasOpenConfirmationModal } from '@shared/store/ui';
import clsx from 'clsx';
import FocusTrap from 'focus-trap-react';
import { isUndefined } from 'lodash-es';
import { type FC, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Overlay } from '../Overlay';
import type { BladeNewProps } from './Blade.types';
import styles from './Blade_new.module.scss';

export const BladeNew: FC<BladeNewProps> = (props) => {
	const { id, className, isOpen, onClose, wideBladeTitle, layer } = props;
	const { isManaged, currentLayer, opacityStep, onCloseBlade } = useBladeManagerContext();
	const hasOpenConfirmationModal = useSelector(selectHasOpenConfirmationModal);

	useScrollLock(!isManaged && isOpen, 'Blade');

	const isLayered = isManaged && !!layer;
	const isBladeOpen = isLayered ? layer <= currentLayer : isOpen;

	const handleClose = useCallback(() => {
		if (hasOpenConfirmationModal) {
			return;
		}

		if (isLayered && onCloseBlade) {
			onCloseBlade(layer, currentLayer);
		} else if (onClose) {
			onClose();
		}
	}, [hasOpenConfirmationModal, isLayered, layer, currentLayer, onClose, onCloseBlade]);

	const escFunction = useCallback(
		(event: KeyboardEvent) => {
			// Only allow the esc functionality to be triggered when the blade is open
			if (isOpen && keysEscape.includes(event.key)) {
				if (isLayered) {
					// Stop propagation in layered blades so it is only triggered once
					event.stopImmediatePropagation();
				}
				handleClose();
			}
		},
		[isOpen, isLayered, handleClose]
	);

	useEffect(() => {
		document.addEventListener('keydown', escFunction, false);

		return () => {
			document.removeEventListener('keydown', escFunction, false);
		};
	}, [escFunction]);

	const renderContent = () => {
		return (
			<div
				role="dialog"
				aria-modal
				aria-labelledby={id}
				className={clsx(
					className,
					styles['c-blade'],
					isBladeOpen && styles['c-blade--visible'],
					isBladeOpen &&
						(layer === currentLayer || (currentLayer === 0 && isUndefined(layer))) &&
						'c-blade--active',
					isLayered && [styles['c-blade--managed']],
					!!wideBladeTitle && [styles['c-blade--extra-wide']]
				)}
				// offset underlying blades
				style={
					isLayered && layer < currentLayer
						? {
								transform: `translateX(-${(currentLayer - layer) * 5.6}rem)`,
								visibility: 'visible',
							}
						: { visibility: 'visible' }
				}
			>
				{isOpen && <BladeContent {...props} onClose={handleClose} />}
			</div>
		);
	};

	return (
		<>
			<Overlay
				visible={isBladeOpen}
				onClick={() => handleClose()}
				animate="animate-default"
				className={clsx(className, styles['c-blade__overlay'], {
					[styles['c-blade__overlay--managed']]: isLayered && layer > 1,
				})}
				style={
					isLayered && layer > 1 && layer <= currentLayer
						? {
								transform: `translateX(-${(currentLayer - layer) * 5.6}rem)`,
								opacity: isBladeOpen ? (0.4 - (layer - 2) * opacityStep).toFixed(2) : 0,
							}
						: {}
				}
				type={isLayered && layer > 1 ? 'light' : 'dark'}
			/>
			<FocusTrap
				active={isBladeOpen && process.env.NODE_ENV !== 'test'}
				focusTrapOptions={{ clickOutsideDeactivates: true, delayInitialFocus: false }}
			>
				{renderContent()}
			</FocusTrap>
		</>
	);
};
