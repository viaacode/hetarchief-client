import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { type FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Icon } from '@shared/components/Icon';
import { IconNamesSolid } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import { useAppDispatch } from '@shared/store';
import {
	selectMaterialRequestCount,
	selectShowMaterialRequestCenter,
	setOpenNavigationDropdownId,
	setShowMaterialRequestCenter,
	setShowNotificationsCenter,
} from '@shared/store/ui';
import { scrollTo } from '@shared/utils/scroll-to-top';

import { MaterialRequestCenterBlade } from '../MaterialRequestCenterBlade';

import styles from './MaterialRequestCenterButton.module.scss';

const MaterialRequestCenterButton: FC = () => {
	const dispatch = useAppDispatch();

	const [isAnimated, setIsAnimated] = useState(false);
	const [previousMaterialCount, setPreviousMaterialCount] = useState<number | undefined>();

	const animationRef = useRef<HTMLElement | null>(null);

	const materialRequestCount = useSelector(selectMaterialRequestCount);
	const showMaterialRequestCenter = useSelector(selectShowMaterialRequestCenter);

	useEffect(() => {
		if (showMaterialRequestCenter) {
			scrollTo(0, 'instant');
		}
	}, [showMaterialRequestCenter]);

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

	const onCloseMaterialRequestCenter = () => {
		dispatch(setShowMaterialRequestCenter(false));
	};

	useEffect(() => {
		const handleAnimationEnd = () => {
			setIsAnimated(false);
		};

		const badgeElement = animationRef.current;

		badgeElement?.addEventListener('animationend', handleAnimationEnd);

		return () => {
			badgeElement?.removeEventListener('animationend', handleAnimationEnd);
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
				title={tText(
					'modules/navigation/components/material-request-center/material-request-center-button___hover-materiaal-aanvragen'
				)}
			/>
			<MaterialRequestCenterBlade
				isOpen={showMaterialRequestCenter}
				onClose={onCloseMaterialRequestCenter}
			/>
		</>
	);
};

export default MaterialRequestCenterButton;
