import { GET_MATERIAL_REQUEST_TRANSLATIONS_BY_STATUS } from '@material-requests/const';
import { MaterialRequestStatus } from '@material-requests/types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { Pill } from '@shared/components/Pill';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import type { FC } from 'react';

import styles from './MaterialRequestStatusPill.module.scss';

interface MaterialRequestStatusPillProps {
	status: MaterialRequestStatus;
	showLabel?: boolean;
	includeStatusNone?: boolean;
}

const MaterialRequestStatusPill: FC<MaterialRequestStatusPillProps> = ({
	status,
	showLabel = false,
	includeStatusNone = false,
}) => {
	const label = GET_MATERIAL_REQUEST_TRANSLATIONS_BY_STATUS()[status];

	if (status === MaterialRequestStatus.NONE) {
		if (includeStatusNone) {
			return (
				<div className={styles['c-material-request-status-pill']}>
					<Pill
						icon={IconNamesLight.Info}
						label={label}
						ariaLabel={tText(
							'Dit is een niet uitgebreide materiaal aanvraag zonder status - aria label'
						)}
						className={clsx(
							styles['c-material-request-status-pill__pill'],
							styles['c-material-request-status-pill__pill--none']
						)}
					/>
					{showLabel && (
						<span className={styles['c-material-request-status-pill__label']}>
							{GET_MATERIAL_REQUEST_TRANSLATIONS_BY_STATUS()[status]}
						</span>
					)}
				</div>
			);
		}
		return null;
	}

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
				ariaLabel={label}
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
