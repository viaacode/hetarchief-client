import { Button } from '@meemoo/react-components';
import React, { FC, ReactNode, useState } from 'react';

import { Blade, BladeManager, Icon, VisitSummary } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { VisitStatus } from '@shared/types';
import { formatDistanceToday } from '@shared/utils';

import { ApproveRequestBlade } from '../ApproveRequestBlade';
import { DeclineRequestBlade } from '../DeclineRequestBlade';

import styles from './ProcessRequestBlade.module.scss';
import { ProcessRequestBladeProps } from './ProcessRequestBlade.types';

const ProcessRequestBlade: FC<ProcessRequestBladeProps> = (props) => {
	const { tHtml } = useTranslation();
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

	const getTitle = (): string | ReactNode => {
		switch (selected?.status) {
			case VisitStatus.PENDING:
				return tHtml(
					'modules/cp/components/process-request-blade/process-request-blade___open-aanvraag'
				);

			case VisitStatus.APPROVED:
				return tHtml(
					'modules/cp/components/process-request-blade/process-request-blade___goedgekeurde-aanvraag'
				);

			case VisitStatus.DENIED:
				return tHtml(
					'modules/cp/components/process-request-blade/process-request-blade___geweigerde-aanvraag'
				);

			case VisitStatus.CANCELLED_BY_VISITOR:
				return tHtml(
					'modules/cp/components/process-request-blade/process-request-blade___geannuleerde-aanvraag'
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
					label={
						selected && selected?.status === VisitStatus.APPROVED
							? tHtml(
									'modules/cp/components/process-request-blade/process-request-blade___aanpassen'
							  )
							: tHtml(
									'modules/cp/components/process-request-blade/process-request-blade___goedkeuren'
							  )
					}
					iconStart={<Icon name="check" />}
					variants={['block', 'black']}
					onClick={() => setShowApprove(true)}
				/>

				<Button
					label={
						selected && selected?.status === VisitStatus.DENIED
							? tHtml(
									'modules/cp/components/process-request-blade/process-request-blade___aanpassen'
							  )
							: tHtml(
									'modules/cp/components/process-request-blade/process-request-blade___weigeren'
							  )
					}
					iconStart={<Icon name="forbidden" />}
					variants={['block', 'text']}
					onClick={() => setShowDecline(true)}
				/>
			</div>
		);
	};

	// Decide when to show process buttons
	const footer =
		props.isOpen &&
		selected &&
		[VisitStatus.APPROVED, VisitStatus.DENIED, VisitStatus.PENDING].includes(selected.status)
			? renderFooter()
			: undefined;

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
				footer={footer}
				layer={1}
				isOpen={getCurrentLayer() === 1}
			>
				{selected && (
					<>
						<div className={styles['c-process-request-blade__info']}>
							<ul className={styles['c-process-request-blade__info-list']}>
								<li className={styles['c-process-request-blade__info-item']}>
									<strong>
										{tHtml(
											'modules/cp/components/process-request-blade/process-request-blade___emailadres'
										)}
										:
									</strong>{' '}
									{selected.visitorMail}
								</li>

								<li className={styles['c-process-request-blade__info-item']}>
									<strong>
										{tHtml(
											'modules/cp/components/process-request-blade/process-request-blade___tijdstip'
										)}
										:
									</strong>{' '}
									{formatDistanceToday(selected.createdAt)}
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
				onSubmit={async () => finish(setShowApprove)}
			/>

			<DeclineRequestBlade
				isOpen={getCurrentLayer() === (showDecline ? 2 : 9999)}
				layer={showDecline ? 2 : 9999}
				selected={selected}
				onClose={() => setShowDecline(false)}
				onSubmit={async () => finish(setShowDecline)}
			/>
		</BladeManager>
	);
};

export default ProcessRequestBlade;
