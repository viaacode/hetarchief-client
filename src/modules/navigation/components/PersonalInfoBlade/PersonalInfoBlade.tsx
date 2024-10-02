import { Button, Checkbox, RadioButton, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { noop } from 'lodash-es';
import React, { type FC, useState } from 'react';
import { useSelector } from 'react-redux';

import { useGetNewsletterPreferences } from '@account/hooks/get-newsletter-preferences';
import { selectUser } from '@auth/store/user';
import { MaterialRequestsService } from '@material-requests/services';
import { MaterialRequestRequesterCapacity } from '@material-requests/types';
import { Blade } from '@shared/components/Blade/Blade';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { renderMobileDesktop } from '@shared/helpers/renderMobileDesktop';
import { tHtml, tText } from '@shared/helpers/translate';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import { useAppDispatch } from '@shared/store';
import { setShowMaterialRequestCenter } from '@shared/store/ui';

import { type PersonalInfoBladeBladeProps } from './PersonalInfo.types';
import styles from './PersonalInfoBlade.module.scss';

const PersonalInfoBlade: FC<PersonalInfoBladeBladeProps> = ({
	isOpen,
	onClose,
	personalInfo,
	layer,
	currentLayer,
	refetch,
}) => {
	const user = useSelector(selectUser);
	const dispatch = useAppDispatch();
	const { data: preferences } = useGetNewsletterPreferences(user?.email);
	const shouldRenderNewsletterCheckbox: boolean = !preferences?.newsletter;

	const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] = useState<boolean>(
		preferences?.newsletter || false
	);
	const [typeSelected, setTypeSelected] = useState<MaterialRequestRequesterCapacity | undefined>(
		personalInfo.requesterCapacity
	);
	const [organisationInputValue, setOrganisationInputValue] = useState<string>(
		personalInfo.organisation || ''
	);
	const [noTypeSelectedOnSave, setNoTypeSelectedOnSave] = useState(false);

	const handleClose = () => {
		setNoTypeSelectedOnSave(false);
		onClose();
	};

	const onSendRequests = async () => {
		try {
			if (!typeSelected) {
				setNoTypeSelectedOnSave(true);
				return;
			} else {
				setNoTypeSelectedOnSave(false);
			}
			await MaterialRequestsService.sendAll({
				type: typeSelected,
				organisation: organisationInputValue,
			});

			// Only subscribe to newsletter if the user is not already subscribed and indicated that he wants to be subscribed
			if (isSubscribedToNewsletter && !preferences?.newsletter) {
				// Do not wait for this call, since it takes to long and the user does not need to wait for this
				CampaignMonitorService.setPreferences({
					preferences: {
						newsletter: isSubscribedToNewsletter,
					},
				}).then(noop);
			}

			toastService.notify({
				maxLines: 3,
				title: tText(
					'modules/navigation/components/personal-info-blade/personal-info-blade___verzenden-succes'
				),
				description: tText(
					'modules/navigation/components/personal-info-blade/personal-info-blade___requests-zijn-verzonden'
				),
			});
			refetch();
			handleClose();
			dispatch(setShowMaterialRequestCenter(false));
		} catch (err) {
			console.error({ err });
			onFailedRequest();
		}
	};

	const renderCheckbox = () => {
		if (!shouldRenderNewsletterCheckbox) {
			return null;
		}
		return (
			<Checkbox
				className={styles['c-personal-info-blade__checkbox']}
				checked={isSubscribedToNewsletter}
				label={tHtml(
					'modules/navigation/components/personal-info-blade/personal-info-blade___schrijf-je-in-voor-de-nieuwsbrief'
				)}
				onClick={() => setIsSubscribedToNewsletter((prevState) => !prevState)}
			/>
		);
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
				{renderMobileDesktop({
					mobile: (
						<>
							{renderCheckbox()}
							<Button
								label={tText(
									'modules/navigation/components/personal-info-blade/personal-info-blade___verstuur-mobile'
								)}
								variants={['block', 'text', 'dark']}
								onClick={onSendRequests}
								className={styles['c-personal-info-blade__send-button']}
							/>
						</>
					),
					desktop: (
						<>
							{renderCheckbox()}
							<Button
								label={tText(
									'modules/navigation/components/personal-info-blade/personal-info-blade___verstuur'
								)}
								variants={['block', 'text', 'dark']}
								onClick={onSendRequests}
								className={styles['c-personal-info-blade__send-button']}
							/>
						</>
					),
				})}

				<Button
					label={tText(
						'modules/navigation/components/personal-info-blade/personal-info-blade___annuleer'
					)}
					variants={['block', 'text', 'light']}
					onClick={handleClose}
				/>
			</div>
		);
	};

	return (
		<Blade
			className={styles['c-personal-info-blade']}
			isOpen={isOpen}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2 {...props}>
					{tText(
						'modules/navigation/components/personal-info-blade/personal-info-blade___persoonlijke-gegevens'
					)}
				</h2>
			)}
			footer={isOpen && renderFooter()}
			onClose={handleClose}
			showBackButton
			layer={layer}
			currentLayer={currentLayer}
			isManaged
			id="personal-info-blade"
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
				{noTypeSelectedOnSave ? (
					<RedFormWarning error={tText('De hoedanigheid is verplicht')} />
				) : null}
			</div>
		</Blade>
	);
};

export default PersonalInfoBlade;
