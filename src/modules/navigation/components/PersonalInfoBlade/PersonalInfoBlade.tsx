import { Button, RadioButton, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import React, { FC, useState } from 'react';

import { MaterialRequestsService } from '@material-requests/services';
import { MaterialRequestRequesterCapacity } from '@material-requests/types';
import { Blade } from '@shared/components';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { toastService } from '@shared/services/toast-service';

import { PersonalInfoBladeBladeProps } from './PersonalInfo.types';
import styles from './PersonalInfoBlade.module.scss';

const PersonalInfoBlade: FC<PersonalInfoBladeBladeProps> = ({ isOpen, onClose, personalInfo }) => {
	const { tText } = useTranslation();

	const [typeSelected, setTypeSelected] = useState<MaterialRequestRequesterCapacity>(
		personalInfo.requesterCapacity
	);
	const [organisationInputValue, setOrganisationInputValue] = useState<string>(
		personalInfo.organisation || ''
	);

	const onSendRequests = async () => {
		try {
			await MaterialRequestsService.sendAll({
				type: typeSelected,
				organisation: organisationInputValue,
			});
			toastService.notify({
				maxLines: 3,
				title: tText(
					'modules/navigation/components/personal-info-blade/personal-info-blade___verzenden-succes'
				),
				description: tText(
					'modules/navigation/components/personal-info-blade/personal-info-blade___requests-zijn-verzonden'
				),
			});
			onClose();
		} catch (err) {
			console.log({ err });
			onFailedRequest();
		}
	};

	const onFailedRequest = () => {
		toastService.notify({
			maxLines: 3,
			title: tText(
				'modules/navigation/components/personal-info-blade/personal-info-blade___er-ging-iets-mis'
			),
			description: tText(
				'modules/navigation/components/personal-info-blade/personal-info-blade___er-ging-iets-mis-tijdens-het-versturen'
			),
		});
	};

	const renderFooter = () => {
		return (
			<div className={styles['c-personal-info-blade__close-button-container']}>
				<Button
					label={tText(
						'modules/navigation/components/personal-info-blade/personal-info-blade___verstuur'
					)}
					variants={['block', 'text', 'dark']}
					onClick={onSendRequests}
					className={styles['c-personal-info-blade__send-button']}
				/>
				<Button
					label={tText(
						'modules/navigation/components/personal-info-blade/personal-info-blade___annuleer'
					)}
					variants={['block', 'text', 'light']}
					onClick={onClose}
				/>
			</div>
		);
	};

	return (
		<Blade
			isOpen={isOpen}
			renderTitle={() => (
				<h4 className={styles['c-personal-info-blade__title']}>
					{tText(
						'modules/navigation/components/personal-info-blade/personal-info-blade___persoonlijke-gegevens'
					)}
				</h4>
			)}
			footer={isOpen && renderFooter()}
			onClose={onClose}
			showBackButton
		>
			<div className={styles['c-personal-info-blade__content']}>
				<dl>
					<dt className={styles['c-personal-info-blade__content-label']}>
						{tText(
							'modules/navigation/components/personal-info-blade/personal-info-blade___fullName'
						)}
					</dt>
					<dd className={styles['c-personal-info-blade__content-value']}>
						{personalInfo.fullName}
					</dd>

					<dt className={styles['c-personal-info-blade__content-label']}>
						{tText(
							'modules/navigation/components/personal-info-blade/personal-info-blade___email'
						)}
					</dt>
					<dd className={styles['c-personal-info-blade__content-value']}>
						{personalInfo.email}
					</dd>

					{personalInfo.organisation && (
						<>
							<dt className={styles['c-personal-info-blade__content-label']}>
								{tText(
									'modules/navigation/components/personal-info-blade/personal-info-blade___organisatie'
								)}
							</dt>
							<dd className={styles['c-personal-info-blade__content-value']}>
								{personalInfo.organisation}
							</dd>
						</>
					)}
				</dl>
			</div>
			<div className={styles['c-personal-info-blade__requester-capacity']}>
				<dl>
					{!personalInfo.organisation && (
						<>
							<dt className={styles['c-personal-info-blade__content-label']}>
								{tText(
									'modules/navigation/components/personal-info-blade/personal-info-blade___organisatie-optioneel'
								)}
							</dt>
							<dd className={styles['c-personal-info-blade__content-value']}>
								<TextInput
									value={organisationInputValue}
									onChange={(e) => setOrganisationInputValue(e.target.value)}
								/>
							</dd>
						</>
					)}
					<dt className={styles['c-personal-info-blade__content-label']}>
						{tText(
							'modules/navigation/components/personal-info-blade/personal-info-blade___hoedanigheid'
						)}
					</dt>
					<dd
						className={clsx(
							styles['c-personal-info-blade__content-value'],
							styles['c-personal-info-blade__radio-buttons-container']
						)}
					>
						<RadioButton
							className={styles['c-personal-info-blade__radio-button']}
							label={tText(
								'modules/navigation/components/personal-info-blade/personal-info-blade___requester-capacity-education'
							)}
							checked={typeSelected === MaterialRequestRequesterCapacity.EDUCATION}
							onClick={() =>
								setTypeSelected(MaterialRequestRequesterCapacity.EDUCATION)
							}
						/>
						<RadioButton
							className={styles['c-personal-info-blade__radio-button']}
							label={tText(
								'modules/navigation/components/personal-info-blade/personal-info-blade___requester-capacity-work'
							)}
							checked={typeSelected === MaterialRequestRequesterCapacity.WORK}
							onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.WORK)}
						/>
						<RadioButton
							className={styles['c-personal-info-blade__radio-button']}
							label={tText(
								'modules/navigation/components/personal-info-blade/personal-info-blade___requester-capacity-private-researcher'
							)}
							checked={
								typeSelected === MaterialRequestRequesterCapacity.PRIVATE_RESEARCH
							}
							onClick={() =>
								setTypeSelected(MaterialRequestRequesterCapacity.PRIVATE_RESEARCH)
							}
						/>
						<RadioButton
							className={styles['c-personal-info-blade__radio-button']}
							label={tText(
								'modules/navigation/components/personal-info-blade/personal-info-blade___requester-capacity-other'
							)}
							checked={typeSelected === MaterialRequestRequesterCapacity.OTHER}
							onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.OTHER)}
						/>
					</dd>
				</dl>
			</div>
		</Blade>
	);
};

export default PersonalInfoBlade;
