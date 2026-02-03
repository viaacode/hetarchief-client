import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { BladeNew } from '@shared/components/Blade/Blade_new';
import { BladeManager } from '@shared/components/BladeManager';
import { VisitSummary } from '@shared/components/VisitSummary';
import { tText } from '@shared/helpers/translate';
import { VisitStatus } from '@shared/types/visit-request';
import React, { type FC, useState } from 'react';

import { ApproveRequestBlade } from '../ApproveRequestBlade';
import { DeclineRequestBlade } from '../DeclineRequestBlade';

import type { ProcessRequestBladeProps } from './ProcessRequestBlade.types';

const ProcessRequestBlade: FC<ProcessRequestBladeProps> = (props) => {
	const { selected, onFinish } = props;

	const [showApprove, setShowApprove] = useState(false);
	const [showDecline, setShowDecline] = useState(false);

	const finish = (setShowBlade?: typeof setShowApprove | typeof setShowDecline) => {
		setShowBlade?.(false);

		// Needs a little delay, not sure about the amount.
		// 300ms is default duration to hide a blade
		setTimeout(() => props.onClose?.(), 100);

		onFinish?.();
	};

	const getCurrentLayer = (): number => {
		if (showApprove || showDecline) {
			return 2;
		}

		if (props.isOpen) {
			return 1;
		}

		return 0;
	};

	const getTitle = (): string => {
		switch (selected?.status) {
			case VisitStatus.PENDING:
				return tText(
					'modules/cp/components/process-request-blade/process-request-blade___open-aanvraag'
				);

			case VisitStatus.APPROVED:
				return tText(
					'modules/cp/components/process-request-blade/process-request-blade___goedgekeurde-aanvraag'
				);

			case VisitStatus.DENIED:
				return tText(
					'modules/cp/components/process-request-blade/process-request-blade___geweigerde-aanvraag'
				);

			case VisitStatus.CANCELLED_BY_VISITOR:
				return tText(
					'modules/cp/components/process-request-blade/process-request-blade___geannuleerde-aanvraag'
				);

			default:
				return ''; // this causes brief visual "despawn" but isn't very noticable
		}
	};

	const getFooterButtons = (): BladeFooterProps => {
		if (
			!selected ||
			![VisitStatus.APPROVED, VisitStatus.DENIED, VisitStatus.PENDING].includes(selected.status)
		) {
			return [
				{
					label: tText('modules/cp/components/process-request-blade/process-request-blade___sluit'),
					type: 'primary',
					onClick: () => props.onClose?.(),
				},
			];
		}

		return [
			{
				label:
					selected?.status === VisitStatus.APPROVED
						? tText('modules/cp/components/process-request-blade/process-request-blade___aanpassen')
						: tText(
								'modules/cp/components/process-request-blade/process-request-blade___goedkeuren'
							),
				type: 'primary',
				onClick: () => setShowApprove(true),
			},
			{
				label:
					selected?.status === VisitStatus.DENIED
						? tText('modules/cp/components/process-request-blade/process-request-blade___aanpassen')
						: tText('modules/cp/components/process-request-blade/process-request-blade___weigeren'),
				type: 'primary',
				onClick: () => setShowDecline(true),
			},
		];
	};

	// Decide when to show process buttons
	return (
		<BladeManager
			currentLayer={getCurrentLayer()}
			onCloseBlade={() => {
				if (showApprove || showDecline) {
					setShowApprove(false);
					setShowDecline(false);
				} else {
					props.onClose?.();
				}
			}}
		>
			<BladeNew
				{...props}
				footerButtons={getFooterButtons()}
				isOpen={getCurrentLayer() === 1}
				layer={1}
				title={getTitle()}
			>
				{selected && <VisitSummary {...selected} />}
			</BladeNew>

			<ApproveRequestBlade
				isOpen={getCurrentLayer() === (showApprove ? 2 : 9999)}
				layer={showApprove ? 2 : 9999}
				selected={selected}
				onClose={() => setShowApprove(false)}
				onSubmit={async () => finish(setShowApprove)}
				id="process-request-blade__approve-request-blade"
			/>

			<DeclineRequestBlade
				isOpen={getCurrentLayer() === (showDecline ? 2 : 9999)}
				layer={showDecline ? 2 : 9999}
				selected={selected}
				onClose={() => setShowDecline(false)}
				onSubmit={async () => finish(setShowDecline)}
				id="process-request-blade__decline-request-blade"
			/>
		</BladeManager>
	);
};

export default ProcessRequestBlade;
