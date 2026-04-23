import { useGetNewsletterPreferences } from '@account/hooks/get-newsletter-preferences';
import { selectCommonUser } from '@auth/store/user';
import { MaterialRequestsService } from '@material-requests/services';
import { MaterialRequestRequesterCapacity } from '@material-requests/types';
import {
	Checkbox,
	FormControl,
	RadioButton,
	TextInput,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@meemoo/react-components';
import type { BladeFooterButtonProps } from '@shared/components/Blade/Blade.types';
import { BladeContent } from '@shared/components/Blade/BladeContent';
import MaxLengthIndicator from '@shared/components/FormControl/MaxLengthIndicator';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { tHtml, tText } from '@shared/helpers/translate';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import { getLocalisedOptions } from '@shared/utils/dates';
import { useIsComplexReuseFlowUser } from '@visitor-space/hooks/is-complex-reuse-flow';
import clsx from 'clsx';
import { format } from 'date-fns';
import { noop } from 'lodash-es';
import React, { type FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './PersonalInfo.module.scss';
import type { PersonalInfoFormState, PersonalInfoProps } from './PersonalInfo.types';

const PersonalInfo: FC<PersonalInfoProps> = ({
	mostRecentMaterialRequestName,
	hasRequests,
	onCancel,
	onSuccess,
}) => {
	const commonUser = useSelector(selectCommonUser);
	const locale = useLocale();
	const isComplexReuseFlow = useIsComplexReuseFlowUser(commonUser);

	const { data: preferences } = useGetNewsletterPreferences(commonUser?.email);
	const shouldRenderNewsletterCheckbox: boolean = !preferences?.newsletter;
	const MAX_NAME_LENGTH = 40;

	const [requestGroupName, setRequestGroupName] = useState('');
	const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] = useState<boolean>(
		preferences?.newsletter || false
	);
	const [organisationInputValue, setOrganisationInputValue] = useState<string>(
		commonUser?.organisation?.name || ''
	);
	const [typeSelected, setTypeSelected] = useState<MaterialRequestRequesterCapacity | undefined>(
		isComplexReuseFlow ? MaterialRequestRequesterCapacity.WORK : undefined
	);
	const [isFormValid, setIsFormValid] = useState(true);
	const [errors, setFormErrors] = useState<Partial<Record<keyof PersonalInfoFormState, string>>>(
		{}
	);

	useEffect(() => {
		const formattedDate = format(new Date(), 'MM-yyyy', { ...getLocalisedOptions() });

		setRequestGroupName(
			`${mostRecentMaterialRequestName.substring(0, MAX_NAME_LENGTH - formattedDate.length - 1)} ${formattedDate}`
		);
	}, [mostRecentMaterialRequestName]);

	const validateForm = () => {
		setIsFormValid(true);
		const errors = {
			hasRequests: !hasRequests
				? tText(
						'modules/account/components/personal-info/personal-info___er-zijn-geen-aanvragen-te-vervolledigen'
					)
				: undefined,
			requesterCapacity: !typeSelected
				? tText(
						'modules/account/components/personal-info/personal-info___de-hoedanigheid-is-verplicht'
					)
				: undefined,
			requestGroupName:
				isComplexReuseFlow && requestGroupName.length === 0
					? tText(
							'modules/account/components/personal-info/personal-info___de-aanvraag-naam-is-verplicht'
						)
					: undefined,
		};

		setFormErrors(errors);
		const isInvalid =
			!!errors.hasRequests || !!errors.requesterCapacity || !!errors.requestGroupName;

		setTimeout(() => {
			setIsFormValid(!isInvalid);
		});

		return !isInvalid;
	};

	const onSendRequests = async () => {
		try {
			const formValid = validateForm();

			if (!formValid) {
				return;
			}

			await MaterialRequestsService.sendAll({
				type: typeSelected as MaterialRequestRequesterCapacity,
				organisation: organisationInputValue,
				requestGroupName,
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
			console.error({
				message: 'Failed to material requests',
				innerException: err,
				additionalInfo: {
					typeSelected,
					organisationInputValue,
					requestGroupName,
					isSubscribedToNewsletter,
					preferences,
					locale,
				},
			});
			onFailedRequest();
		}
	};

	const renderNewsletterCheckbox = () => {
		if (!shouldRenderNewsletterCheckbox) {
			return null;
		}
		return (
			<div className={clsx(styles['c-personal-info__content-group'])}>
				<Checkbox
					className={styles['c-personal-info__checkbox']}
					checked={isSubscribedToNewsletter}
					label={tHtml(
						'modules/account/components/personal-info/personal-info___ik-wens-me-in-te-schrijven-voor-de-nieuwsbrief'
					)}
					onClick={() => setIsSubscribedToNewsletter((prevState) => !prevState)}
				/>
			</div>
		);
	};

	const onFailedRequest = () => {
		setIsSubscribedToNewsletter(false);
		toastService.notify({
			maxLines: 3,
			title: tText('modules/account/components/personal-info/personal-info___er-ging-iets-mis'),
			description: tText(
				'modules/account/components/personal-info/personal-info___er-ging-iets-mis-tijdens-het-versturen'
			),
		});
	};

	const renderNameEntry = () => (
		<FormControl
			errors={[
				<div className="u-flex" key={`form-error--request-group-name`}>
					<RedFormWarning error={errors.requestGroupName} />
					<MaxLengthIndicator maxLength={MAX_NAME_LENGTH} value={requestGroupName} />
				</div>,
			]}
			id="PersonalInfoBladeContent__requestGroupName"
			className={clsx(styles['c-personal-info__content-group'])}
			label={tHtml('modules/account/components/personal-info/personal-info___naam-aanvraag')}
		>
			<p className={clsx(styles['c-personal-info__content-group-value'])}>
				{tText(
					'modules/account/components/personal-info/personal-info___door-je-aanvraag-een-naam-te-geven-behoud-je-het-overzicht-van-de-objecten-die-samen-in-een-aanvraag-uitgevoerd-werden'
				)}
			</p>
			<Tooltip position="left">
				<TooltipTrigger>
					<TextInput
						id="personal-info__material-request-group-name"
						maxLength={MAX_NAME_LENGTH}
						value={requestGroupName}
						onChange={(e) => setRequestGroupName(e.target.value)}
						ariaLabel={tText(
							'modules/account/components/personal-info/personal-info___aanvraag-groeperingsnaam-input-aria-label'
						)}
					/>
				</TooltipTrigger>
				<TooltipContent>
					{tText(
						'modules/account/components/personal-info/personal-info___met-deze-naam-groepeer-je-al-je-huidige-aanvragen-in-je-lijst-dit-is-handig-om-later-het-overzicht-te-behouden'
					)}
				</TooltipContent>
			</Tooltip>
		</FormControl>
	);

	const renderCapacity = () => (
		<FormControl
			label={tText('modules/account/components/personal-info/personal-info___jouw-rol')}
			errors={[
				<RedFormWarning error={errors.requesterCapacity} key={`form-error--requester-capacity`} />,
			]}
			className={clsx(styles['c-personal-info__content-group'])}
		>
			<div className={clsx(styles['c-personal-info__content-group-radio-button-group'])}>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText(
						'modules/account/components/personal-info/personal-info___requester-capacity-education'
					)}
					checked={typeSelected === MaterialRequestRequesterCapacity.EDUCATION}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.EDUCATION)}
				/>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText(
						'modules/account/components/personal-info/personal-info___requester-capacity-work'
					)}
					checked={typeSelected === MaterialRequestRequesterCapacity.WORK}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.WORK)}
				/>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText(
						'modules/account/components/personal-info/personal-info___requester-capacity-private-researcher'
					)}
					checked={typeSelected === MaterialRequestRequesterCapacity.PRIVATE_RESEARCH}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.PRIVATE_RESEARCH)}
				/>
				<RadioButton
					className={styles['c-personal-info__content-group-radio-button']}
					label={tText(
						'modules/account/components/personal-info/personal-info___requester-capacity-other'
					)}
					checked={typeSelected === MaterialRequestRequesterCapacity.OTHER}
					onClick={() => setTypeSelected(MaterialRequestRequesterCapacity.OTHER)}
				/>
			</div>
		</FormControl>
	);

	const getFooterButtons = (): BladeFooterButtonProps => {
		return [
			{
				label: tText('modules/account/components/personal-info/personal-info___verstuur-aanvraag'),
				mobileLabel: tText(
					'modules/account/components/personal-info/personal-info___verstuur-aanvraag-mobiel'
				),
				type: 'primary',
				onClick: onSendRequests,
			},
			{
				label: tText('modules/account/components/personal-info/personal-info___keer-terug'),
				mobileLabel: tText(
					'modules/account/components/personal-info/personal-info___keer-terug-mobiel'
				),
				type: 'secondary',
				onClick: onCancel,
			},
		];
	};

	const renderStickySubtitle = () => {
		return (
			<div className={styles['c-personal-info__terms-agreement']}>
				<a
					href={
						commonUser?.isKeyUser
							? tText(
									'Ik nam kennis en ga akkoord met de Aanvullende gebruiksvoorwaarden bij aanvragen - hyperlink - sleutelgebruiker'
								)
							: tText(
									'Ik nam kennis en ga akkoord met de Aanvullende gebruiksvoorwaarden bij aanvragen - hyperlink'
								)
					}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={tText(
						'Ik nam kennis en ga akkoord met de Aanvullende gebruiksvoorwaarden bij aanvragen - aria label'
					)}
				>
					{tText(
						'Ik nam kennis en ga akkoord met de Aanvullende gebruiksvoorwaarden bij aanvragen'
					)}
				</a>
				<Icon className="u-ml-8" name={IconNamesLight.Extern} />
			</div>
		);
	};

	return (
		<BladeContent
			id="personal-info-blade-content"
			className={styles['c-personal-info']}
			isBladeInvalid={!isFormValid}
			closable={false}
			title={tText('modules/account/components/personal-info/personal-info___details')}
			stickySubtitle={renderStickySubtitle()}
			footerButtons={getFooterButtons()}
		>
			<div className={styles['c-personal-info__content-group']}>
				<strong>
					{tHtml('modules/account/components/personal-info/personal-info___over-jou')}
				</strong>
				<p>
					<div className={clsx(styles['c-personal-info__content-group-subtitle'])}>
						{commonUser?.fullName}
					</div>
					<div className={clsx(styles['c-personal-info__content-group-value'])}>
						{commonUser?.email}
					</div>
				</p>
			</div>
			<div className={styles['c-personal-info__content-group']}>
				<strong>
					{tHtml('modules/account/components/personal-info/personal-info___jouw-organisatie')}
				</strong>
				<p>
					<div className={clsx(styles['c-personal-info__content-group-subtitle'])}>
						{commonUser?.organisation?.name ? (
							<>
								{commonUser.organisation?.name}
								<div className={styles['c-personal-info__edit-user-data']}>
									<a
										href={tText(
											'modules/account/components/personal-info/personal-info___aanpassing-van-jouw-gegevens-aanvragen-hyperlink'
										)}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={tText(
											'modules/account/components/personal-info/personal-info___bewerk-je-gegevens-button-aria-label'
										)}
									>
										{tText(
											'modules/account/components/personal-info/personal-info___aanpassing-van-jouw-gegevens-aanvragen-label'
										)}
									</a>
									<Icon className="u-ml-8" name={IconNamesLight.Extern} />
								</div>
							</>
						) : (
							<TextInput
								id="personal-info__organisation-input"
								value={organisationInputValue}
								onChange={(e) => setOrganisationInputValue(e.target.value)}
								autoComplete="organization"
								ariaLabel={tText(
									'modules/account/components/personal-info/personal-info___organisatie-naam-input-aria-label'
								)}
							/>
						)}
					</div>
					{commonUser?.organisation?.data?.sector && (
						<div className={clsx(styles['c-personal-info__content-group-value'])}>
							{commonUser?.organisation?.data?.sector}
						</div>
					)}
				</p>
			</div>
			{hasRequests ? (
				<>
					{isComplexReuseFlow ? renderNameEntry() : renderCapacity()}
					{renderNewsletterCheckbox()}
				</>
			) : (
				errors.hasRequests && (
					<FormControl
						errors={[
							<RedFormWarning error={errors.hasRequests} key={`form-error--has-requests`} />,
						]}
					></FormControl>
				)
			)}
		</BladeContent>
	);
};

export default PersonalInfo;
