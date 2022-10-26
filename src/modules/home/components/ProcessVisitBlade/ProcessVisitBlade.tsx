import { Button } from '@meemoo/react-components';
import { FC, ReactNode, useState } from 'react';

import { Blade, BladeManager, Icon, VisitSummary } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { VisitStatus } from '@shared/types';

import { CancelVisitBlade } from '../CancelVisitBlade';

import { ProcessVisitBladeProps } from './ProcessVisitBlade.types';

const ProcessVisitBlade: FC<ProcessVisitBladeProps> = (props) => {
	const { tHtml } = useTranslation();
	const { selected, onFinish } = props;

	const [showCancel, setShowCancel] = useState(false);

	const finish = (setShowBlade?: typeof setShowCancel) => {
		setShowBlade && setShowBlade(false);

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

	const getTitle = (): string | ReactNode => {
		switch (selected?.status) {
			case VisitStatus.PENDING:
				return tHtml(
					'modules/home/components/process-visit-blade/process-visit-blade___detail-aanvraag'
				);

			case VisitStatus.APPROVED:
				return tHtml(
					'modules/home/components/process-visit-blade/process-visit-blade___detail-gepland-bezoek'
				);

			default:
				return ''; // this causes brief visual "despawn" but isn't very noticable
		}
	};

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<Button
					className="u-mb-16"
					label={tHtml(
						'modules/home/components/process-visit-blade/process-visit-blade___annuleer-bezoek'
					)}
					iconStart={<Icon name="forbidden" />}
					variants={['block', 'outline']}
					onClick={() => setShowCancel(true)}
					disabled={!props.isOpen}
				/>

				<Button
					label={tHtml(
						'modules/home/components/process-visit-blade/process-visit-blade___sluit'
					)}
					variants={['block', 'text']}
					onClick={() => props.onClose?.()}
					disabled={!props.isOpen}
				/>
			</div>
		);
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
				footer={renderFooter()}
				isOpen={getCurrentLayer() === 1}
				layer={1}
				renderTitle={(props) => <h3 {...props}>{getTitle()}</h3>}
			>
				{selected && <VisitSummary preview {...selected} />}
			</Blade>

			<CancelVisitBlade
				isOpen={getCurrentLayer() === (showCancel ? 2 : 9999)}
				layer={showCancel ? 2 : 9999}
				selected={selected}
				onClose={() => setShowCancel(false)}
				onFinish={() => finish(setShowCancel)}
			/>
		</BladeManager>
	);
};

export default ProcessVisitBlade;
