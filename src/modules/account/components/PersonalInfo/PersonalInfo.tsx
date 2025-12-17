import MaterialRequestTermAgreementBlade from '@account/components/MaterialRequestTermAgreementBlade/MaterialRequestTermAgreementBlade';
import { useGetNewsletterPreferences } from '@account/hooks/get-newsletter-preferences';
import { selectUser } from '@auth/store/user';
import { MaterialRequestsService } from '@material-requests/services';
import { MaterialRequestRequesterCapacity } from '@material-requests/types';
import {
	Button,
	Checkbox,
	RadioButton,
	TextInput,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@meemoo/react-components';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { useIsKeyUser } from '@shared/hooks/is-key-user';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { useSize } from '@shared/hooks/use-size';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import { getLocalisedOptions } from '@shared/utils/dates';
import clsx from 'clsx';
import { format } from 'date-fns';
import { noop } from 'lodash-es';
import React, { type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './PersonalInfo.module.scss';
import type { PersonalInfoProps } from './PersonalInfo.types';

const PersonalInfo: FC<PersonalInfoProps> = ({
	mostRecentMaterialRequestName,
	hasRequests,
	onCancel,
	onSuccess,
}) => {
	const user = useSelector(selectUser);
	const isKeyUser = useIsKeyUser();
	const locale = useLocale();

	const { data: preferences } = useGetNewsletterPreferences(user?.email);
	const shouldRenderNewsletterCheckbox: boolean = !preferences?.newsletter;
	// TODO: https://meemoo.atlassian.net/browse/ARC-3226 - fix url for zendesk
	const editUserDataHyperlink = '';
	const maxNameLength = 40;

	const [requestName, setRequestName] = useState('');
	const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] = useState<boolean>(
		preferences?.newsletter || false
	);
	const [organisationInputValue, setOrganisationInputValue] = useState<string>(
		user?.organisationName || ''
	);
	const [typeSelected, setTypeSelected] = useState<MaterialRequestRequesterCapacity | undefined>(
		isKeyUser ? MaterialRequestRequesterCapacity.WORK : undefined
	);
	const [validationError, setValidationError] = useState('');
	const [contentIsScrollable, setContentIsScrollable] = useState(false);
	const [agreedToTerms, setAgreedToTerms] = useState(false);
	const [showTermAgreement, setShowTermAgreement] = useState(false);

	// Keep track of the reference strip size and update the bottom border if needed
	const contentRef = useRef<HTMLDivElement>(null);
	useSize(contentRef, (referenceStripContainer) => checkContentSize(referenceStripContainer));

	useEffect(() => {
		const formattedDate = format(new Date(), 'MM-yyyy', { ...getLocalisedOptions() });

		setRequestName(
			`${mostRecentMaterialRequestName.substring(0, maxNameLength - formattedDate.length - 1)} ${formattedDate}`
		);
	}, [mostRecentMaterialRequestName]);

	const checkContentSize = useCallback((referenceStripElement: HTMLElement) => {
		if (!referenceStripElement) {
			return;
		}
		const scrollHeight = referenceStripElement.scrollHeight;
		const height = referenceStripElement.clientHeight;

		setContentIsScrollable(scrollHeight > height);
	}, []);

	const onSendRequests = async () => {
		try {
			if (!hasRequests) {
				setValidationError(tText('Er zijn geen aanvragen te vervolledigen'));
				return;
			}

			if (!typeSelected) {
				setValidationError(tText('De hoedanigheid is verplicht'));
				return;
			}

			if (isKeyUser) {
				if (requestName.length === 0) {
					setValidationError(tText('De aanvraag naam is verplicht'));
					return;
				}

				if (!agreedToTerms) {
					setValidationError(tText('Keur de aanvullende gebruiksvoorwaarden bij aanvragen goed.'));
					return;
				}
			}

			setValidationError('');
			await MaterialRequestsService.sendAll({
				type: typeSelected,
				organisation: organisationInputValue,
				//requestName: requestName,
			});

			// Only subscribe to newsletter if the user is not already subscribed and indicated that he wants to be subscribed
			if (isSubscribedToNewsletter && !preferences?.newsletter) {
				// Do not wait for this call, since it takes to long and the user does not need to wait for this
				CampaignMonitorService.setPreferences({
					preferences: {
						newsletter: isSubscribedToNewsletter,
					},
					language: locale,
				}).then(noop);
			}
			onSuccess();
		} catch (err) {
			console.error({ err });
			onFailedRequest();
		}
	};

	const renderAgreeTermsCheckbox = () => {
		if (!isKeyUser) {
			return null;
		}
		return (
			<Checkbox
				className={styles['c-personal-info__checkbox']}
				checked={agreedToTerms}
				label={
					<>
						{tText('Ik nam kennis en ga akkoord met de')}{' '}
						{/** biome-ignore lint/a11y/noStaticElementInteractions: We need hyperlink behavior in the label*/}
						{/** biome-ignore lint/a11y/useKeyWithClickEvents: We need hyperlink behavior in the label */}
						<span
							onClick={(event) => {
								event.preventDefault();
								setShowTermAgreement(true);
							}}
							className={clsx(styles['c-personal-info__checkbox-hyperlink'])}
						>
							{tText('Aanvullende gebruiksvoorwaarden bij aanvragen')}
						</span>
					</>
				}
				onClick={() => setAgreedToTerms((prevState) => !prevState)}
			/>
		);
	};

	const renderNewsletterCheckbox = () => {
		if (!shouldRenderNewsletterCheckbox) {
			return null;
		}
		return (
			<Checkbox
				className={styles['c-personal-info__checkbox']}
				checked={isSubscribedToNewsletter}
				label={tHtml('Ik wens me in te schrijven voor de nieuwsbrief')}
				onClick={() => setIsSubscribedToNewsletter((prevState) => !prevState)}
			/>
		);
	};

	const renderCheckboxes = () => {
		const agreedToTermsCheckbox = renderAgreeTermsCheckbox();
		const newsletterCheckbox = renderNewsletterCheckbox();

		if (agreedToTermsCheckbox || newsletterCheckbox) {
			return (
				<div className={clsx(styles['c-personal-info__content-group'])}>
					{agreedToTermsCheckbox}
					{newsletterCheckbox}
				</div>
			);
		}

		return null;
	};

	const onFailedRequest = () => {
		setAgreedToTerms(false);
		setIsSubscribedToNewsletter(false);
		toastService.notify({
			maxLines: 3,
			title: tText('er-ging-iets-mis'),
			description: tText('er-ging-iets-mis-tijdens-het-versturen'),
		});
	};

	const renderFooter = () => {
		return (
			<div
				className={clsx(styles['c-personal-info__footer'], contentIsScrollable && 'u-bg-platinum')}
			>
				{validationError ? (
					<RedFormWarning
						className={clsx(styles['c-personal-info__footer-error'])}
						error={validationError}
					/>
				) : null}

				<Button
					label={tText('Verstuur aanvraag')}
					variants={['block', 'text', 'dark']}
					onClick={onSendRequests}
				/>
				<Button
					label={tText('Keer terug')}
					variants={['block', 'text', 'light']}
					onClick={onCancel}
				/>
			</div>
		);
	};

	const renderNameEntry = () => (
		<div className={styles['c-personal-info__content-group']}>
			<div className={clsx(styles['c-personal-info__content-group-semi-title'])}>
				{tText('Naam aanvraag')}
			</div>
			<div className={clsx(styles['c-personal-info__content-group-value'])}>
				{tText(
					'Door je aanvraag een naam te geven behoud je het overzicht van de objecten die samen in één aanvraag uitgevoerd werden.'
				)}
			</div>
			<Tooltip position="left">
				<TooltipTrigger>
					<TextInput
						maxLength={maxNameLength}
						value={requestName}
						onChange={(e) => setRequestName(e.target.value)}
					/>
				</TooltipTrigger>
				<TooltipContent>
					{tText(
						'Met deze naam groepeer je al je huidige aanvragen in je lijst. Dit is handig om later het overzicht te behouden.'
					)}
				</TooltipContent>
			</Tooltip>

			<span
				className={clsx(
					styles['c-personal-info__content-group-value'],
					styles['c-personal-info__content-group-value-length']
				)}
			>
				{requestName.length || 0} / {maxNameLength}
			</span>
		</div>
	);

	const renderCapacity = () => (
		<div className={styles['c-personal-info__content-group']}>
			<div className={clsx(styles['c-personal-info__content-group-title'])}>
				{tText('Jouw rol')}
			</div>
			<div className={clsx(styles['c-personal-info__content-group-radio-button-group'])}>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText('requester-capacity-education')}
					checked={typeSelected === MaterialRequestRequesterCapacity.EDUCATION}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.EDUCATION)}
				/>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText('requester-capacity-work')}
					checked={typeSelected === MaterialRequestRequesterCapacity.WORK}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.WORK)}
				/>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText('requester-capacity-private-researcher')}
					checked={typeSelected === MaterialRequestRequesterCapacity.PRIVATE_RESEARCH}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.PRIVATE_RESEARCH)}
				/>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText('requester-capacity-other')}
					checked={typeSelected === MaterialRequestRequesterCapacity.OTHER}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.OTHER)}
				/>
			</div>
		</div>
	);

	return (
		<div className={styles['c-personal-info']}>
			<div
				className={clsx(styles['c-personal-info__header'], contentIsScrollable && 'u-bg-platinum')}
			>
				<div className={styles['c-personal-info__title']}>{tText('Details')}</div>
				<div className={styles['c-personal-info__edit-user-data']}>
					<a href={editUserDataHyperlink} target="_blank" rel="noopener noreferrer">
						{tText('Aanpassing van jouw gegevens aanvragen')}
					</a>
					<Icon className="u-ml-8" name={IconNamesLight.Extern} />
				</div>
			</div>
			<div ref={contentRef} className={styles['c-personal-info__content']}>
				<div className={styles['c-personal-info__content-group']}>
					<div className={clsx(styles['c-personal-info__content-group-title'])}>
						{tText('Over jou')}
					</div>
					<div className={clsx(styles['c-personal-info__content-group-subtitle'])}>
						{user?.fullName}
					</div>
					<div className={clsx(styles['c-personal-info__content-group-value'])}>{user?.email}</div>
				</div>

				<div className={styles['c-personal-info__content-group']}>
					<div className={clsx(styles['c-personal-info__content-group-title'])}>
						{tText('Jouw organisatie')}
					</div>
					<div className={clsx(styles['c-personal-info__content-group-subtitle'])}>
						{user?.organisationName ? (
							user.organisationName
						) : (
							<TextInput
								value={organisationInputValue}
								onChange={(e) => setOrganisationInputValue(e.target.value)}
								autoComplete="organization"
							/>
						)}
					</div>
				</div>
				{isKeyUser ? renderNameEntry() : renderCapacity()}
				{renderCheckboxes()}
			</div>
			{renderFooter()}
			<MaterialRequestTermAgreementBlade
				isOpen={showTermAgreement}
				onClose={(agreed) => {
					setShowTermAgreement(false);
					setAgreedToTerms(agreed);
				}}
			/>
		</div>
	);
};

export default PersonalInfo;
