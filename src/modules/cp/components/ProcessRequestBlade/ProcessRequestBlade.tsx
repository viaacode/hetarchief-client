import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import React, { FC, useState } from 'react';

import { requestCreatedAtFormatter } from '@cp/utils';
import { Blade, BladeManager, Icon, VisitSummary } from '@shared/components';
import { VisitStatus } from '@shared/types';

import { ApproveRequestBlade } from '../ApproveRequestBlade';
import { DeclineRequestBlade } from '../DeclineRequestBlade';

import styles from './ProcessRequestBlade.module.scss';
import { ProcessRequestBladeProps } from './ProcessRequestBlade.types';

const ProcessRequestBlade: FC<ProcessRequestBladeProps> = (props) => {
	const { t } = useTranslation();
	const { selected, onFinish } = props;

	const [showApprove, setShowApprove] = useState(false);
	const [showDecline, setShowDecline] = useState(false);

	const finish = (setShowBlade?: typeof setShowApprove | typeof setShowDecline) => {
		setShowBlade && setShowBlade(false);

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
				return t(
					'modules/cp/components/process-request-blade/process-request-blade___open-aanvraag'
				);

			case VisitStatus.APPROVED:
				return t(
					'modules/cp/components/process-request-blade/process-request-blade___goedgekeurde-aanvraag'
				);

			case VisitStatus.DENIED:
				return t(
					'modules/cp/components/process-request-blade/process-request-blade___geweigerde-aanvraag'
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
					label={t(
						'modules/cp/components/process-request-blade/process-request-blade___goedkeuren'
					)}
					iconStart={<Icon name="check" />}
					variants={['block', 'black']}
					onClick={() => setShowApprove(true)}
				/>

				<Button
					label={t(
						'modules/cp/components/process-request-blade/process-request-blade___weigeren'
					)}
					iconStart={<Icon name="forbidden" />}
					variants={['block', 'text']}
					onClick={() => setShowDecline(true)}
				/>
			</div>
		);
	};

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
			<Blade
				{...props}
				title={getTitle()}
				footer={selected?.status === VisitStatus.PENDING ? renderFooter() : undefined}
				layer={1}
				isOpen={getCurrentLayer() === 1}
			>
				{selected && (
					<>
						<div className={styles['c-process-request-blade__info']}>
							<ul className={styles['c-process-request-blade__info-list']}>
								<li className={styles['c-process-request-blade__info-item']}>
									<strong>
										{t(
											'modules/cp/components/process-request-blade/process-request-blade___emailadres'
										)}
										:
									</strong>{' '}
									{selected.visitorMail}
								</li>

								<li className={styles['c-process-request-blade__info-item']}>
									<strong>
										{t(
											'modules/cp/components/process-request-blade/process-request-blade___tijdstip'
										)}
										:
									</strong>{' '}
									{requestCreatedAtFormatter(selected.createdAt)}
								</li>
							</ul>
						</div>

						<VisitSummary {...selected} />
					</>
				)}
			</Blade>

			<ApproveRequestBlade
				isOpen={getCurrentLayer() === (showApprove ? 2 : 9999)}
				layer={showApprove ? 2 : 9999}
				selected={selected}
				onClose={() => setShowApprove(false)}
				onSubmit={() => finish(setShowApprove)}
			/>

			<DeclineRequestBlade
				isOpen={getCurrentLayer() === (showDecline ? 2 : 9999)}
				layer={showDecline ? 2 : 9999}
				selected={selected}
				onClose={() => setShowDecline(false)}
				onSubmit={() => finish(setShowDecline)}
			/>
		</BladeManager>
	);
};

export default ProcessRequestBlade;
