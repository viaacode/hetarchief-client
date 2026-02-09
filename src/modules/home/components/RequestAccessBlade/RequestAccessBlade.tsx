import { useGetNewsletterPreferences } from '@account/hooks/get-newsletter-preferences';
import { selectCommonUser } from '@auth/store/user';
import type {
	RequestAccessBladeProps,
	RequestAccessFormState,
} from '@home/components/RequestAccessBlade/RequestAccessBlade.types';
import { Checkbox, FormControl, TextArea } from '@meemoo/react-components';
import { Blade } from '@shared/components/Blade/Blade';
import type { BladeFooterProps } from '@shared/components/Blade/Blade.types';
import MaxLengthIndicator from '@shared/components/FormControl/MaxLengthIndicator';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SpacePreview } from '@shared/components/SpacePreview';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { useLocale } from '@shared/hooks/use-locale/use-locale';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';
import { REQUEST_ACCESS_FORM_SCHEMA } from './RequestAccessBlade.const';
import styles from './RequestAccessBlade.module.scss';

const labelKeys: Record<keyof RequestAccessFormState, string> = {
	acceptTerms: 'RequestAccessBlade__acceptTerms',
	requestReason: 'RequestAccessBlade__requestReason',
	visitTime: 'RequestAccessBlade__visitTime',
};

const RequestAccessBlade: FC<RequestAccessBladeProps> = ({ onSubmit, isOpen, ...bladeProps }) => {
	const commonUser = useSelector(selectCommonUser);
	const locale = useLocale();

	const [query] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});
	const { data: visitorSpace } = useGetVisitorSpace(
		query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] || null
	);
	const { data: preferences } = useGetNewsletterPreferences(commonUser?.email);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] = useState<boolean>(
		preferences?.newsletter || false
	);
	const [formValues, setFormValues] = useState<RequestAccessFormState>({
		acceptTerms: false,
		requestReason: '',
		visitTime: '',
	});
	const [errors, setFormErrors] = useState<Partial<Record<keyof RequestAccessFormState, string>>>(
		{}
	);

	const isError = !!(errors.acceptTerms || errors.requestReason || errors.visitTime);

	const reset = useCallback(() => {
		setFormValues({
			acceptTerms: false,
			requestReason: '',
			visitTime: '',
		});
		setFormErrors({});
	}, []);

	const setFormValue = (key: keyof RequestAccessFormState, value: string | boolean) => {
		setFormValues((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	const handleFormSubmit = async () => {
		setFormErrors({});
		const errors = await validateForm(formValues, REQUEST_ACCESS_FORM_SCHEMA());
		if (errors) {
			setFormErrors(errors);
			return;
		}
		setFormErrors({});
		setIsSubmitting(true);
		await onSubmit?.(formValues);
		if (isSubscribedToNewsletter) {
			CampaignMonitorService.setPreferences({
				preferences: {
					newsletter: isSubscribedToNewsletter,
				},
				language: locale,
			}).catch(() =>
				toastService.notify({
					title: tText(
						'modules/home/components/request-access-blade/request-access-blade___er-ging-iets-mis'
					),
					description: tText(
						'modules/home/components/request-access-blade/request-access-blade___het-inschrijven-op-de-nieuwsbrief-is-mislukt'
					),
				})
			);
		}
		setIsSubmitting(false);
	};

	useEffect(() => {
		isOpen && reset();
	}, [isOpen, reset]);

	const getFooterButtons = (): BladeFooterProps => {
		return [
			{
				label: tText(
					'modules/home/components/request-access-blade/request-access-blade___verstuur'
				),
				mobileLabel: tText(
					'modules/home/components/request-access-blade/request-access-blade___verstuur-mobiel'
				),
				type: 'primary',
				onClick: () => handleFormSubmit(),
				disabled: !isOpen || isSubmitting,
			},
			{
				label: tText(
					'modules/home/components/request-access-blade/request-access-blade___annuleer'
				),
				mobileLabel: tText(
					'modules/home/components/request-access-blade/request-access-blade___annuleer-mobiel'
				),
				type: 'secondary',
				onClick: bladeProps.onClose,
				disabled: !isOpen,
			},
		];
	};

	return (
		<Blade
			{...bladeProps}
			className={styles['c-request-access-blade']}
			footerButtons={getFooterButtons()}
			isOpen={isOpen}
			title={tText(
				'modules/home/components/request-access-blade/request-access-blade___vraag-toegang-aan'
			)}
			isBladeInvalid={isError}
		>
			{visitorSpace && <SpacePreview visitorSpace={visitorSpace} />}
			<FormControl
				errors={[
					<div className="u-flex" key={`form-error--request-reason`}>
						<RedFormWarning error={errors.requestReason} />
						<MaxLengthIndicator maxLength={300} value={formValues.requestReason} />
					</div>,
				]}
				id={labelKeys.requestReason}
				label={tHtml(
					'modules/home/components/request-access-blade/request-access-blade___reden-van-aanvraag'
				)}
			>
				<TextArea
					value={formValues.requestReason}
					onChange={(evt) => setFormValue('requestReason', evt.target.value)}
					id={labelKeys.requestReason}
					maxLength={300}
					disabled={!isOpen}
				/>
			</FormControl>

			<FormControl
				errors={[
					<div className="u-flex" key={`form-error--visit-time`}>
						<RedFormWarning error={errors.visitTime} />
						<MaxLengthIndicator maxLength={300} value={formValues.visitTime} />
					</div>,
				]}
				id={labelKeys.visitTime}
				label={tHtml(
					'modules/home/components/request-access-blade/request-access-blade___wanneer-wil-je-de-bezoekersruimte-bezoeken'
				)}
			>
				<TextArea
					value={formValues.visitTime}
					onChange={(evt) => setFormValue('visitTime', evt.target.value)}
					id={labelKeys.visitTime}
					maxLength={300}
					disabled={!isOpen}
				/>
			</FormControl>

			{!(preferences?.newsletter ?? true) ? (
				<Checkbox
					className={styles['c-request-access-blade__checkbox']}
					checkIcon={<Icon name={IconNamesLight.Check} />}
					checked={isSubscribedToNewsletter}
					label={tHtml(
						'modules/home/components/request-access-blade/request-access-blade___schrijf-je-in-voor-de-nieuwsbrief'
					)}
					onClick={() => setIsSubscribedToNewsletter((prevState) => !prevState)}
				/>
			) : null}

			<FormControl
				errors={[<RedFormWarning error={errors.acceptTerms} key={`form-error--accept-terms`} />]}
				id={labelKeys.acceptTerms}
			>
				<Checkbox
					checked={formValues.acceptTerms}
					checkIcon={<Icon name={IconNamesLight.Check} />}
					disabled={!isOpen}
					id={labelKeys.acceptTerms}
					label={tHtml(
						'modules/home/components/request-access-blade/request-access-blade___ik-verklaar-deze-toegang-aan-te-vragen-met-het-oog-op-onderzoeksdoeleinden-of-prive-studie'
					)}
					value="accept-terms"
					onChange={(evt) => setFormValue('acceptTerms', evt.target.checked)}
				/>
			</FormControl>
		</Blade>
	);
};

export default RequestAccessBlade;
