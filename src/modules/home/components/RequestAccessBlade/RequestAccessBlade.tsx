import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StringParam, useQueryParams } from 'use-query-params';

import { Blade, Icon, IconNamesLight, SpacePreview } from '@shared/components';
import { QUERY_PARAM_KEY } from '@shared/const/query-param-keys';
import useTranslation from '@shared/hooks/use-translation/use-translation';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

import { REQUEST_ACCESS_FORM_SCHEMA } from './RequestAccessBlade.const';
import styles from './RequestAccessBlade.module.scss';
import { RequestAccessBladeProps, RequestAccessFormState } from './RequestAccessBlade.types';

const labelKeys: Record<keyof RequestAccessFormState, string> = {
	acceptTerms: 'RequestAccessBlade__acceptTerms',
	requestReason: 'RequestAccessBlade__requestReason',
	visitTime: 'RequestAccessBlade__visitTime',
};

const RequestAccessBlade: FC<RequestAccessBladeProps> = ({ onSubmit, isOpen, ...bladeProps }) => {
	const { tHtml } = useTranslation();
	const [query] = useQueryParams({
		[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});
	const { data: space } = useGetVisitorSpace(
		query[QUERY_PARAM_KEY.VISITOR_SPACE_SLUG_QUERY_KEY] || null
	);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<RequestAccessFormState>({
		resolver: yupResolver(REQUEST_ACCESS_FORM_SCHEMA()),
	});

	const onFormSubmit = async (values: RequestAccessFormState) => {
		setIsSubmitting(true);
		await onSubmit?.(values);
		setIsSubmitting(false);
	};

	useEffect(() => {
		isOpen && reset();
	}, [isOpen, reset]);

	const renderFooter = () => {
		return (
			<div className="u-px-16 u-py-16 u-px-32:md u-py-24:md">
				<FormControl
					className="u-mb-8 u-mb-24:md"
					id={labelKeys.acceptTerms}
					errors={[errors.acceptTerms?.message]}
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

				<Button
					className="u-mb-8 u-mb-16:md"
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
			renderTitle={(props) => (
				<h4
					{...props}
					className={clsx(props.className, styles['c-request-access-blade__title'])}
				>
					{tHtml(
						'modules/home/components/request-access-blade/request-access-blade___vraag-toegang-aan'
					)}
				</h4>
			)}
		>
			<div className="u-px-16 u-px-32:md">
				{space && <SpacePreview space={space} />}

				<FormControl
					className="u-mb-24"
					errors={[errors.requestReason?.message]}
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
