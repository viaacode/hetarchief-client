import { Button, Checkbox, TextArea } from '@meemoo/react-components';
import { type FC, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { useGetNewsletterPreferences } from '@account/hooks/get-newsletter-preferences';
import { selectCommonUser } from '@auth/store/user';
import type {
	RequestAccessBladeProps,
	RequestAccessFormState,
} from '@home/components/RequestAccessBlade/RequestAccessBlade.types';
import { Blade } from '@shared/components/Blade/Blade';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SpacePreview } from '@shared/components/SpacePreview';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
import { validateForm } from '@shared/helpers/validate-form';
import { CampaignMonitorService } from '@shared/services/campaign-monitor-service';
import { toastService } from '@shared/services/toast-service';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

import { REQUEST_ACCESS_FORM_SCHEMA } from './RequestAccessBlade.const';
import styles from './RequestAccessBlade.module.scss';

const labelKeys: Record<keyof RequestAccessFormState, string> = {
	acceptTerms: 'RequestAccessBlade__acceptTerms',
	requestReason: 'RequestAccessBlade__requestReason',
	visitTime: 'RequestAccessBlade__visitTime',
};

const RequestAccessBlade: FC<RequestAccessBladeProps> = ({ onSubmit, isOpen, ...bladeProps }) => {
	const commonUser = useSelector(selectCommonUser);

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

	const renderFooter = () => {
		return (
			<div className="u-px-16 u-py-16 u-px-32-md u-py-24-md u-flex u-flex-col u-gap-xs">
				{!(preferences?.newsletter || false) ? (
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
				<RedFormWarning error={errors.acceptTerms} />

				{isError && (
					<RedFormWarning
						error={tHtml(
							'modules/home/components/request-access-blade/request-access-blade___error'
						)}
					/>
				)}

				<Button
					className="u-mb-8 u-mb-16-md"
					label={tHtml(
						'modules/home/components/request-access-blade/request-access-blade___verstuur'
					)}
					variants={['block', 'black']}
					onClick={() => handleFormSubmit()}
					disabled={!isOpen || isSubmitting}
				/>

				<Button
					label={tHtml(
						'modules/home/components/request-access-blade/request-access-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={bladeProps.onClose}
					disabled={!isOpen}
				/>
			</div>
		);
	};

	return (
		<Blade
			{...bladeProps}
			className={styles['c-request-access-blade']}
			footer={renderFooter()}
			isOpen={isOpen}
			renderTitle={(props: Pick<HTMLElement, 'id' | 'className'>) => (
				<h2 {...props}>
					{tHtml(
						'modules/home/components/request-access-blade/request-access-blade___vraag-toegang-aan'
					)}
				</h2>
			)}
		>
			<div className="u-px-16 u-px-32-md">
				{visitorSpace && <SpacePreview visitorSpace={visitorSpace} />}

				<label className="u-mb-8 u-display-block" htmlFor={labelKeys.requestReason}>
					{tHtml(
						'modules/home/components/request-access-blade/request-access-blade___reden-van-aanvraag'
					)}
				</label>
				<TextArea
					value={formValues.requestReason}
					onChange={(evt) => setFormValue('requestReason', evt.target.value)}
					id={labelKeys.requestReason}
					disabled={!isOpen}
				/>
				<RedFormWarning
					error={errors.requestReason}
					key="form-error--request-reason"
					className="u-mt-8"
				/>

				<label className="u-mb-8 u-display-block u-mt-24" htmlFor={labelKeys.visitTime}>
					{tHtml(
						'modules/home/components/request-access-blade/request-access-blade___wanneer-wil-je-de-bezoekersruimte-bezoeken'
					)}
				</label>
				<TextArea
					value={formValues.visitTime}
					onChange={(evt) => setFormValue('visitTime', evt.target.value)}
					id={labelKeys.visitTime}
					disabled={!isOpen}
				/>
			</div>
		</Blade>
	);
};

export default RequestAccessBlade;
