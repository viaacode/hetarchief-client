import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { isNil } from 'lodash-es';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Icon, IconNamesSolid } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectMaterialRequestCount } from '@shared/store/ui';

import { MaterialRequestCenterBlade } from '../MaterialRequestCenterBlade';

import styles from './MaterialRequestCenterButton.module.scss';

const MaterialRequestCenterButton: FC = () => {
	const { tText } = useTranslation();

	const [isBladeOpen, setIsBladeOpen] = useState(false);
	const [isAnimated, setIsAnimated] = useState(false);
	const [previousMaterialCount, setPreviousMaterialCount] = useState<number | undefined>();

	const animationRef = useRef<HTMLElement | null>(null);

	const materialRequestCount = useSelector(selectMaterialRequestCount);

	const onButtonClick = () => {
		setIsBladeOpen(!isBladeOpen);
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
	}, [materialRequestCount]);

	const handleAnimationEnd = () => {
		setIsAnimated(false);
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
					isBladeOpen && styles['c-material-request-center--active']
				)}
				icon={
					<div
						className={clsx(
							styles['c-material-request-center__icon-container'],
							isBladeOpen ? 'u-color-teal' : 'u-color-white'
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
				isOpen={isBladeOpen}
				onClose={() => setIsBladeOpen(false)}
			/>
		</>
	);
};

export default MaterialRequestCenterButton;
