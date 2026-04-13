import { getLastEvent } from '@account/utils/get-last-material-request-event';
import {
	type MaterialRequest,
	MaterialRequestEventType,
	MaterialRequestStatus,
} from '@material-requests/types';
import { Button } from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { tText } from '@shared/helpers/translate';
import clsx from 'clsx';
import React, { type FC, useMemo } from 'react';
import styles from './MaterialRequestEvaluatorOptions.module.scss';

interface MaterialRequestEvaluatorOptionsProps {
	onApproveRequest?: () => void;
	onRequestAdditionalConditions?: () => void;
	onDeclineRequest?: () => void;
	currentMaterialRequestDetail: MaterialRequest;
}

export const MaterialRequestEvaluatorOptions: FC<MaterialRequestEvaluatorOptionsProps> = ({
	currentMaterialRequestDetail,
	onApproveRequest,
	onRequestAdditionalConditions,
	onDeclineRequest,
}) => {
	const requestHasAdditionalConditionsAsked = useMemo(() => {
		const lastEvent = getLastEvent(currentMaterialRequestDetail);
		return (
			currentMaterialRequestDetail.status === MaterialRequestStatus.PENDING &&
			lastEvent?.messageType === MaterialRequestEventType.ADDITIONAL_CONDITIONS
		);
	}, [currentMaterialRequestDetail]);

	const renderEvaluatorButton = (
		type: string,
		icon: IconNamesLight,
		label: string,
		description: string,
		disabled = false,
		onClick?: () => void
	) => {
		return (
			<Button
				className={clsx(
					styles['p-material-request-detail-evaluator-options__button'],
					styles[`p-material-request-detail-evaluator-options__button-${type}`]
				)}
				ariaLabel={label}
				disabled={disabled}
				onClick={() => onClick?.()}
			>
				<div className={clsx(styles['p-material-request-detail-evaluator-options__button-title'])}>
					<Icon
						className={clsx(styles['p-material-request-detail-evaluator-options__button-icon'])}
						name={icon}
					/>
					{label}
				</div>
				<span
					className={clsx(
						styles['p-material-request-detail-evaluator-options__button-description']
					)}
				>
					{description}
				</span>
			</Button>
		);
	};

	return (
		<div className={clsx(styles['p-material-request-detail-evaluator-options'])}>
			<span className={clsx(styles['p-material-request-evaluator-options__title'])}>
				{tText('Aanvraag beoordelen descriptive title')}
			</span>
			<span className={clsx(styles['p-material-request-detail-evaluator-options__description'])}>
				{tText('Kies voor de gewenste optie om de aanvraag te beoordelen.')}
			</span>
			{!requestHasAdditionalConditionsAsked &&
				renderEvaluatorButton(
					'approve',
					IconNamesLight.Check,
					tText('Goedkeuren knop label'),
					tText('Goedkeuren knop beschrijving'),
					false,
					onApproveRequest
				)}
			{renderEvaluatorButton(
				'additional-conditions',
				IconNamesLight.Check,
				tText('Goedkeuren mit voorwaarden knop label'),
				tText('Goedkeuren mit voorwaarden knop beschrijving'),
				requestHasAdditionalConditionsAsked,
				onRequestAdditionalConditions
			)}
			{renderEvaluatorButton(
				'deny',
				IconNamesLight.Times,
				tText('Afkeuren knop label'),
				tText('Afkeuren knop beschrijving'),
				false,
				onDeclineRequest
			)}
		</div>
	);
};
