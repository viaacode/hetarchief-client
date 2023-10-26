import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Icon, IconNamesSolid } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useAppDispatch } from '@shared/store';
import {
	selectMaterialRequestCount,
	selectShowMaterialRequestCenter,
} from '@shared/store/ui/ui.select';
import {
	setOpenNavigationDropdownId,
	setShowMaterialRequestCenter,
	setShowNotificationsCenter,
} from '@shared/store/ui/ui.slice';

import { MaterialRequestCenterBlade } from '../MaterialRequestCenterBlade';

import styles from './MaterialRequestCenterButton.module.scss';

const MaterialRequestCenterButton: FC = () => {
	const { tText } = useTranslation();
	const dispatch = useAppDispatch();

	const [isAnimated, setIsAnimated] = useState(false);
	const [previousMaterialCount, setPreviousMaterialCount] = useState<number | undefined>();

	const animationRef = useRef<HTMLElement | null>(null);

	const materialRequestCount = useSelector(selectMaterialRequestCount);
	const showMaterialRequestCenter = useSelector(selectShowMaterialRequestCenter);

	const onButtonClick = () => {
		dispatch(setShowNotificationsCenter(false));
		dispatch(setOpenNavigationDropdownId(null));
		dispatch(setShowMaterialRequestCenter(!showMaterialRequestCenter));
	};

	useEffect(() => {
		// Ward: set isAnimated to true only if materialRequest is updated after initialisation
		if (isNil(previousMaterialCount)) {
			setPreviousMaterialCount(materialRequestCount);
			return;
		}
		if (materialRequestCount !== previousMaterialCount) {
			setPreviousMaterialCount(materialRequestCount);
			setIsAnimated(true);
		}
	}, [materialRequestCount, previousMaterialCount]);

	const handleAnimationEnd = () => {
		setIsAnimated(false);
	};

	const onCloseMaterialRequestCenter = () => {
		dispatch(setShowMaterialRequestCenter(false));
	};

	useEffect(() => {
		const badgeElement = animationRef.current;

		badgeElement && badgeElement.addEventListener('animationend', handleAnimationEnd);

		return () => {
			badgeElement && badgeElement.removeEventListener('animationend', handleAnimationEnd);
		};
	}, []);

	return (
		<>
			<Button
				key="nav-material-request-center"
				onClick={onButtonClick}
				variants={['text', 'md']}
				className={clsx(
					styles['c-material-request-center'],
					showMaterialRequestCenter && styles['c-material-request-center--active']
				)}
				icon={
					<div
						className={clsx(
							styles['c-material-request-center__icon-container'],
							showMaterialRequestCenter ? 'u-color-teal' : 'u-color-white'
						)}
					>
						<Icon
							name={IconNamesSolid.Request}
							aria-hidden
							className={styles['c-material-request-center__icon-container-icon']}
						/>
						{materialRequestCount > 0 && (
							<span
								ref={animationRef}
								className={clsx(
									styles['c-material-request-center__icon-container-badge'],
									isAnimated &&
										styles[
											'c-material-request-center__icon-container-badge--animated'
										]
								)}
							>
								{materialRequestCount}
							</span>
						)}
					</div>
				}
				aria-label={tText('modules/navigation/const/index___notificaties')}
			/>
			<MaterialRequestCenterBlade
				isOpen={showMaterialRequestCenter}
				onClose={onCloseMaterialRequestCenter}
			/>
		</>
	);
};

export default MaterialRequestCenterButton;
