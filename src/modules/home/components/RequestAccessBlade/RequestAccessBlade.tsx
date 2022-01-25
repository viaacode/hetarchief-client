import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormControl, TextArea, TextInput } from '@meemoo/react-components';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Blade, Icon } from '@shared/components';
import { OPTIONAL_LABEL } from '@shared/const';

import { REQUEST_ACCESS_FORM_SCHEMA } from './RequestAccessBlade.const';
import { RequestAccessBladeProps, RequestAccessFormState } from './RequestAccessBlade.types';

const RequestAccessBlade: FC<RequestAccessBladeProps> = ({ onSubmit, ...bladeProps }) => {
	const { control, handleSubmit } = useForm<RequestAccessFormState>({
		resolver: yupResolver(REQUEST_ACCESS_FORM_SCHEMA),
	});
	const { t } = useTranslation();

	const onFormSubmit = (values: RequestAccessFormState) => {
		onSubmit?.(values);
	};

	const renderFooter = () => {
		return (
			<div className="u-px-32 u-py-16">
				<Controller
					name="acceptTerms"
					control={control}
					render={({ field }) => (
						<Checkbox
							{...field}
							className="u-mb-24"
							label={t(
								'Ik verklaar deze toegang aan te vragen met het oog op onderzoeksdoeleinden of privé studie.'
							)}
							checked={field.value}
							checkIcon={<Icon name="check" />}
						/>
					)}
				/>

				<Button
					label={t('Verstuur')}
					variants={['block', 'black']}
					onClick={handleSubmit(onFormSubmit)}
				/>
				<Button
					label={t('Annuleer')}
					variants={['block', 'text']}
					onClick={bladeProps.onClose}
				/>
			</div>
		);
	};

	return (
		<Blade {...bladeProps} title={t('Vraag toegang aan')} footer={renderFooter()}>
			<div className="u-px-32">
				<FormControl className="u-mb-24" label={t('Reden van aanvraag')}>
					<Controller
						name="requestReason"
						control={control}
						render={({ field }) => <TextArea {...field} />}
					/>
				</FormControl>

				<FormControl
					label={t('Wanneer wil je de leeszaal bezoeken?')}
					suffix={OPTIONAL_LABEL}
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
