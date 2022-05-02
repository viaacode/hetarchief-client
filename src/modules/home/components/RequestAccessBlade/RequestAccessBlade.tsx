import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StringParam, useQueryParams } from 'use-query-params';

import { VISITOR_SPACE_SLUG_QUERY_KEY } from '@home/const';
import { useGetReadingRoom } from '@reading-room/hooks/get-reading-room';
import { Blade, Icon, SpacePreview } from '@shared/components';
import { OPTIONAL_LABEL } from '@shared/const';

import { REQUEST_ACCESS_FORM_SCHEMA } from './RequestAccessBlade.const';
import styles from './RequestAccessBlade.module.scss';
import { RequestAccessBladeProps, RequestAccessFormState } from './RequestAccessBlade.types';

const RequestAccessBlade: FC<RequestAccessBladeProps> = ({ onSubmit, ...bladeProps }) => {
	const { t } = useTranslation();
	const [{ bezoekersruimte }] = useQueryParams({
		[VISITOR_SPACE_SLUG_QUERY_KEY]: StringParam,
	});
	const { data: space } = useGetReadingRoom(bezoekersruimte);

	const {
		control,
		formState: { errors },
		handleSubmit,
		reset,
	} = useForm<RequestAccessFormState>({
		resolver: yupResolver(REQUEST_ACCESS_FORM_SCHEMA()),
	});

	const onFormSubmit = (values: RequestAccessFormState) => {
		onSubmit?.(values);
		reset();
	};

	useEffect(() => {
		bladeProps.isOpen && reset();
	}, [bladeProps.isOpen, reset]);

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-24">
				<FormControl className="u-mb-24" errors={[errors.acceptTerms?.message]}>
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
							/>
						)}
					/>
				</FormControl>

				<Button
					className="u-mb-16"
					label={t(
						'modules/home/components/request-access-blade/request-access-blade___verstuur'
					)}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
				/>
				<Button
					label={t(
						'modules/home/components/request-access-blade/request-access-blade___annuleer'
					)}
					variants={['block', 'text']}
					onClick={bladeProps.onClose}
				/>
			</div>
		);
	};

	return (
		<Blade
			{...bladeProps}
			title={t(
				'modules/home/components/request-access-blade/request-access-blade___vraag-toegang-aan'
			)}
			footer={renderFooter()}
			className={styles['c-request-access-blade']}
		>
			<div className="u-px-32">
				{space && (
					<SpacePreview
						spaceId={space.id}
						spaceImage={space.image || undefined}
						spaceLogo={space.logo}
						spaceName={space.name}
						spaceColor={space.color || undefined}
						spaceServiceDescription={space.serviceDescription || undefined}
					/>
				)}
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
						render={({ field }) => <TextArea {...field} />}
					/>
				</FormControl>

				<FormControl
					label={t(
						'modules/home/components/request-access-blade/request-access-blade___wanneer-wil-je-de-leeszaal-bezoeken'
					)}
					suffix={OPTIONAL_LABEL()}
				>
					<Controller
						name="visitTime"
						control={control}
						render={({ field }) => <TextInput {...field} />}
					/>
				</FormControl>
			</div>
		</Blade>
	);
};

export default RequestAccessBlade;
