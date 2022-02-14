import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import React, { FC, useState } from 'react';

import { requestCreatedAtFormatter } from '@cp/const/requests.const';
import { Blade, BladeManager, Icon } from '@shared/components';

import { ApproveRequestBlade } from '../ApproveRequestBlade';
import { DeclineRequestBlade } from '../DeclineRequestBlade';

import styles from './ProcessRequestBlade.module.scss';
import { ProcessRequestBladeProps } from './ProcessRequestBlade.types';

const ProcessRequestBlade: FC<ProcessRequestBladeProps> = (props) => {
	const { t } = useTranslation();
	const { selected } = props;

	const [showApprove, setShowApprove] = useState(false);
	const [showDecline, setShowDecline] = useState(false);

	const finish = (setShowBlade?: typeof setShowApprove | typeof setShowDecline) => {
		setShowBlade && setShowBlade(false);

		// Needs a little delay, not sure about the amount.
		// 300ms is default duration to hide a blade
		setTimeout(() => props.onClose?.(), 100);
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

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-16">
				<Button
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
				title={t(
					'modules/cp/components/process-request-blade/process-request-blade___open-aanvraag'
				)}
				footer={renderFooter()}
				layer={1}
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
									{selected.email}
								</li>

								<li className={styles['c-process-request-blade__info-item']}>
									<strong>
										{t(
											'modules/cp/components/process-request-blade/process-request-blade___tijdstip'
										)}
										:
									</strong>{' '}
									{requestCreatedAtFormatter(selected.created_at)}
								</li>
							</ul>
						</div>

						<div className={styles['c-process-request-blade__details']}>
							<strong>
								{t(
									'modules/cp/components/process-request-blade/process-request-blade___aanvrager'
								)}
							</strong>
							<p>{selected.name}</p>

							<strong>
								{t(
									'modules/cp/components/process-request-blade/process-request-blade___reden-van-aanvraag'
								)}
							</strong>
							<p>{selected.reason}</p>

							<strong>
								{t(
									'modules/cp/components/process-request-blade/process-request-blade___wanneer-wil-je-de-leeszaal-bezoeken'
								)}
							</strong>
							<p>{selected.time}</p>
						</div>
					</>
				)}
			</Blade>

			<ApproveRequestBlade
				isOpen={false}
				layer={showApprove ? 2 : 9999}
				selected={selected}
				onClose={() => setShowApprove(false)}
				onSubmit={() => finish(setShowApprove)}
			/>

			<DeclineRequestBlade
				isOpen={false}
				layer={showDecline ? 2 : 9999}
				selected={selected}
				onClose={() => setShowDecline(false)}
				onSubmit={() => finish(setShowDecline)}
			/>
		</BladeManager>
	);
};

export default ProcessRequestBlade;
