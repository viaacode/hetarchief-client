import { Button } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import React, { FC, useState } from 'react';

import { requestCreatedAtFormatter } from '@cp/const/requests.const';
import { Blade, BladeManager } from '@shared/components';

import styles from './ProcessRequestBlade.module.scss';
import { ProcessRequestBladeProps } from './ProcessRequestBlade.types';

const ProcessRequestBlade: FC<ProcessRequestBladeProps> = (props) => {
	const { t } = useTranslation();
	const { selected } = props;

	const [showApprove, setShowApprove] = useState(false);
	const [showDecline, setShowDecline] = useState(false);

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
					label={t('Goedkeuren')}
					variants={['block', 'black']}
					onClick={() => setShowApprove(true)}
				/>

				<Button
					label={t('Weigeren')}
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
			<Blade {...props} title={t('Open aanvraag')} footer={renderFooter()} layer={1}>
				{selected && (
					<>
						<div className={styles['c-process-request-blade__info']}>
							<ul className={styles['c-process-request-blade__info-list']}>
								<li className={styles['c-process-request-blade__info-item']}>
									<strong>{t('Emailadres')}:</strong> {selected.email}
								</li>

								<li className={styles['c-process-request-blade__info-item']}>
									<strong>{t('Tijdstip')}:</strong>{' '}
									{requestCreatedAtFormatter(selected.created_at)}
								</li>
							</ul>
						</div>

						<div className={styles['c-process-request-blade__details']}>
							<strong>{t('Aanvrager')}</strong>
							<p>{selected.name}</p>

							<strong>{t('Reden van aanvraag')}</strong>
							<p>{selected.reason}</p>

							<strong>{t('Wanneer wil je de leeszaal bezoeken?')}</strong>
							<p>{selected.time}</p>
						</div>
					</>
				)}
			</Blade>

			<Blade
				title={t('Goedkeuren')}
				isOpen={false}
				onClose={() => setShowApprove(false)}
				layer={showApprove ? 2 : 9999}
			/>
			<Blade
				title={t('Weigeren')}
				isOpen={false}
				onClose={() => setShowDecline(false)}
				layer={showDecline ? 2 : 9999}
			/>
		</BladeManager>
	);
};

export default ProcessRequestBlade;
