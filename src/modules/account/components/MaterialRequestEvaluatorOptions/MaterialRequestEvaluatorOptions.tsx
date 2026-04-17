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
				{tText(
					'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___aanvraag-beoordelen-descriptive-title'
				)}
			</span>
			<span className={clsx(styles['p-material-request-detail-evaluator-options__description'])}>
				{tText(
					'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___kies-voor-de-gewenste-optie-om-de-aanvraag-te-beoordelen'
				)}
			</span>
			{!requestHasAdditionalConditionsAsked &&
				renderEvaluatorButton(
					'approve',
					IconNamesLight.Check,
					tText(
						'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___goedkeuren-knop-label'
					),
					tText(
						'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___goedkeuren-knop-beschrijving'
					),
					false,
					onApproveRequest
				)}
			{renderEvaluatorButton(
				'additional-conditions',
				IconNamesLight.Check,
				tText(
					'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___goedkeuren-mit-voorwaarden-knop-label'
				),
				tText(
					'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___goedkeuren-mit-voorwaarden-knop-beschrijving'
				),
				requestHasAdditionalConditionsAsked,
				onRequestAdditionalConditions
			)}
			{renderEvaluatorButton(
				'deny',
				IconNamesLight.Times,
				tText(
					'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___afkeuren-knop-label'
				),
				tText(
					'modules/account/components/material-request-evaluator-options/material-request-evaluator-options___afkeuren-knop-beschrijving'
				),
				false,
				onDeclineRequest
			)}
		</div>
	);
};
