import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StringParam, useQueryParams } from 'use-query-params';

import { VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { Blade, Icon, SpacePreview } from '@shared/components';
import { OPTIONAL_LABEL } from '@shared/const';
import { useGetVisitorSpace } from '@visitor-space/hooks/get-visitor-space';

import { REQUEST_ACCESS_FORM_SCHEMA } from './RequestAccessBlade.const';
import styles from './RequestAccessBlade.module.scss';
import { RequestAccessBladeProps, RequestAccessFormState } from './RequestAccessBlade.types';

const RequestAccessBlade: FC<RequestAccessBladeProps> = ({ onSubmit, isOpen, ...bladeProps }) => {
	const { t } = useTranslation();
	const [query] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});
	const { data: space } = useGetVisitorSpace(query[VISITOR_SPACE_SLUG_QUERY_KEY] || null);
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
				<FormControl className="u-mb-8 u-mb-24:md" errors={[errors.acceptTerms?.message]}>
					<Controller
						name="acceptTerms"
						control={control}
						render={({ field }) => (
							<Checkbox
								{...field}
								label={t(
									'modules/home/components/request-access-blade/request-access-blade___ik-verklaar-deze-toegang-aan-te-vragen-met-het-oog-op-onderzoeksdoeleinden-of-prive-studie'
								)}
								checked={field.value}
								checkIcon={<Icon name="check" />}
								value="accept-terms"
								disabled={!isOpen}
							/>
						)}
					/>
				</FormControl>

				<Button
					className="u-mb-8 u-mb-16:md"
					label={t(
						'modules/home/components/request-access-blade/request-access-blade___verstuur'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
					disabled={!isOpen || isSubmitting}
				/>
				<Button
					label={t(
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
			isOpen={isOpen}
			footer={renderFooter()}
			className={styles['c-request-access-blade']}
		>
			<h3 id="bladeTitle" className={styles['c-request-access-blade__title']}>
				{t(
					'modules/home/components/request-access-blade/request-access-blade___vraag-toegang-aan'
				)}
			</h3>
			<div className="u-px-16 u-px-32:md">
				{space && <SpacePreview space={space} />}
				<FormControl
					className="u-mb-24"
					errors={[errors.requestReason?.message]}
					label={t(
						'modules/home/components/request-access-blade/request-access-blade___reden-van-aanvraag'
					)}
				>
					<Controller
						name="requestReason"
						control={control}
						render={({ field }) => <TextArea {...field} disabled={!isOpen} />}
					/>
				</FormControl>

				<FormControl
					label={t(
						'modules/home/components/request-access-blade/request-access-blade___wanneer-wil-je-de-bezoekersruimte-bezoeken'
					)}
					suffix={OPTIONAL_LABEL()}
				>
					<Controller
						name="visitTime"
						control={control}
						render={({ field }) => <TextInput {...field} disabled={!isOpen} />}
					/>
				</FormControl>
			</div>
		</Blade>
	);
};

export default RequestAccessBlade;
