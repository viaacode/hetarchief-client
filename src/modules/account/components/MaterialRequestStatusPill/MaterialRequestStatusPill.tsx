import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_STATUS } from '@material-requests/const';
import { MaterialRequestStatus } from '@material-requests/types';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Pill } from '@shared/components/Pill';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './MaterialRequestStatusPill.module.scss';

interface MaterialRequestStatusPillProps {
	status: MaterialRequestStatus;
	showLabel?: boolean;
}

const MaterialRequestStatusPill: FC<MaterialRequestStatusPillProps> = ({
	status,
	showLabel = false,
}) => {
	if (status === MaterialRequestStatus.NONE) {
		return null;
	}

	const label = GET_MATERIAL_REQUEST_TRANSLATIONS_BY_STATUS()[status];

	const determineIcon = () => {
		switch (status) {
			case MaterialRequestStatus.NEW:
				return IconNamesLight.Star;
			case MaterialRequestStatus.PENDING:
				return IconNamesLight.Hourglass;
			case MaterialRequestStatus.APPROVED:
				return IconNamesLight.Check;
			case MaterialRequestStatus.DENIED:
				return IconNamesLight.Forbidden;
			case MaterialRequestStatus.CANCELLED:
				return IconNamesLight.Trash;

			default:
				// This should not happen
				return IconNamesLight.Question;
		}
	};

	return (
		<div className={styles['c-material-request-status-pill']}>
			<Pill
				icon={determineIcon()}
				label={label}
				className={clsx(
					styles['c-material-request-status-pill__pill'],
					styles[`c-material-request-status-pill__pill--${status.toLowerCase()}`]
				)}
			/>
			{showLabel && (
				<span className={styles['c-material-request-status-pill__label']}>{label}</span>
			)}
		</div>
	);
};

export default MaterialRequestStatusPill;
