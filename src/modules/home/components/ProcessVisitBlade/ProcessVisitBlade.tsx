import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import { BladeManager } from '@shared/components/BladeManager';
import { VisitSummary } from '@shared/components/VisitSummary';
import { tText } from '@shared/helpers/translate';
import { VisitStatus } from '@shared/types/visit-request';
import { type FC, useState } from 'react';

import { CancelVisitBlade } from '../CancelVisitBlade';

import type { ProcessVisitBladeProps } from './ProcessVisitBlade.types';

const ProcessVisitBlade: FC<ProcessVisitBladeProps> = (props) => {
	const { selected, onFinish } = props;

	const [showCancel, setShowCancel] = useState(false);

	const finish = (setShowBlade?: typeof setShowCancel) => {
		setShowBlade?.(false);

		// Needs a little delay, not sure about the amount.
		// 300ms is default duration to hide a blade
		setTimeout(() => props.onClose?.(), 100);

		onFinish?.();
	};

	const getCurrentLayer = (): number => {
		if (showCancel) {
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
					'modules/home/components/process-visit-blade/process-visit-blade___detail-aanvraag'
				);

			case VisitStatus.APPROVED:
				return tText(
					'modules/home/components/process-visit-blade/process-visit-blade___detail-gepland-bezoek'
				);

			default:
				return ''; // this causes brief visual "despawn" but isn't very noticable
		}
	};

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText(
					'modules/home/components/process-visit-blade/process-visit-blade___annuleer-bezoek'
				),
				mobileLabel: tText(
					'modules/home/components/process-visit-blade/process-visit-blade___annuleer-bezoek-mobiel'
				),
				type: 'secondary',
				onClick: () => setShowCancel(true),
				disabled: !props.isOpen,
			},
			{
				label: tText('modules/home/components/process-visit-blade/process-visit-blade___sluit'),
				mobileLabel: tText(
					'modules/home/components/process-visit-blade/process-visit-blade___sluit-mobiel'
				),
				type: 'primary',
				onClick: () => props.onClose?.(),
				disabled: !props.isOpen,
			},
		];
	};
	return (
		<BladeManager
			currentLayer={getCurrentLayer()}
			onCloseBlade={() => {
				if (showCancel) {
					setShowCancel(false);
				} else {
					props.onClose?.();
				}
			}}
		>
			<Blade
				{...props}
				footerButtons={getFooterButtons()}
				isOpen={getCurrentLayer() === 1}
				layer={1}
				title={getTitle()}
				id="process-visit-blade__visit-summary"
			>
				{selected && <VisitSummary preview {...selected} />}
			</Blade>

			<CancelVisitBlade
				isOpen={getCurrentLayer() === (showCancel ? 2 : 9999)}
				layer={showCancel ? 2 : 9999}
				selected={selected}
				onClose={() => setShowCancel(false)}
				onFinish={() => finish(setShowCancel)}
				id="process-visit-blade__cancel-visit-blade"
			/>
		</BladeManager>
	);
};

export default ProcessVisitBlade;
