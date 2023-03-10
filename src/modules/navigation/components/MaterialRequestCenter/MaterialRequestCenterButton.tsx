import { Button } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { Icon, IconNamesSolid } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { selectMaterialRequestCount } from '@shared/store/ui';

import { MaterialRequestCenterBlade } from '../MaterialRequestCenterBlade';

import styles from './MaterialRequestCenterButton.module.scss';

const MaterialRequestCenterButton: FC = () => {
	const { tText } = useTranslation();
	const [isBladeOpen, setIsBladeOpen] = useState(false);

	const materialRequestCount = useSelector(selectMaterialRequestCount);

	const onButtonClick = () => {
		setIsBladeOpen(!isBladeOpen);
	};

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
							// Ward: mirror the icon to match design
							style={{ transform: 'scale(-1, 1)' }}
						/>
						{materialRequestCount > 0 && (
							<span
								className={clsx(
									// TODO: if {materialRequests?.items.length} changes, apply animation styling
									styles['c-material-request-center__icon-container-badge'],
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
