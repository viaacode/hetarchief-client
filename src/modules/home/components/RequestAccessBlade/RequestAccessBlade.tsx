import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import { type FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { StringParam, useQueryParams } from 'use-query-params';

import { useGetNewsletterPreferences } from '@account/hooks/get-newsletter-preferences';
import { selectUser } from '@auth/store/user';
import {
	type RequestAccessBladeProps,
	type RequestAccessFormState,
} from '@home/components/RequestAccessBlade/RequestAccessBlade.types';
import { Blade } from '@shared/components/Blade/Blade';
import { Icon } from '@shared/components/Icon';
import { IconNamesLight } from '@shared/components/Icon/Icon.enums';
import { RedFormWarning } from '@shared/components/RedFormWarning/RedFormWarning';
import { SpacePreview } from '@shared/components/SpacePreview';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import { tHtml, tText } from '@shared/helpers/translate';
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
	const user = useSelector(selectUser);

	const [query] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});
	const { data: visitorSpace } = useGetVisitorSpace(
		query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] || null
	);
	const { data: preferences } = useGetNewsletterPreferences(user?.email);

	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const [isSubscribedToNewsletter, setIsSubscribedToNewsletter] = useState<boolean>(
		preferences?.newsletter || false
	);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<RequestAccessFormState>({
		resolver: yupResolver(REQUEST_ACCESS_FORM_SCHEMA()),
	});

	const isError = !!(errors.acceptTerms || errors.requestReason || errors.visitTime);

	const onFormSubmit = async (values: RequestAccessFormState) => {
		setIsSubmitting(true);
		await onSubmit?.(values);
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
			<div className="u-px-16 u-py-16 u-px-32-md u-py-24-md">
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
				<FormControl
					className="u-mx-8 u-mb-24"
					id={labelKeys.acceptTerms}
					errors={[
						<RedFormWarning
							error={errors.acceptTerms?.message}
							key="form-error--accept-terms"
						/>,
					]}
				>
					<Controller
						name="acceptTerms"
						control={control}
						render={({ field }) => (
							<Checkbox
								{...field}
								checked={field.value}
								checkIcon={<Icon name={IconNamesLight.Check} />}
								disabled={!isOpen}
								id={labelKeys.acceptTerms}
								label={tHtml(
									'modules/home/components/request-access-blade/request-access-blade___ik-verklaar-deze-toegang-aan-te-vragen-met-het-oog-op-onderzoeksdoeleinden-of-prive-studie'
								)}
								value="accept-terms"
							/>
						)}
					/>
				</FormControl>

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
					onClick={handleSubmit(onFormSubmit)}
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

				<FormControl
					className="u-mb-24"
					errors={[
						<RedFormWarning
							error={errors.acceptTerms?.message}
							key="form-error--accept-terms"
						/>,
					]}
					id={labelKeys.requestReason}
					label={tHtml(
						'modules/home/components/request-access-blade/request-access-blade___reden-van-aanvraag'
					)}
				>
					<Controller
						name="requestReason"
						control={control}
						render={({ field }) => (
							<TextArea {...field} id={labelKeys.requestReason} disabled={!isOpen} />
						)}
					/>
				</FormControl>

				<FormControl
					id={labelKeys.visitTime}
					label={tHtml(
						'modules/home/components/request-access-blade/request-access-blade___wanneer-wil-je-de-bezoekersruimte-bezoeken'
					)}
				>
					<Controller
						name="visitTime"
						control={control}
						render={({ field }) => (
							<TextInput {...field} id={labelKeys.visitTime} disabled={!isOpen} />
						)}
					/>
				</FormControl>
			</div>
		</Blade>
	);
};

export default RequestAccessBlade;
